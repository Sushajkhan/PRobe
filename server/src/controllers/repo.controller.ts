import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { Octokit } from "@octokit/rest";
import { prisma } from "../lib/prisma";
import logger from "../lib/logger";
import { installWebhook, removeWebhook } from "../services/github";

//get Octokit for the current user
async function getOctokitForUser(clerkId: string): Promise<Octokit> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { githubToken: true },
  });

  if (!user?.githubToken) {
    throw new Error(
      "GitHub token not found. Please reconnect your GitHub account.",
    );
  }

  return new Octokit({ auth: user.githubToken });
}

// Lists all repos
export async function listGithubRepos(
  req: Request,
  res: Response,
): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const octokit = await getOctokitForUser(userId);

  const { data: githubRepos } =
    await octokit.rest.repos.listForAuthenticatedUser({
      visibility: "all",
      affiliation: "owner,organization_member",
      sort: "updated",
      per_page: 100,
    });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  const connectedRepos = await prisma.repository.findMany({
    where: { userId: user!.id },
    select: { githubRepoId: true },
  });

  const connectedIds = new Set(connectedRepos.map((r) => r.githubRepoId));

  const repos = githubRepos.map((repo) => ({
    githubRepoId: String(repo.id),
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner.login,
    defaultBranch: repo.default_branch,
    private: repo.private,
    description: repo.description ?? null,
    url: repo.html_url,
    isConnected: connectedIds.has(String(repo.id)),
  }));

  logger.info({ userId, count: repos.length }, "Listed GitHub repos");
  res.status(200).json(repos);
}

// Lists repos the user has connected
export async function listConnectedRepos(
  req: Request,
  res: Response,
): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const repos = await prisma.repository.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      fullName: true,
      owner: true,
      defaultBranch: true,
      isActive: true,
      webhookId: true,
      createdAt: true,
      _count: {
        select: { reviews: true },
      },
      // Latest review for dashboard status indicator
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          status: true,
          overallSeverity: true,
          createdAt: true,
        },
      },
    },
  });

  logger.info({ userId, count: repos.length }, "Listed connected repos");
  res.status(200).json(repos);
}

// Connects a GitHub repo
export async function connectRepo(req: Request, res: Response): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const githubRepoId: string = String(req.body.githubRepoId);
  const name: string = String(req.body.name);
  const fullName: string = String(req.body.fullName);
  const owner: string = String(req.body.owner);
  const defaultBranch: string = String(req.body.defaultBranch ?? "main");

  if (!githubRepoId || !name || !fullName || !owner) {
    res.status(400).json({
      error: "Missing required fields: githubRepoId, name, fullName, owner",
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Check if already connected
  const existing = await prisma.repository.findUnique({
    where: { githubRepoId },
  });

  if (existing) {
    // If it exists but was deactivated — reactivate it instead of 409
    if (!existing.isActive) {
      const reactivated = await prisma.repository.update({
        where: { id: existing.id },
        data: { isActive: true },
      });
      logger.info({ repoId: existing.id, fullName }, "Repo reactivated");
      res.status(200).json(reactivated);
      return;
    }
    res.status(409).json({ error: "Repository is already connected" });
    return;
  }

  // Create the record before installing the webhook.
  // If webhook install fails, the repo is still in the DB and the
  // user can see it and retry — no silent data loss.

  const repo = await prisma.repository.create({
    data: {
      userId,
      githubRepoId,
      name,
      fullName,
      owner,
      defaultBranch,
      isActive: true,
    },
  });

  //Install webhook on GitHub
  try {
    const webhookId = await installWebhook({
      owner,
      repo: name,
      repoId: repo.id,
    });

    // Save webhookId — needed to delete the webhook on disconnect
    const updated = await prisma.repository.update({
      where: { id: repo.id },
      data: { webhookId },
    });

    logger.info(
      { repoId: repo.id, fullName, webhookId },
      "Repo connected successfully",
    );

    res.status(201).json(updated);
  } catch (webhookErr: any) {
    // Webhook install failed — mark inactive so the dashboard shows reconnect state rather than appearing connected with no webhook.
    await prisma.repository.update({
      where: { id: repo.id },
      data: { isActive: false },
    });

    logger.error(
      { repoId: repo.id, fullName, error: webhookErr.message },
      "Webhook install failed",
    );

    res.status(500).json({
      error:
        "Repository saved but webhook installation failed. Please try reconnecting.",
      repoId: repo.id,
    });
  }
}

// Toggles isActive on a connected repo.
export async function toggleRepo(req: Request, res: Response): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id: string = String(req.params.id);

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const repo = await prisma.repository.findFirst({
    where: { id, userId: user.id },
  });

  if (!repo) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }

  const updated = await prisma.repository.update({
    where: { id },
    data: { isActive: !repo.isActive },
  });

  logger.info(
    { repoId: id, fullName: repo.fullName, isActive: updated.isActive },
    "Repo toggled",
  );

  res.status(200).json(updated);
}

export async function disconnectRepo(
  req: Request,
  res: Response,
): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id: string = String(req.params.id);

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const repo = await prisma.repository.findFirst({
    where: { id, userId: user.id },
  });

  if (!repo) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }

  if (repo.webhookId) {
    try {
      await removeWebhook({
        owner: repo.owner,
        repo: repo.name,
        repoId: repo.id,
        webhookId: repo.webhookId,
      });
    } catch (err: any) {
      logger.warn(
        {
          repoId: id,
          webhookId: repo.webhookId,
          error: err.message,
        },
        "Webhook removal failed — continuing with DB delete",
      );
    }
  }

  await prisma.repository.delete({ where: { id } });

  logger.info({ repoId: id, fullName: repo.fullName }, "Repo disconnected");

  res.status(200).json({ message: "Repository disconnected successfully" });
}

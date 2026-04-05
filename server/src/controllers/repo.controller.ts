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
      error: "Missing required fields",
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
    // Retry webhook if inactive
    if (!existing.isActive) {
      try {
        const webhookId = await installWebhook({
          owner: existing.owner,
          repo: existing.name,
          repoId: existing.id,
        });

        const updated = await prisma.repository.update({
          where: { id: existing.id },
          data: { isActive: true, webhookId },
        });

        res.status(200).json(updated);
        return;
      } catch (err: any) {
        res.status(200).json({
          ...existing,
          isActive: false,
          webhookFailed: true,
          message: "Webhook retry failed",
        });
        return;
      }
    }

    res.status(409).json({ error: "Repository is already connected" });
    return;
  }

  // Create repo first
  const repo = await prisma.repository.create({
    data: {
      userId: user.id,
      githubRepoId,
      name,
      fullName,
      owner,
      defaultBranch,
      isActive: true,
    },
  });

  // Install webhook
  try {
    const webhookId = await installWebhook({
      owner,
      repo: name,
      repoId: repo.id,
    });

    const updated = await prisma.repository.update({
      where: { id: repo.id },
      data: { webhookId },
    });

    res.status(201).json(updated);
  } catch (err: any) {
    const updated = await prisma.repository.update({
      where: { id: repo.id },
      data: { isActive: false },
    });

    res.status(200).json({
      ...updated,
      webhookFailed: true,
      message:
        "Repository connected, but webhook installation failed. Please retry.",
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

  const id = String(req.params.id);

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

  const activating = !repo.isActive;

  if (activating) {
    try {
      let webhookId = repo.webhookId;

      if (!webhookId) {
        webhookId = await installWebhook({
          owner: repo.owner,
          repo: repo.name,
          repoId: repo.id,
        });
      }

      const updated = await prisma.repository.update({
        where: { id },
        data: { isActive: true, webhookId },
      });

      logger.info({ repoId: id, fullName: repo.fullName }, "Repo activated");

      res.status(200).json(updated);
    } catch (err: any) {
      logger.error(
        { repoId: id, error: err.message },
        "Webhook install failed on activation",
      );

      res.status(500).json({
        error: "Failed to activate repository",
      });
    }

    return;
  }

  try {
    const updated = await prisma.repository.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    logger.info({ repoId: id, fullName: repo.fullName }, "Repo deactivated");

    res.status(200).json(updated);
  } catch (err: any) {
    logger.error(
      { repoId: id, error: err.message },
      "Failed to deactivate repo",
    );

    res.status(500).json({
      error: "Failed to deactivate repository",
    });
  }
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

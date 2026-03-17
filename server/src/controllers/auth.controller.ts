import { Request, Response } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { prisma } from "../lib/prisma";
import logger from "../lib/logger";

export async function connectGithub(
  req: Request,
  res: Response,
): Promise<void> {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  const githubAccount = clerkUser.externalAccounts.find(
    (account) => account.provider === "github",
  );

  if (!githubAccount) {
    logger.warn({ userId }, "User has no GitHub account connected in Clerk");
    res.status(400).json({
      error: "No GitHub account connected. Please sign in with GitHub.",
    });
    return;
  }

  let githubToken: string | null = null;

  try {
    const tokenResponse = await clerkClient.users.getUserOauthAccessToken(
      userId,
      "github",
    );
    githubToken = tokenResponse.data?.[0]?.token ?? null;
  } catch (err: any) {
    logger.warn(
      { userId, error: err.message },
      "Failed to fetch GitHub OAuth token",
    );
  }
  const primaryEmail =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    "";

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      githubId: String(githubAccount.providerUserId),
      githubUserName: githubAccount.username ?? "",
      email: primaryEmail,
      avatarUrl: clerkUser.imageUrl ?? null,
      githubToken,
    },
    update: {
      githubUserName: githubAccount.username ?? "",
      email: primaryEmail,
      avatarUrl: clerkUser.imageUrl ?? null,
      ...(githubToken && { githubToken }),
    },
  });

  logger.info(
    {
      userId,
      dbUserId: user.id,
      githubUserName: user.githubUserName,
    },
    "User synced successfully",
  );

  res.status(200).json({
    id: user.id,
    githubUserName: user.githubUserName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    hasGithubToken: !!user.githubToken,
  });
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      githubUserName: true,
      email: true,
      avatarUrl: true,
      githubToken: false,
      createdAt: true,
      repositories: {
        select: {
          id: true,
          name: true,
          fullName: true,
          owner: true,
          defaultBranch: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: { reviews: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    res.status(404).json({
      error: "User not found. Call POST /api/auth/connect-github first.",
    });
    return;
  }

  logger.info({ userId, dbUserId: user.id }, "Fetched user profile");

  res.status(200).json(user);
}

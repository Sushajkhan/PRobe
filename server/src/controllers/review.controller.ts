import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "../lib/prisma";
import logger from "../lib/logger";

// Get all reviews of the connected repos.
export async function listReviews(req: Request, res: Response): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
  const limit = Math.min(50, parseInt(String(req.query.limit ?? "20"), 10));
  const skip = (page - 1) * limit;

  const status = req.query.status ? String(req.query.status) : undefined;
  const severity = req.query.severity ? String(req.query.severity) : undefined;
  const repositoryId = req.query.repositoryId
    ? String(req.query.repositoryId)
    : undefined;
  const search = req.query.search ? String(req.query.search) : undefined;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const userRepos = await prisma.repository.findMany({
    where: { userId: user.id },
    select: { id: true },
  });

  const repoIds = userRepos.map((r) => r.id);

  if (repoIds.length === 0) {
    res.status(200).json({ reviews: [], total: 0, page, limit, totalPages: 0 });
    return;
  }

  if (repositoryId && !repoIds.includes(repositoryId)) {
    res.status(403).json({ error: "Repository not found" });
    return;
  }

  const where = {
    repositoryId: repositoryId ? { equals: repositoryId } : { in: repoIds },
    ...(status && { status: status as any }),
    ...(severity && { overallSeverity: severity as any }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { author: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [total, reviews] = await Promise.all([
    prisma.pRReview.count({ where }),
    prisma.pRReview.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        prNumber: true,
        title: true,
        author: true,
        url: true,
        baseBranch: true,
        headBranch: true,
        status: true,
        overallSeverity: true,
        totalIssues: true,
        processingTime: true,
        createdAt: true,
        updatedAt: true,
        repository: {
          select: {
            id: true,
            name: true,
            fullName: true,
            owner: true,
          },
        },
        _count: {
          select: { findings: true },
        },
      },
    }),
  ]);

  logger.info({ userId, total, page, limit }, "Listed reviews");

  res.status(200).json({
    reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

// Get a single review
export async function getReview(req: Request, res: Response): Promise<void> {
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

  const review = await prisma.pRReview.findFirst({
    where: {
      id,
      repository: { userId: user.id },
    },
    select: {
      id: true,
      prNumber: true,
      title: true,
      author: true,
      url: true,
      baseBranch: true,
      headBranch: true,
      summary: true,
      status: true,
      overallSeverity: true,
      totalIssues: true,
      processingTime: true,
      githubCommentId: true,
      createdAt: true,
      updatedAt: true,
      repository: {
        select: {
          id: true,
          name: true,
          fullName: true,
          owner: true,
        },
      },
      findings: {
        orderBy: [{ severity: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          category: true,
          severity: true,
          filePath: true,
          lineNumber: true,
          title: true,
          description: true,
          suggestion: true,
          createdAt: true,
        },
      },
      feedback: {
        where: { userId: user.id },
        select: { isHelpful: true },
        take: 1,
      },
    },
  });

  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }

  const severityOrder: Record<string, number> = {
    CRITICAL: 0,
    WARNING: 1,
    SUGGESTION: 2,
  };
  const sortedFindings = [...review.findings].sort(
    (a, b) =>
      (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3),
  );

  logger.info({ userId, reviewId: id }, "Fetched review detail");

  res.status(200).json({
    ...review,
    findings: sortedFindings,
    userFeedback: review.feedback[0]?.isHelpful ?? null,
  });
}

// Get all reviews for a single repo.
export async function listRepoReviews(
  req: Request,
  res: Response,
): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const repoId: string = String(req.params.repoId);
  const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
  const limit = Math.min(50, parseInt(String(req.query.limit ?? "20"), 10));
  const skip = (page - 1) * limit;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const repo = await prisma.repository.findFirst({
    where: { id: repoId, userId: user.id },
  });

  if (!repo) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }

  const [total, reviews] = await Promise.all([
    prisma.pRReview.count({ where: { repositoryId: repoId } }),
    prisma.pRReview.findMany({
      where: { repositoryId: repoId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        prNumber: true,
        title: true,
        author: true,
        url: true,
        status: true,
        overallSeverity: true,
        totalIssues: true,
        processingTime: true,
        createdAt: true,
        _count: { select: { findings: true } },
      },
    }),
  ]);

  logger.info({ userId, repoId, total, page }, "Listed repo reviews");

  res.status(200).json({
    reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

// Deletes a review.
export async function deleteReview(req: Request, res: Response): Promise<void> {
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

  const review = await prisma.pRReview.findFirst({
    where: { id, repository: { userId: user.id } },
    select: { id: true },
  });

  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }

  await prisma.pRReview.delete({ where: { id } });

  logger.info({ userId, reviewId: id }, "Review deleted");

  res.status(200).json({ message: "Review deleted successfully" });
}

// Submits feedback on a review.
export async function submitFeedback(
  req: Request,
  res: Response,
): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id: string = String(req.params.id);
  const isHelpful: boolean = Boolean(req.body.isHelpful);

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const review = await prisma.pRReview.findFirst({
    where: { id, repository: { userId: user.id } },
    select: { id: true },
  });

  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }

  const feedback = await prisma.reviewFeedback.upsert({
    where: {
      reviewId_userId: {
        reviewId: id,
        userId: user.id,
      },
    },
    create: { reviewId: id, userId: user.id, isHelpful },
    update: { isHelpful },
  });

  logger.info({ userId, reviewId: id, isHelpful }, "Feedback submitted");

  res.status(200).json(feedback);
}

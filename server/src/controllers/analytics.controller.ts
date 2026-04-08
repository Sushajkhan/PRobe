import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "../lib/prisma";
import logger from "../lib/logger";

// Dashboard stats
export async function getOverview(req: Request, res: Response): Promise<void> {
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
    select: { id: true },
  });

  const repoIds = repos.map((r) => r.id);

  if (repoIds.length === 0) {
    res.status(200).json({
      totalRepos: 0,
      totalReviews: 0,
      totalFindings: 0,
      severityCounts: { CRITICAL: 0, WARNING: 0, SUGGESTION: 0 },
      categoryCounts: {},
      statusCounts: { QUEUED: 0, PROCESSING: 0, COMPLETED: 0, FAILED: 0 },
      recentReviews: [],
      reviewsThisWeek: 0,
      criticalThisWeek: 0,
      findingsThisWeek: 0,
      reviewedToday: 0,
    });
    return;
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalReviews,
    totalFindings,
    severityGroups,
    categoryGroups,
    statusGroups,
    recentReviews,
    reviewsThisWeek,
    criticalThisWeek,
    findingsThisWeek,
    reviewedToday,
  ] = await Promise.all([
    prisma.pRReview.count({
      where: { repositoryId: { in: repoIds } },
    }),

    prisma.reviewFinding.count({
      where: { review: { repositoryId: { in: repoIds } } },
    }),

    prisma.reviewFinding.groupBy({
      by: ["severity"],
      where: { review: { repositoryId: { in: repoIds } } },
      _count: { severity: true },
    }),

    prisma.reviewFinding.groupBy({
      by: ["category"],
      where: { review: { repositoryId: { in: repoIds } } },
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    }),

    prisma.pRReview.groupBy({
      by: ["status"],
      where: { repositoryId: { in: repoIds } },
      _count: { status: true },
    }),

    prisma.pRReview.findMany({
      where: { repositoryId: { in: repoIds } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        prNumber: true,
        title: true,
        status: true,
        overallSeverity: true,
        totalIssues: true,
        createdAt: true,
        repository: {
          select: { name: true, fullName: true },
        },
      },
    }),

    prisma.pRReview.count({
      where: {
        repositoryId: { in: repoIds },
        createdAt: { gte: weekAgo },
      },
    }),

    prisma.reviewFinding.count({
      where: {
        severity: "CRITICAL",
        review: { repositoryId: { in: repoIds } },
        createdAt: { gte: weekAgo },
      },
    }),

    prisma.reviewFinding.count({
      where: {
        review: { repositoryId: { in: repoIds } },
        createdAt: { gte: weekAgo },
      },
    }),

    prisma.pRReview.count({
      where: {
        repositoryId: { in: repoIds },
        createdAt: { gte: todayStart },
      },
    }),
  ]);

  const severityCounts = severityGroups.reduce(
    (acc, g) => {
      acc[g.severity] = g._count.severity;
      return acc;
    },
    { CRITICAL: 0, WARNING: 0, SUGGESTION: 0 } as Record<string, number>,
  );

  const categoryCounts = categoryGroups.reduce(
    (acc, g) => {
      acc[g.category] = g._count.category;
      return acc;
    },
    {} as Record<string, number>,
  );

  const statusCounts = statusGroups.reduce(
    (acc, g) => {
      acc[g.status] = g._count.status;
      return acc;
    },
    { QUEUED: 0, PROCESSING: 0, COMPLETED: 0, FAILED: 0 } as Record<
      string,
      number
    >,
  );

  logger.info(
    { userId, totalReviews, totalFindings, reviewsThisWeek, reviewedToday },
    "Fetched analytics overview",
  );

  res.status(200).json({
    totalRepos: repoIds.length,
    totalReviews,
    totalFindings,
    severityCounts,
    categoryCounts,
    statusCounts,
    recentReviews,
    reviewsThisWeek,
    criticalThisWeek,
    findingsThisWeek,
    reviewedToday,
  });
}

// Per-repo analytics

export async function getRepoAnalytics(
  req: Request,
  res: Response,
): Promise<void> {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const repoId =
    (req.params.repoId as string | undefined) ||
    (req.query.repoId as string | undefined);

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
    select: { id: true, name: true, fullName: true },
  });

  if (repos.length === 0) {
    res.status(200).json({
      repo: null,
      totalReviews: 0,
      totalFindings: 0,
      severityCounts: { CRITICAL: 0, WARNING: 0, SUGGESTION: 0 },
      categoryCounts: {},
      trend: [],
      topProblematicFiles: [],
    });
    return;
  }

  const repoIds = repoId ? [repoId] : repos.map((r) => r.id);

  let repo: { id: string; name: string; fullName: string } | null = null;

  if (repoId) {
    const found = repos.find((r) => r.id === repoId);

    if (!found) {
      res.status(404).json({ error: "Repository not found" });
      return;
    }

    repo = {
      id: found.id,
      name: found.name,
      fullName: found.fullName,
    };
  }

  const [
    totalReviews,
    totalFindings,
    severityGroups,
    categoryGroups,
    recentTrend,
    topFiles,
  ] = await Promise.all([
    prisma.pRReview.count({
      where: {
        repositoryId: { in: repoIds },
        status: "COMPLETED",
      },
    }),

    prisma.reviewFinding.count({
      where: {
        review: { repositoryId: { in: repoIds } },
      },
    }),

    prisma.reviewFinding.groupBy({
      by: ["severity"],
      where: {
        review: { repositoryId: { in: repoIds } },
      },
      _count: { severity: true },
    }),

    prisma.reviewFinding.groupBy({
      by: ["category"],
      where: {
        review: { repositoryId: { in: repoIds } },
      },
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    }),

    prisma.pRReview.findMany({
      where: {
        repositoryId: { in: repoIds },
        status: "COMPLETED",
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        prNumber: true,
        title: true,
        overallSeverity: true,
        totalIssues: true,
        createdAt: true,
      },
    }),

    prisma.reviewFinding.groupBy({
      by: ["filePath"],
      where: {
        review: { repositoryId: { in: repoIds } },
      },
      _count: { filePath: true },
      orderBy: { _count: { filePath: "desc" } },
      take: 10,
    }),
  ]);

  const severityCounts = severityGroups.reduce(
    (acc, g) => {
      acc[g.severity] = g._count.severity;
      return acc;
    },
    { CRITICAL: 0, WARNING: 0, SUGGESTION: 0 } as Record<string, number>,
  );

  const categoryCounts = categoryGroups.reduce(
    (acc, g) => {
      acc[g.category] = g._count.category;
      return acc;
    },
    {} as Record<string, number>,
  );

  const trend = [...recentTrend].reverse();

  const topProblematicFiles = topFiles.map((f) => ({
    filePath: f.filePath,
    findingCount: f._count.filePath,
  }));

  logger.info(
    {
      userId,
      repoId: repoId ?? "ALL",
      totalReviews,
      totalFindings,
    },
    "Fetched analytics",
  );

  res.status(200).json({
    repo,
    totalReviews,
    totalFindings,
    severityCounts,
    categoryCounts,
    trend,
    topProblematicFiles,
  });
}

// Top recurring issues across all repos.
export async function getTopFindings(
  req: Request,
  res: Response,
): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const limit = Math.min(20, parseInt(String(req.query.limit ?? "10"), 10));

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
    select: { id: true },
  });

  const repoIds = repos.map((r) => r.id);

  if (repoIds.length === 0) {
    res.status(200).json({ findings: [] });
    return;
  }

  const topFindings = await prisma.reviewFinding.groupBy({
    by: ["title", "category", "severity"],
    where: { review: { repositoryId: { in: repoIds } } },
    _count: { title: true },
    orderBy: { _count: { title: "desc" } },
    take: limit,
  });

  const findings = topFindings.map((f) => ({
    title: f.title,
    category: f.category,
    severity: f.severity,
    occurrences: f._count.title,
  }));

  logger.info({ userId, count: findings.length }, "Fetched top findings");

  res.status(200).json({ findings });
}

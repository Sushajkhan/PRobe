import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import logger from "../lib/logger";
import { prReviewQueue, PRReviewJobData } from "../queues/prReview.queue";
import { verifyGitHubSignature } from "../utils/verifyGithubSignature";

export async function handleGitHubWebhook(
  req: Request,
  res: Response,
): Promise<void> {
  const rawBody = req.body as Buffer;
  const event = req.headers["x-github-event"] as string;
  const signature = req.headers["x-hub-signature-256"] as string;
  const deliveryId = req.headers["x-github-delivery"] as string;

  if (!event || !signature || !deliveryId) {
    logger.warn({ event, deliveryId }, "Webhook missing required headers");
    res.status(400).json({ error: "Missing required GitHub webhook headers" });
    return;
  }

  if (!verifyGitHubSignature(rawBody, signature)) {
    logger.warn({ deliveryId, event }, "Webhook signature verification failed");
    res.status(401).json({ error: "Invalid signature" });
    return;
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    logger.warn({ deliveryId }, "Webhook body is not valid JSON");
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  if (event !== "pull_request") {
    res.status(200).json({ message: `Event "${event}" ignored` });
    return;
  }

  const { action, pull_request: pr, repository } = payload;

  if (!["opened", "synchronize"].includes(action)) {
    res.status(200).json({ message: `Action "${action}" ignored` });
    return;
  }

  res.status(200).json({ message: "Webhook received — review queued" });

  try {
    const owner = repository.owner.login as string;
    const repo = repository.name as string;
    const repoFullName = repository.full_name as string;

    logger.info(
      {
        deliveryId,
        action,
        repo: repoFullName,
        pr: pr.number,
      },
      "Processing pull_request webhook",
    );

    const repoRecord = await prisma.repository.findUnique({
      where: { githubRepoId: String(repository.id) },
    });

    if (!repoRecord) {
      logger.info(
        { repo: repoFullName },
        "Webhook for unregistered repo — ignoring",
      );
      return;
    }

    if (!repoRecord.isActive) {
      logger.info(
        { repo: repoFullName },
        "Webhook for inactive repo — ignoring",
      );
      return;
    }

    const review = await prisma.pRReview.upsert({
      where: {
        repositoryId_prNumber: {
          repositoryId: repoRecord.id,
          prNumber: pr.number,
        },
      },
      create: {
        repositoryId: repoRecord.id,
        prNumber: pr.number,
        title: pr.title,
        author: pr.user.login,
        url: pr.html_url,
        baseBranch: pr.base.ref,
        headBranch: pr.head.ref,
        status: "QUEUED",
        overallSeverity: null,
      },
      update: {
        title: pr.title,
        status: "QUEUED",
        overallSeverity: null,
        summary: null,
        totalIssues: 0,
        githubCommentId: null,
        processingTime: null,
        diffs3Key: null,
      },
    });

    if (action === "synchronize") {
      await prisma.reviewFinding.deleteMany({
        where: { reviewId: review.id },
      });
    }

    const jobData: PRReviewJobData = {
      owner,
      repo,
      prNumber: pr.number,
      prTitle: pr.title,
      prAuthor: pr.user.login,
      prUrl: pr.html_url,
      baseBranch: pr.base.ref,
      headBranch: pr.head.ref,
      repoId: repoRecord.id,
      reviewId: review.id,
    };

    const job = await prReviewQueue.add("pr-review", jobData, {
      jobId: deliveryId,
    });

    logger.info(
      {
        jobId: job.id,
        reviewId: review.id,
        repo: repoFullName,
        pr: pr.number,
        action,
      },
      "PR review job queued successfully",
    );
  } catch (err: any) {
    logger.error(
      {
        deliveryId,
        error: err.message,
      },
      "Failed to queue PR review job after webhook",
    );
  }
}

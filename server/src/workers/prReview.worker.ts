import { Worker, Job } from "bullmq";
import { redisWorkerOptions } from "../lib/redis";
import { prisma } from "../lib/prisma";
import logger from "../lib/logger";
import { PR_REVIEW_QUEUE, PRReviewJobData } from "../queues/prReview.queue";
import { fetchPRDiff, postPRComment } from "../services/github";
import { uploadDiffToS3 } from "../services/s3";
import { generateCodeReview } from "../services/gemini";
import { Worker as BullWorker } from "bullmq";

async function processReview(job: Job<PRReviewJobData>): Promise<void> {
  const {
    owner,
    repo,
    prNumber,
    prTitle,
    prAuthor,
    baseBranch,
    headBranch,
    repoId,
    reviewId,
  } = job.data;

  const repoFullName = `${owner}/${repo}`;
  const startedAt = Date.now();

  logger.info(
    { jobId: job.id, repoFullName, prNumber, reviewId },
    "Starting PR review job",
  );

  await prisma.pRReview.update({
    where: { id: reviewId },
    data: { status: "PROCESSING" },
  });

  await job.updateProgress(10);

  logger.info({ reviewId, prNumber }, "Fetching PR diff");

  const diff = await fetchPRDiff({ owner, repo, prNumber, repoId });

  await job.updateProgress(25);

  logger.info({ reviewId }, "Uploading diff to S3");

  const s3Key = await uploadDiffToS3(repoId, prNumber, reviewId, diff);

  await prisma.pRReview.update({
    where: { id: reviewId },
    data: { diffs3Key: s3Key },
  });

  await job.updateProgress(40);

  logger.info({ reviewId }, "Sending diff to Gemini");

  const aiReview = await generateCodeReview({
    prTitle,
    prAuthor,
    repoName: repoFullName,
    baseBranch,
    headBranch,
    diff,
  });

  await job.updateProgress(70);

  logger.info(
    { reviewId, findingCount: aiReview.findings.length },
    "Saving findings to DB",
  );

  await prisma.$transaction([
    prisma.reviewFinding.createMany({
      data: aiReview.findings.map((f) => ({
        reviewId,
        category: f.category,
        severity: f.severity,
        filePath: f.filePath,
        lineNumber: f.lineNumber ?? null,
        title: f.title,
        description: f.description,
        suggestion: f.suggestion ?? null,
      })),
    }),

    prisma.pRReview.update({
      where: { id: reviewId },
      data: {
        summary: aiReview.summary,
        overallSeverity: aiReview.overallSeverity,
        totalIssues: aiReview.findings.length,
      },
    }),
  ]);

  await job.updateProgress(85);

  logger.info({ reviewId, prNumber }, "Posting comment on GitHub PR");

  const commentId = await postPRComment({
    owner,
    repo,
    prNumber,
    repoId,
    review: aiReview,
  });

  await job.updateProgress(95);

  const processingTime = Math.round((Date.now() - startedAt) / 1000); // seconds

  await prisma.pRReview.update({
    where: { id: reviewId },
    data: {
      status: "COMPLETED",
      githubCommentId: commentId.toString(),
      processingTime,
    },
  });

  await job.updateProgress(100);

  logger.info(
    {
      jobId: job.id,
      reviewId,
      repoFullName,
      prNumber,
      overallSeverity: aiReview.overallSeverity,
      findings: aiReview.findings.length,
      processingTime: `${processingTime}s`,
    },
    "PR review completed",
  );
}

export function startWorker(): BullWorker<PRReviewJobData> {
  const worker = new Worker<PRReviewJobData>(PR_REVIEW_QUEUE, processReview, {
    connection: redisWorkerOptions,
    concurrency: 3,
  });

  worker.on("completed", (job) => {
    logger.info(
      { jobId: job.id, reviewId: job.data.reviewId },
      "Job completed",
    );
  });

  worker.on("failed", async (job, err) => {
    if (!job) return;

    const isLastAttempt = job.attemptsMade >= (job.opts.attempts ?? 1);

    logger.error(
      {
        jobId: job.id,
        reviewId: job.data.reviewId,
        attempt: job.attemptsMade,
        maxAttempts: job.opts.attempts,
        error: err.message,
      },
      isLastAttempt ? "Job failed permanently" : "Job failed — will retry",
    );

    if (isLastAttempt) {
      await prisma.pRReview
        .update({
          where: { id: job.data.reviewId },
          data: { status: "FAILED" },
        })
        .catch((dbErr) => {
          logger.error(
            { error: dbErr.message },
            "Failed to mark review as FAILED in DB",
          );
        });
    }
  });

  worker.on("error", (err) => {
    logger.error({ error: err.message }, "Worker error");
  });

  logger.info(
    { queue: PR_REVIEW_QUEUE, concurrency: 3 },
    "Worker started — waiting for jobs",
  );

  return worker;
}

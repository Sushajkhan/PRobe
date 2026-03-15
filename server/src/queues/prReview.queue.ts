import { Queue } from "bullmq";
import { redisQueueOptions } from "../lib/redis";

export interface PRReviewJobData {
  owner: string;
  repo: string;
  prNumber: number;
  prTitle: string;
  prAuthor: string;
  prUrl: string;
  baseBranch: string;
  headBranch: string;
  repoId: string;
  reviewId: string;
}

export const PR_REVIEW_QUEUE = "pr-review";

export const prReviewQueue = new Queue<PRReviewJobData>(PR_REVIEW_QUEUE, {
  connection: redisQueueOptions,

  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },

    removeOnComplete: { age: 86400, count: 100 },

    removeOnFail: { age: 604800, count: 500 },
  },
});

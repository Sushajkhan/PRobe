import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validate<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

// Request validation schemas
export const ConnectRepoSchema = z.object({
  githubRepoId: z.string(),
  name: z.string().min(1).max(100),
  fullName: z.string().min(1).max(200),
  owner: z.string().min(1).max(100),
  defaultBranch: z.string().default("main"),
});

export const FeedbackSchema = z.object({
  isHelpful: z.boolean(),
});

export const TriggerReviewSchema = z.object({
  repoId: z.cuid(),
  prNumber: z.number().int().positive(),
});

export type ConnectRepoBody = z.infer<typeof ConnectRepoSchema>;
export type FeedbackBody = z.infer<typeof FeedbackSchema>;
export type TriggerReviewBody = z.infer<typeof TriggerReviewSchema>;

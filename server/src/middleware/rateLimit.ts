import { rateLimit } from "express-rate-limit";

// Review trigger limiter
export const reviewTriggerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  keyGenerator: (req: any) => req.dbUser?.id || req.ip,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Review limit reached. Try again in 1 hour.",
    },
  },
});

// Webhook limiter
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Webhook rate limit exceeded",
    },
  },
});

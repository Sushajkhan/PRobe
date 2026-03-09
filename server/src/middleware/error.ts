import { Request, Response, NextFunction } from "express";
import logger from "../lib/logger";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public code = "INTERNAL_ERROR",
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function ErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: err.issues,
      },
    });
    return;
  }

  // Handle app errors
  if (err instanceof AppError) {
    logger.error(`${req.method} ${req.path} - ${err.message}`, {
      code: err.code,
      stack: err.stack,
    });
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // handle unknown errors
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";
  const stack = err instanceof Error ? err.stack : undefined;

  logger.error(`${req.method} ${req.path} — ${message}`, { stack });

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : message,
    },
  });
}

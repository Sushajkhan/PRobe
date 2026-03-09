import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      dbUser?: {
        id: string;
        clerkId: string;
        githubUserName: string;
        githubToken: string | null;
      };
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        githubUserName: true,
        githubToken: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: "USER_NOT_FOUND", message: "User account not set up" },
      });
      return;
    }

    req.dbUser = user;
    next();
  } catch (err) {
    next(err);
  }
}

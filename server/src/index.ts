import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { clerkMiddleware } from "@clerk/express";
import "dotenv/config";
import { ErrorHandler } from "./middleware/error";
import pinoHttp from "pino-http";
import logger from "./lib/logger";
import router from "./routes";
import { prisma } from "./lib/prisma";
import { startWorker } from "./workers/prReview.worker";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  pinoHttp({
    logger,
    autoLogging: { ignore: (req) => req.url === "/test" },
  }),
);

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));
app.use(clerkMiddleware());

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    validate: {
      xForwardedForHeader: false,
    },
  }),
);

app.use("/api", router);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

app.use(ErrorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} — ${process.env.NODE_ENV}`);
});

const worker = startWorker();

async function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down...");
  server.close();
  await worker.close();
  await prisma.$disconnect();
  logger.info("Shutdown complete");
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;

import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { clerkMiddleware } from "@clerk/express";
import "dotenv/config";
import { ErrorHandler } from "./middleware/error";
import pinoHttp from "pino-http";
import logger from "./lib/logger";

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
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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

app.get("/test", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

app.use(ErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} — ${process.env.NODE_ENV}`);
});

export default app;

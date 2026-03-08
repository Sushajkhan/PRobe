import { Redis } from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
};

// Queue
export const redisQueue = new Redis({
  ...redisConfig,
  connectionName: "queue-producer",
  maxRetriesPerRequest: 1,
  enableReadyCheck: false,
  enableOfflineQueue: false,
});

// Worker
export const redisWorker = new Redis({
  ...redisConfig,
  connectionName: "bullmq-worker",
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  enableOfflineQueue: true,
});

redisQueue.on("error", (err) => console.error("Redis queue error:", err));
redisQueue.on("connect", () => console.log("Redis queue connected"));

redisWorker.on("error", (err) => console.error("Redis worker error:", err));
redisWorker.on("connect", () => console.log("Redis worker connected"));

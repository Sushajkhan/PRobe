import IORedis from "ioredis";

function parseRedisUrl(url: string): {
  host: string;
  port: number;
  password?: string;
} {
  const parsed = new URL(url);
  const password = parsed.password
    ? decodeURIComponent(parsed.password)
    : undefined;

  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || "6379", 10),
    password,
  };
}

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const baseOptions = parseRedisUrl(REDIS_URL);

export const redisQueueOptions = {
  ...baseOptions,
  maxRetriesPerRequest: 1 as const,
};

export const redisWorkerOptions = {
  ...baseOptions,
  maxRetriesPerRequest: null as null,
};

export const redis = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: 1,
  lazyConnect: true,
  enableReadyCheck: true,
});

redis.on("connect", () => {
  const { host, port } = baseOptions;
  const logger = require("./logger").default;
  logger.info({ host, port }, "Redis connected");
});

redis.on("error", (err: Error) => {
  const logger = require("./logger").default;
  logger.error({ error: err.message }, "Redis error");
});

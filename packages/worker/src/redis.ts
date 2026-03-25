import { ConfigService } from "@nestjs/config";
import IORedis from "ioredis";

export function getRedisConnection(configService: ConfigService): IORedis {
  const redisUrl = configService.get<string>("REDIS_URL");

  if (!redisUrl) {
    throw new Error("REDIS_URL environment variable is required");
  }

  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null, // Required by BullMQ
  });
}

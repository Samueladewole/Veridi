import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis | null;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>("REDIS_URL");

    if (!redisUrl) {
      this.logger.warn("REDIS_URL not configured — caching disabled");
      this.client = null;
      return;
    }

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 5) {
          this.logger.error("Redis connection failed after 5 retries");
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: false,
    });

    this.client.on("connect", () => {
      this.logger.log("Redis connected");
    });

    this.client.on("error", (err: Error) => {
      this.logger.error(`Redis error: ${err.message}`);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;

    try {
      const raw = await this.client.get(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Redis GET failed for key "${key}": ${message}`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.client) return;

    try {
      const serialized = JSON.stringify(value);
      await this.client.set(key, serialized, "EX", ttlSeconds);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Redis SET failed for key "${key}": ${message}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.del(key);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Redis DEL failed for key "${key}": ${message}`);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.client) return;

    try {
      let cursor = "0";
      do {
        const [nextCursor, keys] = await this.client.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          100,
        );
        cursor = nextCursor;
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== "0");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Redis DELPATTERN failed for "${pattern}": ${message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.logger.log("Redis disconnected");
    }
  }
}

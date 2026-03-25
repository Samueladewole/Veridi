import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { createHash } from "crypto";
import { prisma } from "@veridi/database";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { RedisService } from "../services/redis.service";

interface CachedApiKey {
  id: string;
  keyPrefix: string;
  clientId: string;
  isLive: boolean;
  revokedAt: string | null;
  ipAllowlist: string[];
  client: {
    id: string;
    name: string;
    status: string;
    email: string;
    tier: string;
  };
}

const API_KEY_CACHE_TTL = 5 * 60; // 5 minutes

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"] as string | undefined;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid API key");
    }

    const rawKey = authHeader.slice(7);
    const keyHash = createHash("sha256").update(rawKey).digest("hex");

    const apiKey = await this.getApiKeyByHash(keyHash);

    if (!apiKey) {
      throw new UnauthorizedException("Invalid API key");
    }

    if (apiKey.revokedAt) {
      throw new UnauthorizedException("API key has been revoked");
    }

    if (apiKey.client.status !== "ACTIVE") {
      throw new ForbiddenException("Client account is not active");
    }

    // Check IP allowlist
    if (apiKey.ipAllowlist.length > 0) {
      const clientIp =
        request.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        request.ip;

      if (!apiKey.ipAllowlist.includes(clientIp)) {
        this.logger.warn(
          `IP ${clientIp} not in allowlist for key ${apiKey.keyPrefix}`,
        );
        throw new ForbiddenException("IP address not allowed");
      }
    }

    // Update last used timestamp (fire and forget)
    prisma.apiKey
      .update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      })
      .catch(() => {
        /* non-critical */
      });

    // Attach client and key info to request
    request.apiKey = apiKey;
    request.client = apiKey.client;

    return true;
  }

  private async getApiKeyByHash(keyHash: string): Promise<CachedApiKey | null> {
    const cacheKey = `apikey:${keyHash}`;

    // Try cache first
    const cached = await this.redisService.get<CachedApiKey>(cacheKey);
    if (cached) {
      this.logger.debug(`API key cache HIT for ${cacheKey}`);
      return cached;
    }

    // Fall through to DB
    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: { client: true },
    });

    if (!apiKey) return null;

    const cacheable: CachedApiKey = {
      id: apiKey.id,
      keyPrefix: apiKey.keyPrefix,
      clientId: apiKey.clientId,
      isLive: apiKey.isLive,
      revokedAt: apiKey.revokedAt?.toISOString() ?? null,
      ipAllowlist: apiKey.ipAllowlist,
      client: {
        id: apiKey.client.id,
        name: apiKey.client.name,
        status: apiKey.client.status,
        email: apiKey.client.email,
        tier: apiKey.client.tier,
      },
    };

    // Cache the result (don't cache revoked keys to avoid stale denials)
    if (!apiKey.revokedAt) {
      await this.redisService.set(cacheKey, cacheable, API_KEY_CACHE_TTL);
    }

    return cacheable;
  }
}

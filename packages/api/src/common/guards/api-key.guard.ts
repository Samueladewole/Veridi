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

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private readonly reflector: Reflector) {}

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

    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: { client: true },
    });

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
}

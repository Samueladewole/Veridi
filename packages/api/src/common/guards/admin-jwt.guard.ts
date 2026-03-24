import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import { prisma } from "@veridi/database";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

interface AdminJwtPayload {
  sub: string;
  email: string;
  isSuperAdmin: boolean;
  type: "admin_access";
}

@Injectable()
export class AdminJwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
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
      throw new UnauthorizedException("Missing admin token");
    }

    const token = authHeader.slice(7);

    try {
      const secret = this.configService.get<string>("JWT_SECRET")!;
      const payload = jwt.verify(token, secret) as AdminJwtPayload;

      if (payload.type !== "admin_access") {
        throw new UnauthorizedException("Invalid token type");
      }

      const admin = await prisma.adminUser.findUnique({
        where: { id: payload.sub },
      });

      if (!admin) {
        throw new UnauthorizedException("Admin not found");
      }

      request.admin = admin;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}

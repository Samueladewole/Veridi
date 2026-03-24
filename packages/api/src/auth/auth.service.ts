import {
  Injectable,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { prisma } from "@veridi/database";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly configService: ConfigService) {}

  async adminLogin(email: string, password: string): Promise<TokenPair> {
    const admin = await prisma.adminUser.findUnique({ where: { email } });

    if (!admin) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await argon2.verify(admin.passwordHash, password);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    this.logger.log(`Admin login: ${admin.email}`);

    return this.generateTokenPair(admin.id, admin.email, admin.isSuperAdmin);
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    try {
      const secret = this.configService.get<string>("JWT_REFRESH_SECRET")!;
      const payload = jwt.verify(refreshToken, secret) as {
        sub: string;
        email: string;
        isSuperAdmin: boolean;
        type: string;
      };

      if (payload.type !== "admin_refresh") {
        throw new UnauthorizedException("Invalid token type");
      }

      // Verify admin still exists
      const admin = await prisma.adminUser.findUnique({
        where: { id: payload.sub },
      });

      if (!admin) {
        throw new UnauthorizedException("Admin not found");
      }

      return this.generateTokenPair(admin.id, admin.email, admin.isSuperAdmin);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  private generateTokenPair(
    adminId: string,
    email: string,
    isSuperAdmin: boolean,
  ): TokenPair {
    const accessSecret = this.configService.get<string>("JWT_SECRET")!;
    const refreshSecret = this.configService.get<string>("JWT_REFRESH_SECRET")!;
    const accessExpiry = this.configService.get<string>("JWT_ACCESS_EXPIRY") || "15m";
    const refreshExpiry = this.configService.get<string>("JWT_REFRESH_EXPIRY") || "7d";

    const accessToken = jwt.sign(
      { sub: adminId, email, isSuperAdmin, type: "admin_access" },
      accessSecret,
      { expiresIn: accessExpiry } as jwt.SignOptions,
    );

    const refreshToken = jwt.sign(
      { sub: adminId, email, isSuperAdmin, type: "admin_refresh" },
      refreshSecret,
      { expiresIn: refreshExpiry } as jwt.SignOptions,
    );

    return { accessToken, refreshToken, expiresIn: accessExpiry };
  }
}

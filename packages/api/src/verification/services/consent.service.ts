import {
  Injectable,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { prisma } from "@veridi/database";

interface ConsentPayload {
  sub: string;
  clientId: string;
  purpose: string;
  type: "consent";
}

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);

  constructor(private readonly configService: ConfigService) {}

  async issueConsentToken(
    clientId: string,
    purpose: string,
    subjectId: string,
  ): Promise<{ consent_token: string; expires_at: string }> {
    const subjectToken = await argon2.hash(subjectId);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.consentRecord.create({
      data: {
        clientId,
        subjectToken,
        purpose,
        expiresAt,
      },
    });

    const secret = this.configService.get<string>("JWT_SECRET")!;
    const token = jwt.sign(
      { sub: subjectToken, clientId, purpose, type: "consent" },
      secret,
      { expiresIn: "10m" } as jwt.SignOptions,
    );

    this.logger.log(`Consent token issued for client ${clientId}`);

    return {
      consent_token: token,
      expires_at: expiresAt.toISOString(),
    };
  }

  async validateConsentToken(
    token: string,
    clientId: string,
  ): Promise<ConsentPayload> {
    try {
      const secret = this.configService.get<string>("JWT_SECRET")!;
      const payload = jwt.verify(token, secret) as ConsentPayload;

      if (payload.type !== "consent") {
        throw new UnauthorizedException("Invalid consent token type");
      }

      if (payload.clientId !== clientId) {
        throw new UnauthorizedException("Consent token client mismatch");
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException("Invalid or expired consent token");
    }
  }
}

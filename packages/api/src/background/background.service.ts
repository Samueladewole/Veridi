import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import * as argon2 from "argon2";
import { prisma, VerificationStatus } from "@veridi/database";
import { ConsentService } from "../verification/services/consent.service";
import { QueueService } from "../common/services/queue.service";

@Injectable()
export class BackgroundService {
  private readonly logger = new Logger(BackgroundService.name);

  constructor(
    private readonly consentService: ConsentService,
    private readonly queueService: QueueService,
  ) {}

  async requestCheck(
    subjectNin: string,
    consentToken: string,
    checkTypes: string[],
    clientId: string,
    webhookUrl?: string,
  ) {
    await this.consentService.validateConsentToken(consentToken, clientId);

    const subjectToken = await argon2.hash(subjectNin);

    const check = await prisma.backgroundCheck.create({
      data: {
        clientId,
        subjectToken,
        checkTypes,
        status: VerificationStatus.PENDING,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    await this.queueService.addBackgroundCheckJob({
      checkId: check.id,
      clientId,
      subjectToken,
      checkTypes,
      webhookUrl,
    });

    this.logger.log(`Background check queued: ${check.id} [${checkTypes.join(", ")}]`);

    return {
      request_id: check.id,
      status: "PENDING",
      check_types: checkTypes,
      estimated_completion: "48 hours",
    };
  }

  async getCheck(requestId: string, clientId: string) {
    const check = await prisma.backgroundCheck.findUnique({
      where: { id: requestId },
    });

    if (!check) {
      throw new NotFoundException("Background check not found");
    }

    if (check.clientId !== clientId) {
      throw new ForbiddenException("Access denied");
    }

    return {
      request_id: check.id,
      status: check.status,
      check_types: check.checkTypes,
      report_url: check.reportUrl,
      requested_at: check.requestedAt.toISOString(),
      completed_at: check.completedAt?.toISOString() ?? null,
    };
  }
}

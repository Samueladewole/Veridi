import {
  Controller,
  Delete,
  Param,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { prisma } from "@veridi/database";

@ApiTags("Consent")
@ApiBearerAuth()
@Controller("v1/consent")
export class ConsentController {
  private readonly logger = new Logger(ConsentController.name);

  @Delete("subject/:subject_token")
  @ApiOperation({ summary: "Right to erasure — delete all subject data" })
  async deleteSubjectData(@Param("subject_token") subjectToken: string) {
    // Delete all data linked to this subject token
    const [verifications, consents, backgroundChecks, identity] = await Promise.all([
      prisma.verificationRequest.deleteMany({ where: { subjectToken } }),
      prisma.consentRecord.deleteMany({ where: { subjectToken } }),
      prisma.backgroundCheck.deleteMany({ where: { subjectToken } }),
      prisma.subjectIdentity.deleteMany({ where: { subjectToken } }),
    ]);

    this.logger.log(
      `Erasure completed for subject: ${verifications.count} verifications, ` +
      `${consents.count} consents, ${backgroundChecks.count} background checks, ` +
      `${identity.count} identities deleted`,
    );

    return {
      erased: true,
      records_deleted: {
        verifications: verifications.count,
        consents: consents.count,
        background_checks: backgroundChecks.count,
        identities: identity.count,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

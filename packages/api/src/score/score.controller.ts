import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { prisma } from "@veridi/database";

@ApiTags("Score")
@ApiBearerAuth()
@Controller("v1/score")
export class ScoreController {
  @Get(":subject_token")
  @ApiOperation({ summary: "Get Veridi Score for a subject" })
  async getScore(@Param("subject_token") subjectToken: string) {
    const subject = await prisma.subjectIdentity.findUnique({
      where: { subjectToken },
    });

    if (!subject || subject.veridiScore === null) {
      return {
        score: null,
        message: "Insufficient data",
        subject_token: subjectToken,
      };
    }

    return {
      score: subject.veridiScore,
      band: this.getScoreBand(subject.veridiScore),
      verification_count: subject.verificationCount,
      last_verified_at: subject.lastVerifiedAt?.toISOString() ?? null,
      score_updated_at: subject.scoreUpdatedAt?.toISOString() ?? null,
    };
  }

  private getScoreBand(score: number): string {
    if (score >= 800) return "Trusted";
    if (score >= 600) return "Established";
    if (score >= 400) return "Emerging";
    if (score >= 200) return "New";
    return "Unverified";
  }
}

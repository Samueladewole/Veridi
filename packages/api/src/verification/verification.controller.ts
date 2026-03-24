import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthenticatedRequest } from "../common/types";
import { VerificationService } from "./verification.service";
import { ConsentService } from "./services/consent.service";
import {
  VerifyNinDto,
  VerifyBvnDto,
  VerifyDriversLicenceDto,
  VerifyPassportDto,
  IssueConsentDto,
} from "./dto";

@ApiTags("Verification")
@ApiBearerAuth()
@Controller("v1/verify")
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly consentService: ConsentService,
  ) {}

  @Post("nin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify NIN" })
  async verifyNin(@Body() dto: VerifyNinDto, @Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    const { id: apiKeyId } = req.apiKey;
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.ip || "";

    return this.verificationService.verifyNIN(
      dto.nin, dto.consent_token, clientId, apiKeyId, ip,
    );
  }

  @Post("bvn")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify BVN" })
  async verifyBvn(@Body() dto: VerifyBvnDto, @Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    const { id: apiKeyId } = req.apiKey;
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.ip || "";

    return this.verificationService.verifyBVN(
      dto.bvn, dto.consent_token, clientId, apiKeyId, ip,
    );
  }

  @Post("drivers-licence")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify Driver's Licence" })
  async verifyDriversLicence(@Body() dto: VerifyDriversLicenceDto, @Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    const { id: apiKeyId } = req.apiKey;
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.ip || "";

    return this.verificationService.verifyDriversLicence(
      dto.licence_number, dto.consent_token, clientId, apiKeyId, ip,
    );
  }

  @Post("passport")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify Passport" })
  async verifyPassport(@Body() dto: VerifyPassportDto, @Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    const { id: apiKeyId } = req.apiKey;
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.ip || "";

    return this.verificationService.verifyPassport(
      dto.passport_number, dto.consent_token, clientId, apiKeyId, ip,
    );
  }

  @Get(":reference_id")
  @ApiOperation({ summary: "Get verification by reference ID" })
  async getVerification(@Param("reference_id") referenceId: string, @Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    return this.verificationService.getVerification(referenceId, clientId);
  }

  @Post("consent")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Issue consent token" })
  async issueConsent(@Body() dto: IssueConsentDto, @Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    return this.consentService.issueConsentToken(clientId, dto.purpose, dto.subject_id);
  }
}

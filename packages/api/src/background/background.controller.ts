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
import { BackgroundService } from "./background.service";
import { RequestBackgroundCheckDto } from "./dto/request-check.dto";

@ApiTags("Background Check")
@ApiBearerAuth()
@Controller("v1/background")
export class BackgroundController {
  constructor(private readonly backgroundService: BackgroundService) {}

  @Post("request")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Request a background check" })
  async requestCheck(@Body() dto: RequestBackgroundCheckDto, @Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    return this.backgroundService.requestCheck(
      dto.subject_nin, dto.consent_token, dto.check_types, clientId, dto.webhook_url,
    );
  }

  @Get(":request_id")
  @ApiOperation({ summary: "Get background check status" })
  async getCheck(@Param("request_id") requestId: string, @Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    return this.backgroundService.getCheck(requestId, clientId);
  }
}

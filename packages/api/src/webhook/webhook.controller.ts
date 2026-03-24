import { Controller, Post, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthenticatedRequest } from "../common/types";
import { WebhookService } from "./webhook.service";

@ApiTags("Webhooks")
@ApiBearerAuth()
@Controller("v1/webhooks")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("test")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Send test webhook" })
  async testWebhook(@Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    return this.webhookService.sendTestWebhook(clientId);
  }
}

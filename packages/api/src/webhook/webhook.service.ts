import { Injectable, Logger } from "@nestjs/common";
import { createHmac } from "crypto";
import axios from "axios";
import { prisma } from "@veridi/database";
import { QueueService } from "../common/services/queue.service";

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly queueService: QueueService) {}

  async sendTestWebhook(clientId: string) {
    const client = await prisma.client.findUniqueOrThrow({
      where: { id: clientId },
    });

    if (!client.webhookUrl) {
      return { sent: false, message: "No webhook URL configured" };
    }

    const payload = {
      event: "test.ping",
      data: { message: "Webhook configured successfully", timestamp: new Date().toISOString() },
    };

    const signature = this.signPayload(JSON.stringify(payload), client.webhookSecret || "");

    try {
      await axios.post(client.webhookUrl, payload, {
        headers: {
          "X-Veridi-Signature": signature,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      return { sent: true, webhook_url: client.webhookUrl };
    } catch (error) {
      this.logger.warn(`Test webhook failed for client ${clientId}`);
      return { sent: false, message: "Webhook delivery failed" };
    }
  }

  async deliverWebhook(
    clientId: string,
    eventType: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const client = await prisma.client.findUnique({ where: { id: clientId } });

    if (!client?.webhookUrl) return;

    const payloadStr = JSON.stringify(payload);
    const signature = this.signPayload(payloadStr, client.webhookSecret || "");

    const event = await prisma.webhookEvent.create({
      data: {
        clientId,
        eventType,
        payloadHash: signature,
      },
    });

    try {
      await axios.post(client.webhookUrl, payload, {
        headers: {
          "X-Veridi-Signature": signature,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      await prisma.webhookEvent.update({
        where: { id: event.id },
        data: { status: "DELIVERED", attempts: 1, deliveredAt: new Date() },
      });
    } catch {
      await prisma.webhookEvent.update({
        where: { id: event.id },
        data: { status: "RETRYING", attempts: 1, lastAttempt: new Date() },
      });

      await this.queueService.addWebhookDeliveryJob({
        eventId: event.id,
        clientId,
        webhookUrl: client.webhookUrl,
        webhookSecret: client.webhookSecret || "",
        eventType,
        payload,
      });

      this.logger.log(`Webhook delivery queued for retry: event=${event.id}`);
    }
  }

  private signPayload(payload: string, secret: string): string {
    return createHmac("sha256", secret).update(payload).digest("hex");
  }
}

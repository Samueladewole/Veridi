import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Worker, Job } from "bullmq";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";
import axios, { AxiosError } from "axios";
import { prisma } from "@veridi/database";
import { getRedisConnection } from "../redis";

interface WebhookDeliveryJobData {
  eventId: string;
  clientId: string;
  webhookUrl: string;
  webhookSecret: string;
  eventType: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class WebhookDeliveryProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WebhookDeliveryProcessor.name);
  private worker: Worker<WebhookDeliveryJobData> | undefined;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const connection = getRedisConnection(this.configService);

    this.worker = new Worker<WebhookDeliveryJobData>(
      "webhook-delivery",
      async (job: Job<WebhookDeliveryJobData>) => this.process(job),
      {
        connection,
        concurrency: 10,
        limiter: { max: 20, duration: 1000 },
      },
    );

    this.worker.on("completed", (job: Job<WebhookDeliveryJobData>) => {
      this.logger.log(`Webhook delivered: event=${job.data.eventId}`);
    });

    this.worker.on("failed", (job: Job<WebhookDeliveryJobData> | undefined, error: Error) => {
      this.logger.error(
        `Webhook delivery failed: event=${job?.data.eventId ?? "unknown"} — ${error.message}`,
      );
    });

    this.logger.log("Webhook delivery processor started");
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
    this.logger.log("Webhook delivery processor stopped");
  }

  private async process(job: Job<WebhookDeliveryJobData>): Promise<void> {
    const { eventId, webhookUrl, webhookSecret, payload } = job.data;
    const attemptNumber = job.attemptsMade + 1;

    this.logger.log(`Delivering webhook event=${eventId} attempt=${attemptNumber}`);

    const payloadStr = JSON.stringify(payload);
    const signature = this.signPayload(payloadStr, webhookSecret);

    try {
      await axios.post(webhookUrl, payload, {
        headers: {
          "X-Veridi-Signature": signature,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      await prisma.webhookEvent.update({
        where: { id: eventId },
        data: {
          status: "DELIVERED",
          attempts: attemptNumber,
          deliveredAt: new Date(),
          lastAttempt: new Date(),
        },
      });

      this.logger.log(`Webhook event=${eventId} delivered successfully`);
    } catch (error) {
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      this.logger.warn(
        `Webhook delivery failed: event=${eventId} attempt=${attemptNumber} status=${statusCode ?? "N/A"} error=${errorMessage}`,
      );

      const isLastAttempt = attemptNumber >= (job.opts.attempts ?? 3);
      const nextStatus = isLastAttempt ? "FAILED" : "RETRYING";

      await prisma.webhookEvent.update({
        where: { id: eventId },
        data: {
          status: nextStatus,
          attempts: attemptNumber,
          lastAttempt: new Date(),
        },
      });

      throw new Error(`Webhook delivery failed: ${errorMessage}`);
    }
  }

  private signPayload(payload: string, secret: string): string {
    return createHmac("sha256", secret).update(payload).digest("hex");
  }
}

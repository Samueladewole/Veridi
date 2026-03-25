import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Worker, Job, Queue } from "bullmq";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { prisma, VerificationStatus } from "@veridi/database";
import { getRedisConnection } from "../redis";

interface BackgroundCheckJobData {
  checkId: string;
  clientId: string;
  subjectToken: string;
  checkTypes: string[];
  webhookUrl?: string;
}

interface WebhookDeliveryJobData {
  eventId: string;
  clientId: string;
  webhookUrl: string;
  webhookSecret: string;
  eventType: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class BackgroundCheckProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BackgroundCheckProcessor.name);
  private worker: Worker<BackgroundCheckJobData> | undefined;
  private webhookQueue: Queue<WebhookDeliveryJobData> | undefined;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const connection = getRedisConnection(this.configService);

    this.webhookQueue = new Queue<WebhookDeliveryJobData>("webhook-delivery", {
      connection,
    });

    this.worker = new Worker<BackgroundCheckJobData>(
      "background-checks",
      async (job: Job<BackgroundCheckJobData>) => this.process(job),
      {
        connection,
        concurrency: 5,
        limiter: { max: 10, duration: 1000 },
      },
    );

    this.worker.on("completed", (job: Job<BackgroundCheckJobData>) => {
      this.logger.log(`Background check completed: ${job.data.checkId}`);
    });

    this.worker.on("failed", (job: Job<BackgroundCheckJobData> | undefined, error: Error) => {
      this.logger.error(
        `Background check failed: ${job?.data.checkId ?? "unknown"} — ${error.message}`,
      );
    });

    this.logger.log("Background check processor started");
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
    await this.webhookQueue?.close();
    this.logger.log("Background check processor stopped");
  }

  private async process(job: Job<BackgroundCheckJobData>): Promise<void> {
    const { checkId, clientId, checkTypes, webhookUrl } = job.data;

    this.logger.log(`Processing background check ${checkId} [${checkTypes.join(", ")}]`);

    await prisma.backgroundCheck.update({
      where: { id: checkId },
      data: { status: VerificationStatus.PROCESSING },
    });

    // Simulate processing delay (3-5 seconds)
    const delay = 3000 + Math.floor(Math.random() * 2000);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, delay);
    });

    // Generate mock report data
    const mockResults = this.generateMockResults(checkTypes);
    const passed = mockResults.every((result) => result.passed);
    const finalStatus = passed ? VerificationStatus.VERIFIED : VerificationStatus.FAILED;

    await prisma.backgroundCheck.update({
      where: { id: checkId },
      data: {
        status: finalStatus,
        completedAt: new Date(),
        rawResults: mockResults as unknown as Prisma.InputJsonValue,
      },
    });

    this.logger.log(`Background check ${checkId} completed with status: ${finalStatus}`);

    if (webhookUrl) {
      await this.enqueueWebhookNotification(clientId, checkId, finalStatus, webhookUrl);
    }
  }

  private generateMockResults(checkTypes: string[]): MockCheckResult[] {
    return checkTypes.map((type) => ({
      checkType: type,
      passed: Math.random() > 0.15, // 85% pass rate
      confidence: Math.floor(70 + Math.random() * 30),
      details: `Mock ${type} check completed`,
      checkedAt: new Date().toISOString(),
    }));
  }

  private async enqueueWebhookNotification(
    clientId: string,
    checkId: string,
    status: VerificationStatus,
    webhookUrl: string,
  ): Promise<void> {
    const client = await prisma.client.findUnique({ where: { id: clientId } });

    if (!client?.webhookSecret) {
      this.logger.warn(`No webhook secret for client ${clientId}, skipping notification`);
      return;
    }

    const payload: Record<string, unknown> = {
      event: "background_check.completed",
      data: {
        check_id: checkId,
        status,
        completed_at: new Date().toISOString(),
      },
    };

    const event = await prisma.webhookEvent.create({
      data: {
        clientId,
        eventType: "background_check.completed",
        payloadHash: "",
      },
    });

    await this.webhookQueue?.add(
      "deliver",
      {
        eventId: event.id,
        clientId,
        webhookUrl,
        webhookSecret: client.webhookSecret,
        eventType: "background_check.completed",
        payload,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
      },
    );

    this.logger.log(`Webhook delivery queued for check ${checkId}`);
  }
}

interface MockCheckResult {
  checkType: string;
  passed: boolean;
  confidence: number;
  details: string;
  checkedAt: string;
}

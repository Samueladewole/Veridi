import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Queue } from "bullmq";
import IORedis from "ioredis";

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
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private connection: IORedis | undefined;
  private backgroundCheckQueue: Queue<BackgroundCheckJobData> | undefined;
  private webhookDeliveryQueue: Queue<WebhookDeliveryJobData> | undefined;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const redisUrl = this.configService.get<string>("REDIS_URL");

    if (!redisUrl) {
      this.logger.warn("REDIS_URL not configured — job queuing disabled");
      return;
    }

    this.connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
    });

    this.backgroundCheckQueue = new Queue<BackgroundCheckJobData>("background-checks", {
      connection: this.connection,
    });

    this.webhookDeliveryQueue = new Queue<WebhookDeliveryJobData>("webhook-delivery", {
      connection: this.connection,
    });

    this.logger.log("Queue service initialized");
  }

  async onModuleDestroy(): Promise<void> {
    await this.backgroundCheckQueue?.close();
    await this.webhookDeliveryQueue?.close();
    this.connection?.disconnect();
    this.logger.log("Queue service shut down");
  }

  async addBackgroundCheckJob(data: BackgroundCheckJobData): Promise<void> {
    if (!this.backgroundCheckQueue) {
      this.logger.warn("Background check queue not available — skipping job");
      return;
    }

    await this.backgroundCheckQueue.add("process", data, {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    });

    this.logger.log(`Enqueued background check job: ${data.checkId}`);
  }

  async addWebhookDeliveryJob(data: WebhookDeliveryJobData): Promise<void> {
    if (!this.webhookDeliveryQueue) {
      this.logger.warn("Webhook delivery queue not available — skipping job");
      return;
    }

    await this.webhookDeliveryQueue.add("deliver", data, {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    });

    this.logger.log(`Enqueued webhook delivery job: event=${data.eventId}`);
  }
}

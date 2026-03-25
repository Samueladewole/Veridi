import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health/health.controller";
import { BackgroundCheckProcessor } from "./processors/background-check.processor";
import { WebhookDeliveryProcessor } from "./processors/webhook-delivery.processor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HealthController],
  providers: [BackgroundCheckProcessor, WebhookDeliveryProcessor],
})
export class AppModule {}

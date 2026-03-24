import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppConfigModule } from "./config";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { VerificationModule } from "./verification/verification.module";
import { FaceModule } from "./face/face.module";
import { BackgroundModule } from "./background/background.module";
import { ScoreModule } from "./score/score.module";
import { ConsentModule } from "./consent/consent.module";
import { WebhookModule } from "./webhook/webhook.module";
import { AdminModule } from "./admin/admin.module";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";
import { RequestLoggerMiddleware } from "./common/middleware/request-logger.middleware";

@Module({
  imports: [
    AppConfigModule,
    ThrottlerModule.forRoot([
      { name: "short", ttl: 1000, limit: 10 },
      { name: "medium", ttl: 60000, limit: 100 },
    ]),
    AuthModule,
    HealthModule,
    VerificationModule,
    FaceModule,
    BackgroundModule,
    ScoreModule,
    ConsentModule,
    WebhookModule,
    AdminModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestIdMiddleware, RequestLoggerMiddleware)
      .forRoutes("*");
  }
}

import { Module } from "@nestjs/common";
import { BackgroundController } from "./background.controller";
import { BackgroundService } from "./background.service";
import { VerificationModule } from "../verification/verification.module";

@Module({
  imports: [VerificationModule],
  controllers: [BackgroundController],
  providers: [BackgroundService],
})
export class BackgroundModule {}

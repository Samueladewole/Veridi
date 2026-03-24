import { Module } from "@nestjs/common";
import { FaceController } from "./face.controller";
import { FaceService } from "./face.service";
import { MlService } from "./services/ml.service";
import { VerificationModule } from "../verification/verification.module";

@Module({
  imports: [VerificationModule],
  controllers: [FaceController],
  providers: [FaceService, MlService],
})
export class FaceModule {}

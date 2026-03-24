import { Module } from "@nestjs/common";
import { VerificationController } from "./verification.controller";
import { VerificationService } from "./verification.service";
import { ConsentService } from "./services/consent.service";
import { NimcService } from "./services/nimc.service";
import { NibssService } from "./services/nibss.service";
import { DocumentService } from "./services/document.service";

@Module({
  controllers: [VerificationController],
  providers: [
    VerificationService,
    ConsentService,
    NimcService,
    NibssService,
    DocumentService,
  ],
  exports: [ConsentService],
})
export class VerificationModule {}

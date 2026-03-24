import { Injectable, Logger } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { MlService } from "./services/ml.service";
import { ConsentService } from "../verification/services/consent.service";

@Injectable()
export class FaceService {
  private readonly logger = new Logger(FaceService.name);

  constructor(
    private readonly mlService: MlService,
    private readonly consentService: ConsentService,
  ) {}

  async checkLiveness(
    imageBase64: string,
    consentToken: string,
    clientId: string,
  ) {
    await this.consentService.validateConsentToken(consentToken, clientId);

    const result = await this.mlService.detectLiveness(imageBase64);
    // Never store the image — process and discard
    this.logger.log(`Liveness check: ${result.liveness ? "pass" : "fail"}`);

    return {
      liveness: result.liveness,
      confidence: result.confidence,
      spoof_detected: result.spoof_detected,
      reference_id: `vrd_face_${uuidv4().slice(0, 12)}`,
      ms: result.ms,
    };
  }

  async matchFaces(
    selfieBase64: string,
    referenceImage: string,
    consentToken: string,
    clientId: string,
  ) {
    await this.consentService.validateConsentToken(consentToken, clientId);

    const result = await this.mlService.matchFaces(selfieBase64, referenceImage);
    // Never store images
    this.logger.log(`Face match: ${result.match ? "match" : "no match"}`);

    return {
      match: result.match,
      similarity: Math.round(result.similarity * 100) / 100,
      reference_id: `vrd_match_${uuidv4().slice(0, 12)}`,
      ms: result.ms,
    };
  }
}

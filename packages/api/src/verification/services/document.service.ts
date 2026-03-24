import { Injectable, Logger } from "@nestjs/common";

export interface DocumentVerifyResult {
  verified: boolean;
  confidence: number;
  matchFields: string[];
  source: string;
  responseMs: number;
}

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  async verifyDriversLicence(licenceNumber: string): Promise<DocumentVerifyResult> {
    this.logger.log("Using mock FRSC response");
    const ms = Math.floor(Math.random() * 500) + 300;

    return {
      verified: true,
      confidence: 90 + Math.floor(Math.random() * 8),
      matchFields: ["name", "licence_class"],
      source: "frsc",
      responseMs: ms,
    };
  }

  async verifyPassport(passportNumber: string): Promise<DocumentVerifyResult> {
    this.logger.log("Using mock NIS response");
    const ms = Math.floor(Math.random() * 600) + 400;

    return {
      verified: true,
      confidence: 88 + Math.floor(Math.random() * 10),
      matchFields: ["name", "dob", "nationality"],
      source: "nis",
      responseMs: ms,
    };
  }
}

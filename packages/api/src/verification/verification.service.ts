import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import * as argon2 from "argon2";
import { prisma, VerificationType, VerificationStatus } from "@veridi/database";
import { ConsentService } from "./services/consent.service";
import { NimcService } from "./services/nimc.service";
import { NibssService } from "./services/nibss.service";
import { DocumentService } from "./services/document.service";
import { RedisService } from "../common/services/redis.service";

export interface VerifyResult {
  verified: boolean;
  confidence: number;
  reference_id: string;
  match_fields: string[];
  source: string;
  cached: boolean;
  ms: number;
}

/** TTL in seconds per verification type */
const CACHE_TTL: Record<string, number> = {
  [VerificationType.NIN]: 24 * 60 * 60,
  [VerificationType.BVN]: 4 * 60 * 60,
  [VerificationType.DRIVERS_LICENCE]: 24 * 60 * 60,
  [VerificationType.PASSPORT]: 24 * 60 * 60,
};

function buildCacheKey(type: string, identifier: string): string {
  return `verify:${type}:${identifier.slice(0, 16)}`;
}

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly consentService: ConsentService,
    private readonly nimcService: NimcService,
    private readonly nibssService: NibssService,
    private readonly documentService: DocumentService,
    private readonly redisService: RedisService,
  ) {}

  async verifyNIN(
    nin: string,
    consentToken: string,
    clientId: string,
    apiKeyId: string,
    requestIp: string,
  ): Promise<VerifyResult> {
    await this.consentService.validateConsentToken(consentToken, clientId);

    const subjectToken = await argon2.hash(nin);
    const start = Date.now();

    const cached = await this.getCachedResult(VerificationType.NIN, nin);
    if (cached) {
      return { ...cached, ms: Date.now() - start };
    }

    const result = await this.nimcService.verifyNIN(nin);

    const verification = await prisma.verificationRequest.create({
      data: {
        clientId,
        apiKeyId,
        type: VerificationType.NIN,
        status: result.verified ? VerificationStatus.VERIFIED : VerificationStatus.FAILED,
        subjectToken,
        consentTokenId: consentToken.slice(-12),
        confidenceScore: result.confidence,
        matchFields: result.matchFields,
        sourceDatabase: result.source,
        requestIp,
        responseMs: result.responseMs,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        resolvedAt: new Date(),
      },
    });

    await this.recordUsage(clientId, apiKeyId, "/v1/verify/nin", VerificationType.NIN, 200, result.responseMs);

    const verifyResult: VerifyResult = {
      verified: result.verified,
      confidence: result.confidence,
      reference_id: verification.id,
      match_fields: result.matchFields,
      source: result.source,
      cached: false,
      ms: Date.now() - start,
    };

    await this.cacheResult(VerificationType.NIN, nin, verifyResult);

    return verifyResult;
  }

  async verifyBVN(
    bvn: string,
    consentToken: string,
    clientId: string,
    apiKeyId: string,
    requestIp: string,
  ): Promise<VerifyResult> {
    await this.consentService.validateConsentToken(consentToken, clientId);

    const subjectToken = await argon2.hash(bvn);
    const start = Date.now();

    const cached = await this.getCachedResult(VerificationType.BVN, bvn);
    if (cached) {
      return { ...cached, ms: Date.now() - start };
    }

    const result = await this.nibssService.verifyBVN(bvn);

    const verification = await prisma.verificationRequest.create({
      data: {
        clientId,
        apiKeyId,
        type: VerificationType.BVN,
        status: result.verified ? VerificationStatus.VERIFIED : VerificationStatus.FAILED,
        subjectToken,
        consentTokenId: consentToken.slice(-12),
        confidenceScore: result.confidence,
        matchFields: result.matchFields,
        sourceDatabase: result.source,
        requestIp,
        responseMs: result.responseMs,
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
        resolvedAt: new Date(),
      },
    });

    await this.recordUsage(clientId, apiKeyId, "/v1/verify/bvn", VerificationType.BVN, 200, result.responseMs);

    const verifyResult: VerifyResult = {
      verified: result.verified,
      confidence: result.confidence,
      reference_id: verification.id,
      match_fields: result.matchFields,
      source: result.source,
      cached: false,
      ms: Date.now() - start,
    };

    await this.cacheResult(VerificationType.BVN, bvn, verifyResult);

    return verifyResult;
  }

  async verifyDriversLicence(
    licenceNumber: string,
    consentToken: string,
    clientId: string,
    apiKeyId: string,
    requestIp: string,
  ): Promise<VerifyResult> {
    await this.consentService.validateConsentToken(consentToken, clientId);

    const subjectToken = await argon2.hash(licenceNumber);
    const start = Date.now();

    const cached = await this.getCachedResult(VerificationType.DRIVERS_LICENCE, licenceNumber);
    if (cached) {
      return { ...cached, ms: Date.now() - start };
    }

    const result = await this.documentService.verifyDriversLicence(licenceNumber);

    const verification = await prisma.verificationRequest.create({
      data: {
        clientId,
        apiKeyId,
        type: VerificationType.DRIVERS_LICENCE,
        status: result.verified ? VerificationStatus.VERIFIED : VerificationStatus.FAILED,
        subjectToken,
        consentTokenId: consentToken.slice(-12),
        confidenceScore: result.confidence,
        matchFields: result.matchFields,
        sourceDatabase: result.source,
        requestIp,
        responseMs: result.responseMs,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        resolvedAt: new Date(),
      },
    });

    await this.recordUsage(clientId, apiKeyId, "/v1/verify/drivers-licence", VerificationType.DRIVERS_LICENCE, 200, result.responseMs);

    const verifyResult: VerifyResult = {
      verified: result.verified,
      confidence: result.confidence,
      reference_id: verification.id,
      match_fields: result.matchFields,
      source: result.source,
      cached: false,
      ms: Date.now() - start,
    };

    await this.cacheResult(VerificationType.DRIVERS_LICENCE, licenceNumber, verifyResult);

    return verifyResult;
  }

  async verifyPassport(
    passportNumber: string,
    consentToken: string,
    clientId: string,
    apiKeyId: string,
    requestIp: string,
  ): Promise<VerifyResult> {
    await this.consentService.validateConsentToken(consentToken, clientId);

    const subjectToken = await argon2.hash(passportNumber);
    const start = Date.now();

    const cached = await this.getCachedResult(VerificationType.PASSPORT, passportNumber);
    if (cached) {
      return { ...cached, ms: Date.now() - start };
    }

    const result = await this.documentService.verifyPassport(passportNumber);

    const verification = await prisma.verificationRequest.create({
      data: {
        clientId,
        apiKeyId,
        type: VerificationType.PASSPORT,
        status: result.verified ? VerificationStatus.VERIFIED : VerificationStatus.FAILED,
        subjectToken,
        consentTokenId: consentToken.slice(-12),
        confidenceScore: result.confidence,
        matchFields: result.matchFields,
        sourceDatabase: result.source,
        requestIp,
        responseMs: result.responseMs,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        resolvedAt: new Date(),
      },
    });

    await this.recordUsage(clientId, apiKeyId, "/v1/verify/passport", VerificationType.PASSPORT, 200, result.responseMs);

    const verifyResult: VerifyResult = {
      verified: result.verified,
      confidence: result.confidence,
      reference_id: verification.id,
      match_fields: result.matchFields,
      source: result.source,
      cached: false,
      ms: Date.now() - start,
    };

    await this.cacheResult(VerificationType.PASSPORT, passportNumber, verifyResult);

    return verifyResult;
  }

  async getVerification(referenceId: string, clientId: string) {
    const verification = await prisma.verificationRequest.findUnique({
      where: { id: referenceId },
    });

    if (!verification) {
      throw new NotFoundException("Verification not found");
    }

    if (verification.clientId !== clientId) {
      throw new ForbiddenException("Access denied");
    }

    return {
      reference_id: verification.id,
      type: verification.type,
      status: verification.status,
      confidence: verification.confidenceScore,
      match_fields: verification.matchFields,
      source: verification.sourceDatabase,
      response_ms: verification.responseMs,
      created_at: verification.createdAt.toISOString(),
      resolved_at: verification.resolvedAt?.toISOString() ?? null,
    };
  }

  private async getCachedResult(
    type: string,
    identifier: string,
  ): Promise<VerifyResult | null> {
    const key = buildCacheKey(type, identifier);
    const cached = await this.redisService.get<VerifyResult>(key);
    if (cached) {
      this.logger.debug(`Cache HIT for ${key}`);
      return { ...cached, cached: true };
    }
    return null;
  }

  private async cacheResult(
    type: string,
    identifier: string,
    result: VerifyResult,
  ): Promise<void> {
    const key = buildCacheKey(type, identifier);
    const ttl = CACHE_TTL[type] ?? 24 * 60 * 60;
    await this.redisService.set(key, result, ttl);
  }

  private async recordUsage(
    clientId: string,
    apiKeyId: string,
    endpoint: string,
    type: VerificationType,
    statusCode: number,
    responseMs: number,
  ): Promise<void> {
    await prisma.usageRecord.create({
      data: { clientId, apiKeyId, endpoint, type, statusCode, responseMs },
    }).catch((err: Error) => {
      this.logger.error(`Failed to record usage: ${err.message}`);
    });
  }
}

import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { mockPrisma } from '../test/prisma.mock';
import { fixtures } from '../test/helpers';

// ---- Module-level mocks (must precede imports of the module under test) ----
jest.mock('@veridi/database', () => ({
  prisma: mockPrisma,
  VerificationType: { NIN: 'NIN', BVN: 'BVN', DRIVERS_LICENCE: 'DRIVERS_LICENCE', PASSPORT: 'PASSPORT' },
  VerificationStatus: { PENDING: 'PENDING', VERIFIED: 'VERIFIED', FAILED: 'FAILED', ERROR: 'ERROR' },
}));

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_value'),
}));

import { VerificationService } from './verification.service';
import { ConsentService } from './services/consent.service';
import { NimcService } from './services/nimc.service';
import { NibssService } from './services/nibss.service';
import { DocumentService } from './services/document.service';
import { RedisService } from '../common/services/redis.service';

describe('VerificationService', () => {
  let service: VerificationService;
  let consentService: jest.Mocked<ConsentService>;
  let nimcService: jest.Mocked<NimcService>;
  let nibssService: jest.Mocked<NibssService>;
  let documentService: jest.Mocked<DocumentService>;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(() => {
    jest.clearAllMocks();

    consentService = {
      validateConsentToken: jest.fn().mockResolvedValue({
        sub: 'sub_hash', clientId: fixtures.clientId, purpose: 'verification', type: 'consent',
      }),
    } as unknown as jest.Mocked<ConsentService>;

    nimcService = {
      verifyNIN: jest.fn().mockResolvedValue({
        verified: true, confidence: 97, matchFields: ['name', 'dob', 'gender'], source: 'nimc_nvs', responseMs: 350,
      }),
    } as unknown as jest.Mocked<NimcService>;

    nibssService = {
      verifyBVN: jest.fn().mockResolvedValue({
        verified: true, confidence: 95, matchFields: ['name', 'dob', 'phone'], source: 'nibss', responseMs: 250,
      }),
    } as unknown as jest.Mocked<NibssService>;

    documentService = {
      verifyDriversLicence: jest.fn().mockResolvedValue({
        verified: true, confidence: 92, matchFields: ['name', 'licence_class'], source: 'frsc', responseMs: 400,
      }),
      verifyPassport: jest.fn().mockResolvedValue({
        verified: true, confidence: 90, matchFields: ['name', 'dob', 'nationality'], source: 'nis', responseMs: 500,
      }),
    } as unknown as jest.Mocked<DocumentService>;

    redisService = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
      delPattern: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<RedisService>;

    service = new VerificationService(consentService, nimcService, nibssService, documentService, redisService);

    // Default mock: successful DB create returning a verification record
    mockPrisma.verificationRequest.create.mockResolvedValue({ ...fixtures.verification });
    mockPrisma.usageRecord.create.mockResolvedValue({ id: 'usage_1' });
  });

  // ---------- verifyNIN ----------
  describe('verifyNIN', () => {
    const callVerifyNIN = () =>
      service.verifyNIN('12345678901', 'consent_jwt', fixtures.clientId, fixtures.apiKeyId, '192.168.1.1');

    it('should validate consent token before proceeding', async () => {
      await callVerifyNIN();
      expect(consentService.validateConsentToken).toHaveBeenCalledWith('consent_jwt', fixtures.clientId);
    });

    it('should return a successful verification result', async () => {
      const result = await callVerifyNIN();

      expect(result.verified).toBe(true);
      expect(result.confidence).toBe(97);
      expect(result.reference_id).toBe(fixtures.verification.id);
      expect(result.match_fields).toEqual(['name', 'dob', 'gender']);
      expect(result.source).toBe('nimc_nvs');
      expect(result.cached).toBe(false);
      expect(typeof result.ms).toBe('number');
    });

    it('should create a verification record in the database', async () => {
      await callVerifyNIN();

      expect(mockPrisma.verificationRequest.create).toHaveBeenCalledTimes(1);
      const createArgs = mockPrisma.verificationRequest.create.mock.calls[0]![0];
      expect(createArgs.data.clientId).toBe(fixtures.clientId);
      expect(createArgs.data.type).toBe('NIN');
      expect(createArgs.data.status).toBe('VERIFIED');
    });

    it('should propagate consent validation failure', async () => {
      consentService.validateConsentToken.mockRejectedValueOnce(
        new Error('Invalid or expired consent token'),
      );

      await expect(callVerifyNIN()).rejects.toThrow('Invalid or expired consent token');
      expect(nimcService.verifyNIN).not.toHaveBeenCalled();
    });

    it('should record usage after verification', async () => {
      await callVerifyNIN();

      expect(mockPrisma.usageRecord.create).toHaveBeenCalledTimes(1);
      const usageArgs = mockPrisma.usageRecord.create.mock.calls[0]![0];
      expect(usageArgs.data.endpoint).toBe('/v1/verify/nin');
      expect(usageArgs.data.type).toBe('NIN');
    });
  });

  // ---------- verifyBVN ----------
  describe('verifyBVN', () => {
    const callVerifyBVN = () =>
      service.verifyBVN('22345678901', 'consent_jwt', fixtures.clientId, fixtures.apiKeyId, '192.168.1.1');

    it('should return a successful BVN verification result', async () => {
      const result = await callVerifyBVN();

      expect(result.verified).toBe(true);
      expect(result.confidence).toBe(95);
      expect(result.source).toBe('nibss');
      expect(result.match_fields).toEqual(['name', 'dob', 'phone']);
    });

    it('should create a BVN verification record', async () => {
      await callVerifyBVN();

      const createArgs = mockPrisma.verificationRequest.create.mock.calls[0]![0];
      expect(createArgs.data.type).toBe('BVN');
    });
  });

  // ---------- getVerification ----------
  describe('getVerification', () => {
    it('should return verification details when found and owned by client', async () => {
      mockPrisma.verificationRequest.findUnique.mockResolvedValueOnce({ ...fixtures.verification });

      const result = await service.getVerification(fixtures.verificationId, fixtures.clientId);

      expect(result.reference_id).toBe(fixtures.verification.id);
      expect(result.type).toBe('NIN');
      expect(result.status).toBe('VERIFIED');
      expect(result.confidence).toBe(97);
    });

    it('should throw NotFoundException when verification does not exist', async () => {
      mockPrisma.verificationRequest.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.getVerification('nonexistent_id', fixtures.clientId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when verification belongs to another client', async () => {
      mockPrisma.verificationRequest.findUnique.mockResolvedValueOnce({
        ...fixtures.verification,
        clientId: 'other_client_id',
      });

      await expect(
        service.getVerification(fixtures.verificationId, fixtures.clientId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { mockPrisma } from '../test/prisma.mock';
import { fixtures } from '../test/helpers';

jest.mock('@veridi/database', () => ({
  prisma: mockPrisma,
  VerificationStatus: { PENDING: 'PENDING', VERIFIED: 'VERIFIED', FAILED: 'FAILED' },
}));

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_nin_value'),
}));

import { BackgroundService } from './background.service';
import { ConsentService } from '../verification/services/consent.service';
import { QueueService } from '../common/services/queue.service';

describe('BackgroundService', () => {
  let service: BackgroundService;
  let consentService: jest.Mocked<ConsentService>;
  let queueService: jest.Mocked<QueueService>;

  beforeEach(() => {
    jest.clearAllMocks();

    consentService = {
      validateConsentToken: jest.fn().mockResolvedValue({
        sub: 'sub_hash', clientId: fixtures.clientId, purpose: 'background_check', type: 'consent',
      }),
    } as unknown as jest.Mocked<ConsentService>;

    queueService = {
      addBackgroundCheckJob: jest.fn().mockResolvedValue(undefined),
      addWebhookDeliveryJob: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<QueueService>;

    service = new BackgroundService(consentService, queueService);
  });

  // ---------- requestCheck ----------
  describe('requestCheck', () => {
    it('should create a background check and return pending status', async () => {
      mockPrisma.backgroundCheck.create.mockResolvedValueOnce({ ...fixtures.backgroundCheck });

      const result = await service.requestCheck(
        '12345678901', 'consent_jwt', ['criminal_record', 'credit_history'], fixtures.clientId,
      );

      expect(result.request_id).toBe(fixtures.backgroundCheck.id);
      expect(result.status).toBe('PENDING');
      expect(result.check_types).toEqual(['criminal_record', 'credit_history']);
      expect(result.estimated_completion).toBe('48 hours');
    });

    it('should validate consent before creating check', async () => {
      mockPrisma.backgroundCheck.create.mockResolvedValueOnce({ ...fixtures.backgroundCheck });

      await service.requestCheck('12345678901', 'consent_jwt', ['criminal_record'], fixtures.clientId);

      expect(consentService.validateConsentToken).toHaveBeenCalledWith('consent_jwt', fixtures.clientId);
    });

    it('should propagate consent validation failure', async () => {
      consentService.validateConsentToken.mockRejectedValueOnce(
        new Error('Invalid or expired consent token'),
      );

      await expect(
        service.requestCheck('12345678901', 'bad_token', ['criminal_record'], fixtures.clientId),
      ).rejects.toThrow('Invalid or expired consent token');

      expect(mockPrisma.backgroundCheck.create).not.toHaveBeenCalled();
    });
  });

  // ---------- getCheck ----------
  describe('getCheck', () => {
    it('should return check details when found and owned by client', async () => {
      mockPrisma.backgroundCheck.findUnique.mockResolvedValueOnce({ ...fixtures.backgroundCheck });

      const result = await service.getCheck(fixtures.backgroundCheckId, fixtures.clientId);

      expect(result.request_id).toBe(fixtures.backgroundCheck.id);
      expect(result.status).toBe('PENDING');
      expect(result.check_types).toEqual(['criminal_record', 'credit_history']);
    });

    it('should throw NotFoundException when check does not exist', async () => {
      mockPrisma.backgroundCheck.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.getCheck('nonexistent', fixtures.clientId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when check belongs to another client', async () => {
      mockPrisma.backgroundCheck.findUnique.mockResolvedValueOnce({
        ...fixtures.backgroundCheck,
        clientId: 'other_client',
      });

      await expect(
        service.getCheck(fixtures.backgroundCheckId, fixtures.clientId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

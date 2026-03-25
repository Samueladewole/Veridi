import { UnauthorizedException } from '@nestjs/common';
import { mockPrisma } from '../../test/prisma.mock';
import { createMockConfigService, fixtures } from '../../test/helpers';

jest.mock('@veridi/database', () => ({
  prisma: mockPrisma,
}));

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_subject_id'),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock.consent.jwt'),
  verify: jest.fn(),
}));

import { ConsentService } from './consent.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

describe('ConsentService', () => {
  let service: ConsentService;
  let mockConfig: ReturnType<typeof createMockConfigService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfig = createMockConfigService();
    service = new ConsentService(mockConfig as unknown as ConfigService);
  });

  // ---------- issueConsentToken ----------
  describe('issueConsentToken', () => {
    it('should create a consent record and return a JWT token', async () => {
      mockPrisma.consentRecord.create.mockResolvedValueOnce({ id: 'consent_1' });

      const result = await service.issueConsentToken(
        fixtures.clientId, 'identity_verification', 'subject_nin_12345',
      );

      expect(result.consent_token).toBe('mock.consent.jwt');
      expect(result.expires_at).toBeDefined();
      expect(mockPrisma.consentRecord.create).toHaveBeenCalledTimes(1);
    });

    it('should sign the JWT with the correct payload', async () => {
      mockPrisma.consentRecord.create.mockResolvedValueOnce({ id: 'consent_2' });

      await service.issueConsentToken(fixtures.clientId, 'verification', 'subject_123');

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: fixtures.clientId,
          purpose: 'verification',
          type: 'consent',
        }),
        'test-jwt-secret-key-veridi-12345',
        expect.objectContaining({ expiresIn: '10m' }),
      );
    });
  });

  // ---------- validateConsentToken ----------
  describe('validateConsentToken', () => {
    it('should return the payload for a valid consent token', async () => {
      (jwt.verify as jest.Mock).mockReturnValueOnce({
        sub: 'hashed_sub', clientId: fixtures.clientId, purpose: 'verification', type: 'consent',
      });

      const result = await service.validateConsentToken('valid.jwt.token', fixtures.clientId);

      expect(result.type).toBe('consent');
      expect(result.clientId).toBe(fixtures.clientId);
    });

    it('should throw UnauthorizedException when token type is not consent', async () => {
      (jwt.verify as jest.Mock).mockReturnValueOnce({
        sub: 'hashed_sub', clientId: fixtures.clientId, purpose: 'verification', type: 'admin_access',
      });

      await expect(
        service.validateConsentToken('wrong_type.jwt', fixtures.clientId),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when clientId does not match', async () => {
      (jwt.verify as jest.Mock).mockReturnValueOnce({
        sub: 'hashed_sub', clientId: 'other_client', purpose: 'verification', type: 'consent',
      });

      await expect(
        service.validateConsentToken('wrong_client.jwt', fixtures.clientId),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for expired tokens', async () => {
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('jwt expired');
      });

      await expect(
        service.validateConsentToken('expired.jwt', fixtures.clientId),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for malformed tokens', async () => {
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('invalid signature');
      });

      await expect(
        service.validateConsentToken('malformed', fixtures.clientId),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

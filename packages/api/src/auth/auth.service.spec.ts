import { UnauthorizedException } from '@nestjs/common';
import { mockPrisma } from '../test/prisma.mock';
import { createMockConfigService, fixtures } from '../test/helpers';

jest.mock('@veridi/database', () => ({
  prisma: mockPrisma,
}));

jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
  verify: jest.fn(),
}));

import { AuthService, TokenPair } from './auth.service';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let service: AuthService;
  let mockConfig: ReturnType<typeof createMockConfigService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfig = createMockConfigService();
    service = new AuthService(mockConfig as unknown as ConfigService);
  });

  // ---------- adminLogin ----------
  describe('adminLogin', () => {
    it('should return a token pair for valid credentials', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValueOnce({ ...fixtures.adminUser });
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);
      mockPrisma.adminUser.update.mockResolvedValueOnce({ ...fixtures.adminUser });

      const result: TokenPair = await service.adminLogin(fixtures.adminEmail, 'correct_password');

      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.refreshToken).toBe('mock.jwt.token');
      expect(result.expiresIn).toBe('15m');
    });

    it('should throw UnauthorizedException when email does not exist', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.adminLogin('unknown@veridi.africa', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValueOnce({ ...fixtures.adminUser });
      (argon2.verify as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        service.adminLogin(fixtures.adminEmail, 'wrong_password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should update lastLoginAt on successful login', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValueOnce({ ...fixtures.adminUser });
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);
      mockPrisma.adminUser.update.mockResolvedValueOnce({ ...fixtures.adminUser });

      await service.adminLogin(fixtures.adminEmail, 'correct_password');

      expect(mockPrisma.adminUser.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: fixtures.adminUser.id },
          data: expect.objectContaining({ lastLoginAt: expect.any(Date) }),
        }),
      );
    });
  });

  // ---------- refreshAccessToken ----------
  describe('refreshAccessToken', () => {
    it('should return new token pair for a valid refresh token', async () => {
      (jwt.verify as jest.Mock).mockReturnValueOnce({
        sub: fixtures.adminUser.id,
        email: fixtures.adminEmail,
        isSuperAdmin: true,
        type: 'admin_refresh',
      });
      mockPrisma.adminUser.findUnique.mockResolvedValueOnce({ ...fixtures.adminUser });

      const result = await service.refreshAccessToken('valid_refresh_token');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid token type', async () => {
      (jwt.verify as jest.Mock).mockReturnValueOnce({
        sub: fixtures.adminUser.id,
        email: fixtures.adminEmail,
        isSuperAdmin: true,
        type: 'admin_access', // wrong type — should be admin_refresh
      });

      await expect(
        service.refreshAccessToken('invalid_type_token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for expired/invalid JWT', async () => {
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('jwt expired');
      });

      await expect(
        service.refreshAccessToken('expired_token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when admin no longer exists', async () => {
      (jwt.verify as jest.Mock).mockReturnValueOnce({
        sub: 'deleted_admin_id',
        email: 'deleted@veridi.africa',
        isSuperAdmin: false,
        type: 'admin_refresh',
      });
      mockPrisma.adminUser.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.refreshAccessToken('orphan_token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ---------- generateTokenPair (tested indirectly) ----------
  describe('generateTokenPair (via adminLogin)', () => {
    it('should call jwt.sign twice — once for access, once for refresh', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValueOnce({ ...fixtures.adminUser });
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);
      mockPrisma.adminUser.update.mockResolvedValueOnce({ ...fixtures.adminUser });

      await service.adminLogin(fixtures.adminEmail, 'correct_password');

      expect(jwt.sign).toHaveBeenCalledTimes(2);

      const accessCall = (jwt.sign as jest.Mock).mock.calls[0];
      expect(accessCall![0]).toEqual(
        expect.objectContaining({ type: 'admin_access', email: fixtures.adminEmail }),
      );

      const refreshCall = (jwt.sign as jest.Mock).mock.calls[1];
      expect(refreshCall![0]).toEqual(
        expect.objectContaining({ type: 'admin_refresh', email: fixtures.adminEmail }),
      );
    });
  });
});

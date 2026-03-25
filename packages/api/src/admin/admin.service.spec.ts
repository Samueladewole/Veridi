import { NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../test/prisma.mock';
import { fixtures } from '../test/helpers';
import type { RedisService } from '../common/services/redis.service';

jest.mock('@veridi/database', () => ({
  prisma: mockPrisma,
  ClientStatus: { ACTIVE: 'ACTIVE', SUSPENDED: 'SUSPENDED', PENDING: 'PENDING' },
  VerificationStatus: { PENDING: 'PENDING', VERIFIED: 'VERIFIED', FAILED: 'FAILED', ERROR: 'ERROR' },
  AuditAction: {
    CLIENT_APPROVED: 'CLIENT_APPROVED',
    CLIENT_SUSPENDED: 'CLIENT_SUSPENDED',
    VERIFICATION_OVERRIDDEN: 'VERIFICATION_OVERRIDDEN',
  },
}));

import { AdminService } from './admin.service';

const mockRedisService: jest.Mocked<RedisService> = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
  delPattern: jest.fn().mockResolvedValue(undefined),
  onModuleDestroy: jest.fn().mockResolvedValue(undefined),
} as unknown as jest.Mocked<RedisService>;

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AdminService(mockRedisService);
  });

  // ---------- getDashboardStats ----------
  describe('getDashboardStats', () => {
    it('should return aggregated dashboard counts', async () => {
      mockPrisma.client.count
        .mockResolvedValueOnce(50)  // totalClients
        .mockResolvedValueOnce(35); // activeClients
      mockPrisma.usageRecord.count
        .mockResolvedValueOnce(1200)  // callsToday
        .mockResolvedValueOnce(28000); // callsMonth
      mockPrisma.webhookEvent.count.mockResolvedValueOnce(3); // failedWebhooks

      const result = await service.getDashboardStats();

      expect(result.total_clients).toBe(50);
      expect(result.active_clients).toBe(35);
      expect(result.calls_today).toBe(1200);
      expect(result.calls_month).toBe(28000);
      expect(result.failed_webhooks).toBe(3);
      expect(result.mrr).toBe(0); // TODO stub
    });
  });

  // ---------- getClients ----------
  describe('getClients', () => {
    it('should return paginated clients without filters', async () => {
      const clientData = [{ ...fixtures.client, _count: { apiKeys: 2, verifications: 100 } }];
      mockPrisma.client.findMany.mockResolvedValueOnce(clientData);
      mockPrisma.client.count.mockResolvedValueOnce(1);

      const result = await service.getClients({}, 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result._meta.page).toBe(1);
      expect(result._meta.total).toBe(1);
    });

    it('should apply status filter when provided', async () => {
      mockPrisma.client.findMany.mockResolvedValueOnce([]);
      mockPrisma.client.count.mockResolvedValueOnce(0);

      await service.getClients({ status: 'ACTIVE' }, 1, 10);

      const findManyArgs = mockPrisma.client.findMany.mock.calls[0]![0];
      expect(findManyArgs.where.status).toBe('ACTIVE');
    });

    it('should apply tier filter when provided', async () => {
      mockPrisma.client.findMany.mockResolvedValueOnce([]);
      mockPrisma.client.count.mockResolvedValueOnce(0);

      await service.getClients({ tier: 'GROWTH' }, 1, 10);

      const findManyArgs = mockPrisma.client.findMany.mock.calls[0]![0];
      expect(findManyArgs.where.tier).toBe('GROWTH');
    });

    it('should calculate pagination correctly', async () => {
      mockPrisma.client.findMany.mockResolvedValueOnce([]);
      mockPrisma.client.count.mockResolvedValueOnce(45);

      const result = await service.getClients({}, 3, 10);

      const findManyArgs = mockPrisma.client.findMany.mock.calls[0]![0];
      expect(findManyArgs.skip).toBe(20); // (3-1)*10
      expect(findManyArgs.take).toBe(10);
      expect(result._meta.pages).toBe(5); // ceil(45/10)
    });
  });

  // ---------- approveClient ----------
  describe('approveClient', () => {
    it('should update client status to ACTIVE and create audit log', async () => {
      mockPrisma.client.update.mockResolvedValueOnce({ ...fixtures.client, status: 'ACTIVE' });
      mockPrisma.adminLog.create.mockResolvedValueOnce({ id: 'log_1' });

      const result = await service.approveClient(
        fixtures.clientId, fixtures.adminId, fixtures.adminEmail,
      );

      expect(result.success).toBe(true);
      expect(result.status).toBe('ACTIVE');
      expect(mockPrisma.client.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: fixtures.clientId },
          data: { status: 'ACTIVE' },
        }),
      );
      expect(mockPrisma.adminLog.create).toHaveBeenCalledTimes(1);
    });
  });

  // ---------- suspendClient ----------
  describe('suspendClient', () => {
    it('should suspend client, revoke keys, invalidate cache, and create audit log', async () => {
      mockPrisma.apiKey.findMany.mockResolvedValueOnce([
        { keyHash: 'hash_1' },
        { keyHash: 'hash_2' },
      ]);
      mockPrisma.$transaction.mockResolvedValueOnce([
        { ...fixtures.client, status: 'SUSPENDED' },
        { count: 2 },
      ]);
      mockPrisma.adminLog.create.mockResolvedValueOnce({ id: 'log_2' });

      const result = await service.suspendClient(
        fixtures.clientId, fixtures.adminId, fixtures.adminEmail,
      );

      expect(result.success).toBe(true);
      expect(result.status).toBe('SUSPENDED');
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrisma.adminLog.create).toHaveBeenCalledTimes(1);
      expect(mockRedisService.del).toHaveBeenCalledWith('apikey:hash_1');
      expect(mockRedisService.del).toHaveBeenCalledWith('apikey:hash_2');
    });
  });

  // ---------- overrideVerification ----------
  describe('overrideVerification', () => {
    it('should update the verification record and log the override', async () => {
      mockPrisma.verificationRequest.update.mockResolvedValueOnce({
        ...fixtures.verification, status: 'VERIFIED', confidenceScore: 100,
      });
      mockPrisma.adminLog.create.mockResolvedValueOnce({ id: 'log_3' });

      const result = await service.overrideVerification(
        fixtures.verificationId, 'VERIFIED', 100, 'Manual review confirmed identity',
        fixtures.adminId, fixtures.adminEmail,
      );

      expect(result.success).toBe(true);
      expect(result.verification_id).toBe(fixtures.verificationId);
      expect(mockPrisma.verificationRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: fixtures.verificationId },
          data: expect.objectContaining({
            status: 'VERIFIED',
            confidenceScore: 100,
          }),
        }),
      );
    });

    it('should record override reason in audit log details', async () => {
      mockPrisma.verificationRequest.update.mockResolvedValueOnce({ ...fixtures.verification });
      mockPrisma.adminLog.create.mockResolvedValueOnce({ id: 'log_4' });

      await service.overrideVerification(
        fixtures.verificationId, 'FAILED', 20, 'Suspect fraud',
        fixtures.adminId, fixtures.adminEmail,
      );

      const logArgs = mockPrisma.adminLog.create.mock.calls[0]![0];
      expect(logArgs.data.details).toEqual(
        expect.objectContaining({ reason: 'Suspect fraud', new_status: 'FAILED' }),
      );
    });
  });

  // ---------- getClient ----------
  describe('getClient', () => {
    it('should return client with api keys when found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce({
        ...fixtures.client,
        apiKeys: [],
        _count: { verifications: 10, usageRecords: 50 },
      });

      const result = await service.getClient(fixtures.clientId);
      expect(result.id).toBe(fixtures.clientId);
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);

      await expect(service.getClient('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});

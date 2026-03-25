import { mockPrisma } from '../test/prisma.mock';
import { fixtures } from '../test/helpers';

jest.mock('@veridi/database', () => ({
  prisma: mockPrisma,
}));

jest.mock('axios', () => ({
  default: { post: jest.fn() },
  __esModule: true,
}));

import { WebhookService } from './webhook.service';
import { QueueService } from '../common/services/queue.service';
import axios from 'axios';

describe('WebhookService', () => {
  let service: WebhookService;
  let queueService: jest.Mocked<QueueService>;

  beforeEach(() => {
    jest.clearAllMocks();

    queueService = {
      addBackgroundCheckJob: jest.fn().mockResolvedValue(undefined),
      addWebhookDeliveryJob: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<QueueService>;

    service = new WebhookService(queueService);
  });

  // ---------- sendTestWebhook ----------
  describe('sendTestWebhook', () => {
    it('should send test webhook when client has a webhook URL', async () => {
      mockPrisma.client.findUniqueOrThrow.mockResolvedValueOnce({ ...fixtures.client });
      (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

      const result = await service.sendTestWebhook(fixtures.clientId);

      expect(result.sent).toBe(true);
      expect(result.webhook_url).toBe(fixtures.client.webhookUrl);
      expect(axios.post).toHaveBeenCalledWith(
        fixtures.client.webhookUrl,
        expect.objectContaining({ event: 'test.ping' }),
        expect.objectContaining({
          headers: expect.objectContaining({ 'X-Veridi-Signature': expect.any(String) }),
        }),
      );
    });

    it('should return sent=false when client has no webhook URL', async () => {
      mockPrisma.client.findUniqueOrThrow.mockResolvedValueOnce({
        ...fixtures.client,
        webhookUrl: null,
      });

      const result = await service.sendTestWebhook(fixtures.clientId);

      expect(result.sent).toBe(false);
      expect(result.message).toBe('No webhook URL configured');
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('should return sent=false when webhook delivery fails', async () => {
      mockPrisma.client.findUniqueOrThrow.mockResolvedValueOnce({ ...fixtures.client });
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Connection timeout'));

      const result = await service.sendTestWebhook(fixtures.clientId);

      expect(result.sent).toBe(false);
      expect(result.message).toBe('Webhook delivery failed');
    });
  });

  // ---------- deliverWebhook ----------
  describe('deliverWebhook', () => {
    const testPayload = { verification_id: 'vrf_123', status: 'VERIFIED' };

    it('should deliver webhook and mark event as DELIVERED on success', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce({ ...fixtures.client });
      mockPrisma.webhookEvent.create.mockResolvedValueOnce({ ...fixtures.webhookEvent });
      (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });
      mockPrisma.webhookEvent.update.mockResolvedValueOnce({
        ...fixtures.webhookEvent, status: 'DELIVERED',
      });

      await service.deliverWebhook(fixtures.clientId, 'verification.completed', testPayload);

      expect(mockPrisma.webhookEvent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'DELIVERED', attempts: 1 }),
        }),
      );
    });

    it('should mark event as RETRYING when delivery fails', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce({ ...fixtures.client });
      mockPrisma.webhookEvent.create.mockResolvedValueOnce({ ...fixtures.webhookEvent });
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      mockPrisma.webhookEvent.update.mockResolvedValueOnce({
        ...fixtures.webhookEvent, status: 'RETRYING',
      });

      await service.deliverWebhook(fixtures.clientId, 'verification.completed', testPayload);

      expect(mockPrisma.webhookEvent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'RETRYING', attempts: 1 }),
        }),
      );
    });

    it('should silently return when client has no webhook URL', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce({
        ...fixtures.client,
        webhookUrl: null,
      });

      await service.deliverWebhook(fixtures.clientId, 'verification.completed', testPayload);

      expect(mockPrisma.webhookEvent.create).not.toHaveBeenCalled();
    });

    it('should silently return when client does not exist', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);

      await service.deliverWebhook('nonexistent', 'verification.completed', testPayload);

      expect(mockPrisma.webhookEvent.create).not.toHaveBeenCalled();
    });
  });

  // ---------- signPayload (tested indirectly) ----------
  describe('signPayload (via sendTestWebhook)', () => {
    it('should produce a valid HMAC-SHA256 hex signature', async () => {
      mockPrisma.client.findUniqueOrThrow.mockResolvedValueOnce({ ...fixtures.client });
      (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

      await service.sendTestWebhook(fixtures.clientId);

      const callArgs = (axios.post as jest.Mock).mock.calls[0];
      const signature = callArgs![2].headers['X-Veridi-Signature'] as string;

      // HMAC-SHA256 hex digest is always 64 characters
      expect(signature).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});

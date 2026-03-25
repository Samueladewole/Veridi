import { mockPrisma } from '../test/prisma.mock';

jest.mock('@veridi/database', () => ({
  prisma: mockPrisma,
}));

import { ScoreController } from './score.controller';

describe('ScoreController', () => {
  let controller: ScoreController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ScoreController();
  });

  describe('getScore', () => {
    it('should return score with band when subject has a score', async () => {
      mockPrisma.subjectIdentity.findUnique.mockResolvedValueOnce({
        subjectToken: 'abc_hash',
        veridiScore: 750,
        verificationCount: 8,
        lastVerifiedAt: new Date('2024-06-01T12:00:00.000Z'),
        scoreUpdatedAt: new Date('2024-06-01T12:00:00.000Z'),
      });

      const result = await controller.getScore('abc_hash');

      expect(result.score).toBe(750);
      expect(result.band).toBe('Established');
      expect(result.verification_count).toBe(8);
    });

    it('should return null score when subject is not found', async () => {
      mockPrisma.subjectIdentity.findUnique.mockResolvedValueOnce(null);

      const result = await controller.getScore('unknown_hash');

      expect(result.score).toBeNull();
      expect(result.message).toBe('Insufficient data');
    });

    it('should return null score when veridiScore is null', async () => {
      mockPrisma.subjectIdentity.findUnique.mockResolvedValueOnce({
        subjectToken: 'abc_hash',
        veridiScore: null,
        verificationCount: 0,
      });

      const result = await controller.getScore('abc_hash');

      expect(result.score).toBeNull();
      expect(result.message).toBe('Insufficient data');
    });

    it('should return Trusted band for score >= 800', async () => {
      mockPrisma.subjectIdentity.findUnique.mockResolvedValueOnce({
        subjectToken: 'top_hash',
        veridiScore: 850,
        verificationCount: 20,
        lastVerifiedAt: new Date(),
        scoreUpdatedAt: new Date(),
      });

      const result = await controller.getScore('top_hash');
      expect(result.band).toBe('Trusted');
    });

    it('should return Emerging band for score >= 400 and < 600', async () => {
      mockPrisma.subjectIdentity.findUnique.mockResolvedValueOnce({
        subjectToken: 'mid_hash',
        veridiScore: 450,
        verificationCount: 3,
        lastVerifiedAt: new Date(),
        scoreUpdatedAt: new Date(),
      });

      const result = await controller.getScore('mid_hash');
      expect(result.band).toBe('Emerging');
    });

    it('should return New band for score >= 200 and < 400', async () => {
      mockPrisma.subjectIdentity.findUnique.mockResolvedValueOnce({
        subjectToken: 'new_hash',
        veridiScore: 250,
        verificationCount: 1,
        lastVerifiedAt: new Date(),
        scoreUpdatedAt: new Date(),
      });

      const result = await controller.getScore('new_hash');
      expect(result.band).toBe('New');
    });

    it('should return Unverified band for score < 200', async () => {
      mockPrisma.subjectIdentity.findUnique.mockResolvedValueOnce({
        subjectToken: 'low_hash',
        veridiScore: 50,
        verificationCount: 0,
        lastVerifiedAt: null,
        scoreUpdatedAt: new Date(),
      });

      const result = await controller.getScore('low_hash');
      expect(result.band).toBe('Unverified');
    });
  });
});

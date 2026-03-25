import { fixtures } from '../test/helpers';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('aaaabbbb-cccc-dddd-eeee-ffffffffffff'),
}));

import { FaceService } from './face.service';
import { MlService, LivenessResult, FaceMatchResult } from './services/ml.service';
import { ConsentService } from '../verification/services/consent.service';

describe('FaceService', () => {
  let service: FaceService;
  let mlService: jest.Mocked<MlService>;
  let consentService: jest.Mocked<ConsentService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mlService = {
      detectLiveness: jest.fn(),
      matchFaces: jest.fn(),
    } as unknown as jest.Mocked<MlService>;

    consentService = {
      validateConsentToken: jest.fn().mockResolvedValue({
        sub: 'sub_hash', clientId: fixtures.clientId, purpose: 'face_check', type: 'consent',
      }),
    } as unknown as jest.Mocked<ConsentService>;

    service = new FaceService(mlService, consentService);
  });

  // ---------- checkLiveness ----------
  describe('checkLiveness', () => {
    const mockLivenessResult: LivenessResult = {
      liveness: true,
      confidence: 95,
      spoof_detected: false,
      ms: 120,
    };

    it('should return liveness result on success', async () => {
      mlService.detectLiveness.mockResolvedValueOnce(mockLivenessResult);

      const result = await service.checkLiveness('base64_image_data', 'consent_jwt', fixtures.clientId);

      expect(result.liveness).toBe(true);
      expect(result.confidence).toBe(95);
      expect(result.spoof_detected).toBe(false);
      expect(result.ms).toBe(120);
      expect(result.reference_id).toMatch(/^vrd_face_/);
    });

    it('should validate consent before processing', async () => {
      mlService.detectLiveness.mockResolvedValueOnce(mockLivenessResult);

      await service.checkLiveness('base64_image_data', 'consent_jwt', fixtures.clientId);

      expect(consentService.validateConsentToken).toHaveBeenCalledWith('consent_jwt', fixtures.clientId);
    });

    it('should propagate consent validation failure', async () => {
      consentService.validateConsentToken.mockRejectedValueOnce(
        new Error('Invalid consent'),
      );

      await expect(
        service.checkLiveness('base64_image', 'bad_token', fixtures.clientId),
      ).rejects.toThrow('Invalid consent');

      expect(mlService.detectLiveness).not.toHaveBeenCalled();
    });
  });

  // ---------- matchFaces ----------
  describe('matchFaces', () => {
    const mockMatchResult: FaceMatchResult = {
      match: true,
      similarity: 0.9234,
      ms: 200,
    };

    it('should return face match result on success', async () => {
      mlService.matchFaces.mockResolvedValueOnce(mockMatchResult);

      const result = await service.matchFaces(
        'selfie_base64', 'reference_base64', 'consent_jwt', fixtures.clientId,
      );

      expect(result.match).toBe(true);
      expect(result.similarity).toBe(0.92); // Rounded to 2 decimal places
      expect(result.ms).toBe(200);
      expect(result.reference_id).toMatch(/^vrd_match_/);
    });

    it('should validate consent before matching', async () => {
      mlService.matchFaces.mockResolvedValueOnce(mockMatchResult);

      await service.matchFaces('selfie', 'reference', 'consent_jwt', fixtures.clientId);

      expect(consentService.validateConsentToken).toHaveBeenCalledWith('consent_jwt', fixtures.clientId);
    });

    it('should correctly round similarity to two decimal places', async () => {
      mlService.matchFaces.mockResolvedValueOnce({
        match: true,
        similarity: 0.87654321,
        ms: 150,
      });

      const result = await service.matchFaces('selfie', 'ref', 'consent_jwt', fixtures.clientId);
      expect(result.similarity).toBe(0.88);
    });
  });
});

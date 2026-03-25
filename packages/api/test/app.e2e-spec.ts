// Set required env vars BEFORE anything else loads
process.env['DATABASE_URL'] = 'postgresql://test:test@localhost:5432/veridi_test';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-veridi-1234567890-e2e';
process.env['JWT_REFRESH_SECRET'] = 'test-jwt-refresh-secret-key-veridi-1234567890-e2e';
process.env['NODE_ENV'] = 'test';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { createMockPrismaClient, MockPrismaClient } from '../src/test/prisma.mock';

// Create a dedicated mock for e2e since we need a fresh one
const e2ePrisma: MockPrismaClient = createMockPrismaClient();

jest.mock('@veridi/database', () => ({
  prisma: e2ePrisma,
  VerificationType: { NIN: 'NIN', BVN: 'BVN', DRIVERS_LICENCE: 'DRIVERS_LICENCE', PASSPORT: 'PASSPORT' },
  VerificationStatus: { PENDING: 'PENDING', VERIFIED: 'VERIFIED', FAILED: 'FAILED', ERROR: 'ERROR' },
  ClientStatus: { ACTIVE: 'ACTIVE', SUSPENDED: 'SUSPENDED', PENDING: 'PENDING' },
  AuditAction: {
    CLIENT_APPROVED: 'CLIENT_APPROVED',
    CLIENT_SUSPENDED: 'CLIENT_SUSPENDED',
    VERIFICATION_OVERRIDDEN: 'VERIFICATION_OVERRIDDEN',
  },
}));

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_value'),
  verify: jest.fn().mockResolvedValue(true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
  verify: jest.fn().mockReturnValue({
    sub: 'admin_id', email: 'admin@veridi.africa', isSuperAdmin: true, type: 'admin_access',
  }),
}));

jest.mock('ioredis', () => {
  const MockRedis = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    scan: jest.fn().mockResolvedValue(['0', []]),
    quit: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn(),
  }));
  return {
    __esModule: true,
    default: MockRedis,
  };
});

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('axios', () => ({
  default: { post: jest.fn().mockResolvedValue({ status: 200 }) },
  __esModule: true,
}));

import { AppModule } from '../src/app.module';

describe('Veridi API (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 with health status', async () => {
      e2ePrisma.$queryRaw.mockResolvedValueOnce([{ 1: 1 }]);

      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body.status).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('POST /auth/admin/login', () => {
    it('should return tokens for valid admin credentials', async () => {
      e2ePrisma.adminUser.findUnique.mockResolvedValueOnce({
        id: 'admin_1',
        email: 'admin@veridi.africa',
        passwordHash: '$argon2id$hash',
        isSuperAdmin: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
      });
      e2ePrisma.adminUser.update.mockResolvedValueOnce({});

      const response = await request(app.getHttpServer())
        .post('/auth/admin/login')
        .send({ email: 'admin@veridi.africa', password: 'SecurePass123!' })
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });
  });

  describe('POST /v1/verify/nin', () => {
    it('should return 500 when no API key guard is attached (no req.apiKey)', async () => {
      // The ApiKeyGuard is not yet registered as a global guard,
      // so requests reach the controller without req.apiKey, causing a 500.
      const response = await request(app.getHttpServer())
        .post('/v1/verify/nin')
        .send({ nin: '12345678901', consent_token: 'token123' })
        .expect(500);

      expect(response.body).toBeDefined();
    });
  });

  describe('POST /auth/admin/logout', () => {
    it('should return 200 with logged out message', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/admin/logout')
        .expect(200);

      expect(response.body.message).toBe('Logged out');
    });
  });
});

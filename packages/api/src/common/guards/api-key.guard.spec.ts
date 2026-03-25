import { UnauthorizedException, ForbiddenException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createHash } from 'crypto';
import { mockPrisma } from '../../test/prisma.mock';
import { fixtures } from '../../test/helpers';
import type { RedisService } from '../services/redis.service';

jest.mock('@veridi/database', () => ({
  prisma: mockPrisma,
}));

import { ApiKeyGuard } from './api-key.guard';

const mockRedisService: jest.Mocked<RedisService> = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
  delPattern: jest.fn().mockResolvedValue(undefined),
  onModuleDestroy: jest.fn().mockResolvedValue(undefined),
} as unknown as jest.Mocked<RedisService>;

// Helper to build a mock ExecutionContext
function createMockContext(headers: Record<string, string | undefined> = {}, ip = '127.0.0.1'): ExecutionContext {
  const request = {
    headers,
    ip,
  };

  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext;
}

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let reflector: Reflector;

  beforeEach(() => {
    jest.clearAllMocks();
    reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) } as unknown as Reflector;
    guard = new ApiKeyGuard(reflector, mockRedisService);
  });

  it('should allow access when route is marked @Public()', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce(true);
    const context = createMockContext();

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException when authorization header is missing', async () => {
    const context = createMockContext({});

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when authorization is not Bearer format', async () => {
    const context = createMockContext({ authorization: 'Basic abc123' });

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when API key is not found in DB', async () => {
    const rawKey = 'vrd_live_abc_test_key_12345';
    const context = createMockContext({ authorization: `Bearer ${rawKey}` });
    mockPrisma.apiKey.findUnique.mockResolvedValueOnce(null);

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when API key has been revoked', async () => {
    const rawKey = 'vrd_live_abc_test_key_12345';
    const context = createMockContext({ authorization: `Bearer ${rawKey}` });
    mockPrisma.apiKey.findUnique.mockResolvedValueOnce({
      ...fixtures.apiKey,
      revokedAt: new Date(),
    });

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException when client is not active', async () => {
    const rawKey = 'vrd_live_abc_test_key_12345';
    const context = createMockContext({ authorization: `Bearer ${rawKey}` });
    mockPrisma.apiKey.findUnique.mockResolvedValueOnce({
      ...fixtures.apiKey,
      revokedAt: null,
      client: { ...fixtures.apiKey.client, status: 'SUSPENDED' },
    });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should allow request when IP is in allowlist', async () => {
    const rawKey = 'vrd_live_abc_test_key_12345';
    const context = createMockContext({ authorization: `Bearer ${rawKey}` }, '10.0.0.1');
    mockPrisma.apiKey.findUnique.mockResolvedValueOnce({
      ...fixtures.apiKey,
      revokedAt: null,
      ipAllowlist: ['10.0.0.1', '10.0.0.2'],
      client: { ...fixtures.apiKey.client, status: 'ACTIVE' },
    });
    mockPrisma.apiKey.update.mockResolvedValueOnce({});

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when IP is not in allowlist', async () => {
    const rawKey = 'vrd_live_abc_test_key_12345';
    const context = createMockContext({ authorization: `Bearer ${rawKey}` }, '192.168.1.99');
    mockPrisma.apiKey.findUnique.mockResolvedValueOnce({
      ...fixtures.apiKey,
      revokedAt: null,
      ipAllowlist: ['10.0.0.1'],
      client: { ...fixtures.apiKey.client, status: 'ACTIVE' },
    });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should skip IP check when allowlist is empty', async () => {
    const rawKey = 'vrd_live_abc_test_key_12345';
    const context = createMockContext({ authorization: `Bearer ${rawKey}` }, '1.2.3.4');
    mockPrisma.apiKey.findUnique.mockResolvedValueOnce({
      ...fixtures.apiKey,
      revokedAt: null,
      ipAllowlist: [],
      client: { ...fixtures.apiKey.client, status: 'ACTIVE' },
    });
    mockPrisma.apiKey.update.mockResolvedValueOnce({});

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should attach client and apiKey to the request object', async () => {
    const rawKey = 'vrd_live_abc_test_key_12345';
    const request = { headers: { authorization: `Bearer ${rawKey}` }, ip: '127.0.0.1' } as Record<string, unknown>;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;

    const mockApiKeyRecord = {
      ...fixtures.apiKey,
      revokedAt: null,
      ipAllowlist: [],
      client: { ...fixtures.apiKey.client, status: 'ACTIVE' },
    };
    mockPrisma.apiKey.findUnique.mockResolvedValueOnce(mockApiKeyRecord);
    mockPrisma.apiKey.update.mockResolvedValueOnce({});

    await guard.canActivate(context);

    expect(request['apiKey']).toBeDefined();
    expect(request['client']).toBeDefined();
  });

  it('should use x-forwarded-for header for IP check when present', async () => {
    const rawKey = 'vrd_live_abc_test_key_12345';
    const context = createMockContext(
      { authorization: `Bearer ${rawKey}`, 'x-forwarded-for': '10.0.0.1, 172.16.0.1' },
      '127.0.0.1',
    );
    mockPrisma.apiKey.findUnique.mockResolvedValueOnce({
      ...fixtures.apiKey,
      revokedAt: null,
      ipAllowlist: ['10.0.0.1'],
      client: { ...fixtures.apiKey.client, status: 'ACTIVE' },
    });
    mockPrisma.apiKey.update.mockResolvedValueOnce({});

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should hash the raw key with SHA-256 for DB lookup', async () => {
    const rawKey = 'vrd_live_abc_test_key_12345';
    const expectedHash = createHash('sha256').update(rawKey).digest('hex');
    const context = createMockContext({ authorization: `Bearer ${rawKey}` });
    mockPrisma.apiKey.findUnique.mockResolvedValueOnce(null);

    await guard.canActivate(context).catch(() => { /* expected to throw */ });

    expect(mockPrisma.apiKey.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { keyHash: expectedHash } }),
    );
  });
});

/**
 * Test utilities: mock factories, fixtures, and shared helpers for the Veridi API test suite.
 */

// ---------------------------------------------------------------------------
// Mock ConfigService factory
// ---------------------------------------------------------------------------
export function createMockConfigService(
  overrides: Record<string, string> = {},
): { get: jest.Mock } {
  const defaults: Record<string, string> = {
    JWT_SECRET: 'test-jwt-secret-key-veridi-12345',
    JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-key-veridi-12345',
    JWT_ACCESS_EXPIRY: '15m',
    JWT_REFRESH_EXPIRY: '7d',
    ML_SERVICE_URL: '',
    NIMC_API_KEY: '',
    NIBSS_API_KEY: '',
  };

  const config = { ...defaults, ...overrides };

  return {
    get: jest.fn((key: string) => config[key] ?? undefined),
  };
}

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------
export const fixtures = {
  clientId: 'clnt_test_abc123',
  apiKeyId: 'key_test_xyz789',
  adminId: 'adm_test_def456',
  adminEmail: 'admin@veridi.africa',
  verificationId: 'vrf_test_ghi012',
  backgroundCheckId: 'bgc_test_jkl345',
  subjectToken: 'hashed_subject_token_abc',

  client: {
    id: 'clnt_test_abc123',
    name: 'Test Client Ltd',
    email: 'client@example.com',
    status: 'ACTIVE' as const,
    tier: 'GROWTH' as const,
    webhookUrl: 'https://example.com/webhook',
    webhookSecret: 'whsec_test_secret_123',
    createdAt: new Date('2024-01-15T10:00:00.000Z'),
    updatedAt: new Date('2024-01-15T10:00:00.000Z'),
  },

  apiKey: {
    id: 'key_test_xyz789',
    clientId: 'clnt_test_abc123',
    name: 'Production Key',
    keyPrefix: 'vrd_live_abc',
    keyHash: 'sha256_hash_of_key',
    isLive: true,
    revokedAt: null,
    lastUsedAt: new Date('2024-06-01T12:00:00.000Z'),
    ipAllowlist: [] as string[],
    scopes: ['verify:nin', 'verify:bvn'],
    createdAt: new Date('2024-01-15T10:00:00.000Z'),
    client: {
      id: 'clnt_test_abc123',
      name: 'Test Client Ltd',
      status: 'ACTIVE' as const,
    },
  },

  adminUser: {
    id: 'adm_test_def456',
    email: 'admin@veridi.africa',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$mock_hash_for_testing',
    isSuperAdmin: true,
    lastLoginAt: new Date('2024-06-01T10:00:00.000Z'),
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
  },

  verification: {
    id: 'vrf_test_ghi012',
    clientId: 'clnt_test_abc123',
    apiKeyId: 'key_test_xyz789',
    type: 'NIN' as const,
    status: 'VERIFIED' as const,
    subjectToken: 'hashed_subject_token_abc',
    consentTokenId: 'consent_12char',
    confidenceScore: 97,
    matchFields: ['name', 'dob', 'gender'],
    sourceDatabase: 'nimc_nvs',
    requestIp: '192.168.1.1',
    responseMs: 350,
    expiresAt: new Date('2024-06-02T12:00:00.000Z'),
    resolvedAt: new Date('2024-06-01T12:00:00.000Z'),
    createdAt: new Date('2024-06-01T12:00:00.000Z'),
    updatedAt: new Date('2024-06-01T12:00:00.000Z'),
  },

  backgroundCheck: {
    id: 'bgc_test_jkl345',
    clientId: 'clnt_test_abc123',
    subjectToken: 'hashed_subject_token_abc',
    checkTypes: ['criminal_record', 'credit_history'],
    status: 'PENDING' as const,
    reportUrl: null,
    expiresAt: new Date('2024-07-01T12:00:00.000Z'),
    requestedAt: new Date('2024-06-01T12:00:00.000Z'),
    completedAt: null,
  },

  webhookEvent: {
    id: 'whe_test_mno678',
    clientId: 'clnt_test_abc123',
    eventType: 'verification.completed',
    payloadHash: 'hmac_sha256_hash',
    status: 'DELIVERED' as const,
    attempts: 1,
    deliveredAt: new Date('2024-06-01T12:00:01.000Z'),
    lastAttempt: null,
    createdAt: new Date('2024-06-01T12:00:00.000Z'),
  },
} as const;

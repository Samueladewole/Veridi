/**
 * Deep mock of the Prisma client for unit tests.
 * Every model method returns a jest.fn() by default.
 */

type MockPrismaModel = {
  findUnique: jest.Mock;
  findUniqueOrThrow: jest.Mock;
  findFirst: jest.Mock;
  findMany: jest.Mock;
  create: jest.Mock;
  createMany: jest.Mock;
  update: jest.Mock;
  updateMany: jest.Mock;
  delete: jest.Mock;
  deleteMany: jest.Mock;
  count: jest.Mock;
  aggregate: jest.Mock;
  upsert: jest.Mock;
};

function createMockModel(): MockPrismaModel {
  return {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    upsert: jest.fn(),
  };
}

export interface MockPrismaClient {
  client: MockPrismaModel;
  apiKey: MockPrismaModel;
  verificationRequest: MockPrismaModel;
  consentRecord: MockPrismaModel;
  subjectIdentity: MockPrismaModel;
  backgroundCheck: MockPrismaModel;
  webhookEvent: MockPrismaModel;
  usageRecord: MockPrismaModel;
  adminLog: MockPrismaModel;
  adminUser: MockPrismaModel;
  $queryRaw: jest.Mock;
  $transaction: jest.Mock;
}

export function createMockPrismaClient(): MockPrismaClient {
  return {
    client: createMockModel(),
    apiKey: createMockModel(),
    verificationRequest: createMockModel(),
    consentRecord: createMockModel(),
    subjectIdentity: createMockModel(),
    backgroundCheck: createMockModel(),
    webhookEvent: createMockModel(),
    usageRecord: createMockModel(),
    adminLog: createMockModel(),
    adminUser: createMockModel(),
    $queryRaw: jest.fn(),
    $transaction: jest.fn(),
  };
}

/**
 * A singleton mock used by jest.mock('@veridi/database').
 * Tests can import this to configure return values.
 */
export const mockPrisma = createMockPrismaClient();

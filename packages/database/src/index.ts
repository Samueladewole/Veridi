import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}

export { PrismaClient };
export {
  VerificationType,
  VerificationStatus,
  ClientTier,
  ClientStatus,
  ApiKeyScope,
  WebhookStatus,
  DisputeStatus,
  AuditAction,
} from "@prisma/client";

export type {
  Client,
  ApiKey,
  VerificationRequest,
  ConsentRecord,
  SubjectIdentity,
  BackgroundCheck,
  WebhookEvent,
  UsageRecord,
  AdminLog,
  AdminUser,
} from "@prisma/client";

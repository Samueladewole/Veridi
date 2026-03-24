import {
  Injectable,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import {
  prisma,
  ClientStatus,
  VerificationStatus,
  AuditAction,
} from "@veridi/database";
import type { Prisma } from "@prisma/client";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  async getDashboardStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalClients, activeClients, callsToday, callsMonth, failedWebhooks] =
      await Promise.all([
        prisma.client.count(),
        prisma.client.count({ where: { status: ClientStatus.ACTIVE } }),
        prisma.usageRecord.count({ where: { createdAt: { gte: todayStart } } }),
        prisma.usageRecord.count({ where: { createdAt: { gte: monthStart } } }),
        prisma.webhookEvent.count({ where: { status: "FAILED" } }),
      ]);

    return {
      total_clients: totalClients,
      active_clients: activeClients,
      calls_today: callsToday,
      calls_month: callsMonth,
      mrr: 0, // TODO: Aggregate from clients
      error_rate_24h: 0,
      queue_depth: 0, // TODO: Read from BullMQ
      failed_webhooks: failedWebhooks,
    };
  }

  async getClients(
    filters: { status?: string; tier?: string },
    page: number,
    limit: number,
  ) {
    const where: Prisma.ClientWhereInput = {};
    if (filters.status) where.status = filters.status as ClientStatus;
    if (filters.tier) where.tier = filters.tier as Prisma.ClientWhereInput["tier"];

    const [data, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { apiKeys: true, verifications: true } } },
      }),
      prisma.client.count({ where }),
    ]);

    return {
      data,
      _meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getClient(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        apiKeys: { select: { id: true, name: true, keyPrefix: true, isLive: true, lastUsedAt: true, revokedAt: true, createdAt: true } },
        _count: { select: { verifications: true, usageRecords: true } },
      },
    });

    if (!client) throw new NotFoundException("Client not found");
    return client;
  }

  async approveClient(clientId: string, adminId: string, adminEmail: string) {
    const client = await prisma.client.update({
      where: { id: clientId },
      data: { status: ClientStatus.ACTIVE },
    });

    await this.logAction(adminId, adminEmail, AuditAction.CLIENT_APPROVED, "Client", clientId);
    this.logger.log(`Client ${client.name} approved by ${adminEmail}`);

    return { success: true, client_id: clientId, status: "ACTIVE" };
  }

  async suspendClient(clientId: string, adminId: string, adminEmail: string) {
    await prisma.$transaction([
      prisma.client.update({
        where: { id: clientId },
        data: { status: ClientStatus.SUSPENDED },
      }),
      prisma.apiKey.updateMany({
        where: { clientId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    await this.logAction(adminId, adminEmail, AuditAction.CLIENT_SUSPENDED, "Client", clientId);
    this.logger.log(`Client ${clientId} suspended by ${adminEmail}`);

    return { success: true, client_id: clientId, status: "SUSPENDED" };
  }

  async getVerifications(
    filters: { status?: string; type?: string; clientId?: string },
    page: number,
    limit: number,
  ) {
    const where: Prisma.VerificationRequestWhereInput = {};
    if (filters.status) where.status = filters.status as VerificationStatus;
    if (filters.type) where.type = filters.type as Prisma.VerificationRequestWhereInput["type"];
    if (filters.clientId) where.clientId = filters.clientId;

    const [data, total] = await Promise.all([
      prisma.verificationRequest.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.verificationRequest.count({ where }),
    ]);

    return {
      data,
      _meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async overrideVerification(
    verificationId: string,
    status: string,
    confidence: number,
    reason: string,
    adminId: string,
    adminEmail: string,
  ) {
    await prisma.verificationRequest.update({
      where: { id: verificationId },
      data: {
        status: status as VerificationStatus,
        confidenceScore: confidence,
        resolvedAt: new Date(),
      },
    });

    await this.logAction(
      adminId,
      adminEmail,
      AuditAction.VERIFICATION_OVERRIDDEN,
      "VerificationRequest",
      verificationId,
      { reason, new_status: status, new_confidence: confidence },
    );

    return { success: true, verification_id: verificationId };
  }

  async getAuditLog(
    filters: { action?: string; adminId?: string },
    page: number,
    limit: number,
  ) {
    const where: Prisma.AdminLogWhereInput = {};
    if (filters.action) where.action = filters.action as AuditAction;
    if (filters.adminId) where.adminId = filters.adminId;

    const [data, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.adminLog.count({ where }),
    ]);

    return {
      data,
      _meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getFlaggedVerifications() {
    const flagged = await prisma.verificationRequest.findMany({
      where: {
        OR: [
          { confidenceScore: { lt: 60 } },
          { status: VerificationStatus.ERROR },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return flagged;
  }

  private async logAction(
    adminId: string,
    adminEmail: string,
    action: AuditAction,
    entityType: string,
    entityId: string,
    details?: Record<string, unknown>,
  ): Promise<void> {
    await prisma.adminLog.create({
      data: { adminId, adminEmail, action, entityType, entityId, details: details ? (details as Prisma.InputJsonValue) : undefined },
    });
  }
}

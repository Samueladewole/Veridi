/** Mock API functions for pages without real API endpoints yet. Same async pattern for easy swap. */

export interface SystemService {
  readonly name: string;
  readonly status: "ok" | "warn" | "down";
}

export interface DataSourceInfo {
  readonly name: string;
  readonly description: string;
  readonly status: "ok" | "warn" | "down";
  readonly latency: string;
  readonly uptime: string;
  readonly uptimeStatus: "ok" | "warn";
}

export interface RevenueMonth {
  readonly month: string;
  readonly value: number;
}

export interface RevenueSource {
  readonly label: string;
  readonly percentage: number;
  readonly color: string;
}

export interface RevenueData {
  readonly monthly: readonly RevenueMonth[];
  readonly sources: readonly RevenueSource[];
  readonly momGrowth: string;
}

export interface InfrastructureDataSource {
  readonly name: string;
  readonly provider: string;
  readonly status: "healthy" | "degraded" | "down";
  readonly latencyMs: number;
  readonly uptime: string;
  readonly lastChecked: string;
}

export interface WebhookInfo {
  readonly id: string;
  readonly clientName: string;
  readonly endpoint: string;
  readonly status: "active" | "failing" | "disabled";
  readonly successRate: string;
  readonly lastDelivery: string;
}

export interface BillingOverview {
  readonly mrr: string;
  readonly arr: string;
  readonly activeSubscriptions: number;
  readonly payPerCallRevenue: string;
  readonly collectionRate: string;
}

export interface AnalyticsOverview {
  readonly dailyVolume: number;
  readonly weeklyGrowth: string;
  readonly avgLatency: string;
  readonly topClients: readonly { name: string; calls: number }[];
}

export interface DisputeRecord {
  readonly id: string;
  readonly clientName: string;
  readonly type: string;
  readonly status: "open" | "investigating" | "resolved";
  readonly createdAt: string;
  readonly description: string;
}

export interface SecurityConfig {
  readonly rateLimiting: { enabled: boolean; maxRequests: number; windowMs: number };
  readonly ipWhitelist: readonly string[];
  readonly mfaRequired: boolean;
  readonly sessionTimeout: number;
}

// ─── Mock Data Fetchers ───────────────────────────────────────

export async function getSystemStatus(): Promise<readonly SystemService[]> {
  return [
    { name: "Cloudflare WAF", status: "ok" },
    { name: "Railway API", status: "ok" },
    { name: "PostgreSQL", status: "ok" },
    { name: "Redis", status: "ok" },
    { name: "NIMC NVS", status: "warn" },
    { name: "NIBSS", status: "ok" },
    { name: "BullMQ Worker", status: "ok" },
  ];
}

export async function getDataSourcesHealth(): Promise<readonly DataSourceInfo[]> {
  return [
    {
      name: "NIMC NVS API",
      description: "NIN Verification \u00B7 Direct licence",
      status: "ok",
      latency: "342ms",
      uptime: "99.9%",
      uptimeStatus: "ok",
    },
    {
      name: "Smile Identity",
      description: "Biometric relay \u00B7 Phase 1",
      status: "warn",
      latency: "1,240ms",
      uptime: "97.2%",
      uptimeStatus: "warn",
    },
    {
      name: "NIBSS / BVN",
      description: "BVN Verification \u00B7 Partnership",
      status: "ok",
      latency: "580ms",
      uptime: "99.7%",
      uptimeStatus: "ok",
    },
    {
      name: "FRSC",
      description: "Driver\u2019s Licence \u00B7 API",
      status: "ok",
      latency: "620ms",
      uptime: "98.9%",
      uptimeStatus: "ok",
    },
    {
      name: "Paystack",
      description: "Billing \u00B7 Subscriptions",
      status: "ok",
      latency: "180ms",
      uptime: "99.99%",
      uptimeStatus: "ok",
    },
  ];
}

export async function getRevenueData(): Promise<RevenueData> {
  return {
    monthly: [
      { month: "Oct", value: 1200 },
      { month: "Nov", value: 1580 },
      { month: "Dec", value: 2100 },
      { month: "Jan", value: 2800 },
      { month: "Feb", value: 3600 },
      { month: "Mar", value: 4200 },
    ],
    sources: [
      { label: "Subscriptions", percentage: 62, color: "bg-amber" },
      { label: "Pay-per-call", percentage: 28, color: "bg-blue" },
      { label: "Background", percentage: 10, color: "bg-purple" },
    ],
    momGrowth: "+17.3%",
  };
}

export async function getInfrastructureDataSources(): Promise<
  readonly InfrastructureDataSource[]
> {
  return [
    {
      name: "NIMC NVS API",
      provider: "NIMC",
      status: "healthy",
      latencyMs: 342,
      uptime: "99.9%",
      lastChecked: "2 min ago",
    },
    {
      name: "Smile Identity",
      provider: "Smile ID",
      status: "degraded",
      latencyMs: 1240,
      uptime: "97.2%",
      lastChecked: "1 min ago",
    },
    {
      name: "NIBSS / BVN",
      provider: "NIBSS",
      status: "healthy",
      latencyMs: 580,
      uptime: "99.7%",
      lastChecked: "3 min ago",
    },
    {
      name: "FRSC Licence API",
      provider: "FRSC",
      status: "healthy",
      latencyMs: 620,
      uptime: "98.9%",
      lastChecked: "1 min ago",
    },
    {
      name: "Paystack Billing",
      provider: "Paystack",
      status: "healthy",
      latencyMs: 180,
      uptime: "99.99%",
      lastChecked: "30s ago",
    },
  ];
}

export async function getWebhooks(): Promise<readonly WebhookInfo[]> {
  return [
    {
      id: "wh_01",
      clientName: "Tendr.ng",
      endpoint: "https://api.tendr.ng/webhooks/veridi",
      status: "active",
      successRate: "99.8%",
      lastDelivery: "2 min ago",
    },
    {
      id: "wh_02",
      clientName: "MedStaff NG",
      endpoint: "https://hooks.medstaff.ng/verify",
      status: "active",
      successRate: "99.5%",
      lastDelivery: "4 min ago",
    },
    {
      id: "wh_03",
      clientName: "DomestiqNG",
      endpoint: "https://domestiq.ng/api/callback",
      status: "failing",
      successRate: "42.1%",
      lastDelivery: "5 days ago",
    },
  ];
}

export async function getBillingOverview(): Promise<BillingOverview> {
  return {
    mrr: "\u20A64.2M",
    arr: "\u20A650.4M",
    activeSubscriptions: 42,
    payPerCallRevenue: "\u20A61.18M",
    collectionRate: "97.3%",
  };
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  return {
    dailyVolume: 84200,
    weeklyGrowth: "+12.4%",
    avgLatency: "480ms",
    topClients: [
      { name: "TrustPay Africa", calls: 42100 },
      { name: "MedStaff NG", calls: 18200 },
      { name: "Tendr.ng", calls: 12400 },
      { name: "Logistics247", calls: 6800 },
      { name: "Kareful App", calls: 4700 },
    ],
  };
}

export async function getDisputes(): Promise<readonly DisputeRecord[]> {
  return [
    {
      id: "dsp_01",
      clientName: "Logistics247",
      type: "NIN Mismatch",
      status: "open",
      createdAt: "2026-03-23T10:30:00Z",
      description: "Client claims NIN verification returned wrong name match",
    },
    {
      id: "dsp_02",
      clientName: "Kareful App",
      type: "Billing Overcharge",
      status: "investigating",
      createdAt: "2026-03-22T14:15:00Z",
      description: "Duplicate charges for failed verification calls",
    },
    {
      id: "dsp_03",
      clientName: "TrustPay Africa",
      type: "Liveness False Positive",
      status: "resolved",
      createdAt: "2026-03-20T09:00:00Z",
      description: "Liveness check incorrectly flagged legitimate user",
    },
  ];
}

export async function getSecurityConfig(): Promise<SecurityConfig> {
  return {
    rateLimiting: { enabled: true, maxRequests: 1000, windowMs: 60000 },
    ipWhitelist: ["41.58.0.0/16", "102.89.0.0/16"],
    mfaRequired: true,
    sessionTimeout: 28800,
  };
}

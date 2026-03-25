import { adminFetch, ApiError } from "./api";
import { formatNaira, formatNumber, getInitials, tierToPlan, statusToAccountStatus, timeAgo } from "./format-helpers";
import { getSystemStatus, getDataSourcesHealth, getRevenueData } from "./mock-api";
import type {
  AdminStatsResponse,
  ClientsApiResponse,
  AuditApiResponse,
  FlaggedApiItem,
  VerificationsApiResponse,
  VerificationApiItem,
} from "./api-types";
import type { KpiItem } from "@/components/kpi-grid";
import type { QueueItem } from "@/components/verification-queue";
import type { ClientTableRow } from "@/components/client-table";
import type { AuditRow } from "@/components/audit-log";
import type { SystemService } from "@/components/system-status";
import type { DataSourceItem } from "@/components/data-source-health";
import type { MonthData, RevenueSourceData } from "@/components/revenue-chart";

// ─── Dashboard KPIs ─────────────────────────────────────────

export async function fetchKpiData(): Promise<readonly KpiItem[]> {
  try {
    const stats = await adminFetch<AdminStatsResponse>("/admin/dashboard/stats");
    return [
      {
        label: "Total Clients",
        value: String(stats.total_clients),
        sub: `${stats.active_clients} active`,
        trend: `${stats.total_clients - stats.active_clients} pending/suspended`,
        trendDir: "up" as const,
      },
      {
        label: "Pending Queue",
        value: String(stats.queue_depth),
        sub: "Need review",
        trend: stats.queue_depth > 5 ? "High volume" : "Normal",
        trendDir: stats.queue_depth > 5 ? ("down" as const) : ("same" as const),
        color: "red" as const,
        valueColor: "text-red",
      },
      {
        label: "API Calls Today",
        value: formatNumber(stats.calls_today),
        sub: "All clients",
        trend: `${formatNumber(stats.calls_month)} this month`,
        trendDir: "up" as const,
      },
      {
        label: "MRR",
        value: formatNaira(stats.mrr),
        sub: "Monthly recurring",
        trend: "Current month",
        trendDir: "up" as const,
        color: "green" as const,
        valueColor: "text-green",
      },
      {
        label: "Error Rate",
        value: `${stats.error_rate_24h.toFixed(1)}%`,
        sub: "Last 24 hours",
        trend: stats.error_rate_24h < 2 ? "Within SLA" : "Above SLA",
        trendDir: stats.error_rate_24h < 2 ? ("same" as const) : ("down" as const),
        color: "purple" as const,
        valueColor: "text-purple",
      },
    ];
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) throw error;
    return [
      { label: "Total Clients", value: "--", sub: "Unable to load", trend: "API unavailable", trendDir: "same" },
    ];
  }
}

// ─── Recent Clients ─────────────────────────────────────────

export async function fetchRecentClients(): Promise<{
  clients: readonly ClientTableRow[];
  activeCount: number;
  pendingCount: number;
}> {
  try {
    const response = await adminFetch<ClientsApiResponse>("/admin/clients?limit=7");
    const clients: ClientTableRow[] = response.data.map((c) => ({
      name: c.name,
      initials: getInitials(c.name),
      plan: tierToPlan(c.tier),
      status: statusToAccountStatus(c.status),
      calls: formatNumber(c.callsThisMonth),
      mrr: "--",
      joined: new Date(c.createdAt).toLocaleDateString("en-NG", { month: "short", year: "numeric" }),
      lastActive: timeAgo(c.createdAt),
    }));

    return {
      clients,
      activeCount: response.data.filter((c) => c.status.toLowerCase() === "active").length,
      pendingCount: response.data.filter((c) => c.status.toLowerCase() === "pending").length,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) throw error;
    return { clients: [], activeCount: 0, pendingCount: 0 };
  }
}

// ─── Verification Queue Items ───────────────────────────────

export async function fetchQueueItems(): Promise<{
  items: readonly QueueItem[];
  pendingCount: number;
}> {
  try {
    const response = await adminFetch<FlaggedApiItem[] | { data: FlaggedApiItem[] }>("/admin/flagged");
    const flagged = Array.isArray(response) ? response : response.data ?? [];

    const items: QueueItem[] = flagged.map((f) => ({
      icon: f.type === "NIN" ? "\uD83E\uDEAA" : f.type === "BVN" ? "\uD83D\uDCCB" : "\u26A0",
      iconVariant: f.severity === "high" ? ("red" as const) : f.severity === "medium" ? ("amber" as const) : ("blue" as const),
      urgency: f.severity === "high" ? ("urgent" as const) : ("review" as const),
      title: `${f.type} Flagged \u2014 ${f.clientName}`,
      meta: f.reason,
      time: timeAgo(f.createdAt),
      actions: ["approve" as const, "reject" as const, "view" as const],
    }));

    return { items, pendingCount: items.length };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) throw error;
    return { items: [], pendingCount: 0 };
  }
}

// ─── Audit Log ──────────────────────────────────────────────

export async function fetchAuditLog(): Promise<readonly AuditRow[]> {
  try {
    const response = await adminFetch<AuditApiResponse>("/admin/audit-log?limit=7");
    return response.data.map((entry) => ({
      time: new Date(entry.createdAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false }),
      actor: entry.actor,
      action: entry.action,
      entity: entry.entity,
    }));
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) throw error;
    return [];
  }
}

// ─── Recent Verifications ───────────────────────────────────

export async function fetchRecentVerifications(): Promise<readonly VerificationApiItem[]> {
  try {
    const response = await adminFetch<VerificationsApiResponse>("/admin/verifications?limit=10");
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) throw error;
    return [];
  }
}

// ─── Mock Data Wrappers ─────────────────────────────────────

export async function fetchSystemStatus(): Promise<readonly SystemService[]> {
  return getSystemStatus();
}

export async function fetchDataSources(): Promise<readonly DataSourceItem[]> {
  const sources = await getDataSourcesHealth();
  return sources.map((s) => ({
    name: s.name,
    description: s.description,
    status: s.status,
    latency: s.latency,
    uptime: s.uptime,
    uptimeStatus: s.uptimeStatus,
  }));
}

export async function fetchRevenueData(): Promise<{
  monthly: readonly MonthData[];
  sources: readonly RevenueSourceData[];
  momGrowth: string;
}> {
  const data = await getRevenueData();
  return { monthly: data.monthly, sources: data.sources, momGrowth: data.momGrowth };
}

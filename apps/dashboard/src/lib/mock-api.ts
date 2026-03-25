/**
 * Async wrappers around mock data for endpoints that don't exist yet.
 * Architecture is production-ready: swap these implementations with real
 * API calls as backend endpoints are built.
 */
import type {
  KpiCard,
  ChartBar,
  EndpointBreakdown,
  RecentCall,
  WebhookDelivery,
  ApiKey,
} from "./mock-data";
import {
  kpiCards,
  chartBars,
  endpointBreakdowns,
  recentCalls,
  webhookDeliveries,
  apiKeys,
} from "./mock-data";

/** Simulates network latency for realistic loading states during development */
async function simulateLatency(): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

export async function fetchKpiCards(): Promise<KpiCard[]> {
  await simulateLatency();
  return kpiCards;
}

export async function fetchChartBars(): Promise<ChartBar[]> {
  await simulateLatency();
  return chartBars;
}

export async function fetchEndpointBreakdowns(): Promise<EndpointBreakdown[]> {
  await simulateLatency();
  return endpointBreakdowns;
}

export async function fetchRecentCalls(): Promise<RecentCall[]> {
  await simulateLatency();
  return recentCalls;
}

export async function fetchWebhookDeliveries(): Promise<WebhookDelivery[]> {
  await simulateLatency();
  return webhookDeliveries;
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
  await simulateLatency();
  return apiKeys;
}

export interface DashboardStats {
  kpiCards: KpiCard[];
  chartBars: ChartBar[];
  endpointBreakdowns: EndpointBreakdown[];
  recentCalls: RecentCall[];
  webhookDeliveries: WebhookDelivery[];
  apiKeys: ApiKey[];
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [
    kpiData,
    chartData,
    breakdownData,
    callsData,
    webhooksData,
    keysData,
  ] = await Promise.all([
    fetchKpiCards(),
    fetchChartBars(),
    fetchEndpointBreakdowns(),
    fetchRecentCalls(),
    fetchWebhookDeliveries(),
    fetchApiKeys(),
  ]);

  return {
    kpiCards: kpiData,
    chartBars: chartData,
    endpointBreakdowns: breakdownData,
    recentCalls: callsData,
    webhookDeliveries: webhooksData,
    apiKeys: keysData,
  };
}

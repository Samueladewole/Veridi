import { AlertBanner } from "@/components/dashboard/alert-banner";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { EndpointBreakdown } from "@/components/dashboard/endpoint-breakdown";
import { RecentCallsTable } from "@/components/dashboard/recent-calls-table";
import { ApiKeysWidget } from "@/components/dashboard/api-keys-widget";
import { WebhooksWidget } from "@/components/dashboard/webhooks-widget";
import { fetchDashboardStats } from "@/lib/mock-api";

export default async function DashboardPage() {
  const stats = await fetchDashboardStats();

  return (
    <>
      <AlertBanner />
      <KpiCards data={stats.kpiCards} />

      {/* Chart + Breakdown row */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <UsageChart data={stats.chartBars} />
        <EndpointBreakdown data={stats.endpointBreakdowns} />
      </div>

      {/* Recent Calls + Side Widgets row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <RecentCallsTable data={stats.recentCalls} />
        <div className="flex flex-col gap-3.5">
          <ApiKeysWidget data={stats.apiKeys} />
          <WebhooksWidget data={stats.webhookDeliveries} />
        </div>
      </div>
    </>
  );
}

import { AlertBanner } from "@/components/dashboard/alert-banner";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { EndpointBreakdown } from "@/components/dashboard/endpoint-breakdown";
import { RecentCallsTable } from "@/components/dashboard/recent-calls-table";
import { ApiKeysWidget } from "@/components/dashboard/api-keys-widget";
import { WebhooksWidget } from "@/components/dashboard/webhooks-widget";

export default function DashboardPage() {
  return (
    <>
      <AlertBanner />
      <KpiCards />

      {/* Chart + Breakdown row */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <UsageChart />
        <EndpointBreakdown />
      </div>

      {/* Recent Calls + Side Widgets row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <RecentCallsTable />
        <div className="flex flex-col gap-3.5">
          <ApiKeysWidget />
          <WebhooksWidget />
        </div>
      </div>
    </>
  );
}

import { SystemStatus } from "@/components/system-status";
import { KpiGrid } from "@/components/kpi-grid";
import { VerificationQueue } from "@/components/verification-queue";
import { DataSourceHealth } from "@/components/data-source-health";
import { ClientTable } from "@/components/client-table";
import { LiveFeed } from "@/components/live-feed";
import { RevenueChart } from "@/components/revenue-chart";
import { AuditLog } from "@/components/audit-log";

export default function AdminOverviewPage() {
  return (
    <>
      <SystemStatus />
      <KpiGrid />

      {/* Two-column: Queue + Data Sources */}
      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-2">
        <VerificationQueue />
        <DataSourceHealth />
      </div>

      {/* Full-width: Client Accounts */}
      <ClientTable />

      {/* Two-column: Live Feed + Revenue */}
      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-2">
        <LiveFeed />
        <RevenueChart />
      </div>

      {/* Full-width: Audit Log */}
      <AuditLog />
    </>
  );
}

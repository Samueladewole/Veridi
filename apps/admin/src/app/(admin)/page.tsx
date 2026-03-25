import { SystemStatus } from "@/components/system-status";
import { KpiGrid } from "@/components/kpi-grid";
import { VerificationQueue } from "@/components/verification-queue";
import { DataSourceHealth } from "@/components/data-source-health";
import { ClientTable } from "@/components/client-table";
import { LiveFeed } from "@/components/live-feed";
import { RevenueChart } from "@/components/revenue-chart";
import { AuditLog } from "@/components/audit-log";
import {
  fetchKpiData,
  fetchRecentClients,
  fetchQueueItems,
  fetchAuditLog,
  fetchSystemStatus,
  fetchDataSources,
  fetchRevenueData,
} from "@/lib/dashboard-data";

export default async function AdminOverviewPage() {
  const [
    kpiItems,
    clientData,
    queueData,
    auditEntries,
    services,
    dataSources,
    revenueData,
  ] = await Promise.all([
    fetchKpiData(),
    fetchRecentClients(),
    fetchQueueItems(),
    fetchAuditLog(),
    fetchSystemStatus(),
    fetchDataSources(),
    fetchRevenueData(),
  ]);

  return (
    <>
      <SystemStatus services={services} />
      <KpiGrid items={kpiItems} />

      {/* Two-column: Queue + Data Sources */}
      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-2">
        <VerificationQueue
          items={queueData.items}
          pendingCount={queueData.pendingCount}
        />
        <DataSourceHealth sources={dataSources} />
      </div>

      {/* Full-width: Client Accounts */}
      <ClientTable
        clients={clientData.clients}
        activeCount={clientData.activeCount}
        pendingCount={clientData.pendingCount}
      />

      {/* Two-column: Live Feed + Revenue */}
      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-2">
        <LiveFeed />
        <RevenueChart
          monthly={revenueData.monthly}
          sources={revenueData.sources}
          momGrowth={revenueData.momGrowth}
        />
      </div>

      {/* Full-width: Audit Log */}
      <AuditLog entries={auditEntries} />
    </>
  );
}

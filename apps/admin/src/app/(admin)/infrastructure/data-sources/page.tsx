import { DataSourceHealth } from "@/components/data-source-health";
import { fetchDataSources } from "@/lib/dashboard-data";

export default async function DataSourcesPage() {
  const sources = await fetchDataSources();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
          Data Sources
        </h1>
        <p className="mt-1 font-mono text-[11px] text-text2">
          Monitor and configure upstream verification providers. NIMC NVS, NIBSS BVN,
          Smile Identity, FRSC, and payment gateways with real-time health metrics.
        </p>
      </div>
      <DataSourceHealth sources={sources} />
    </div>
  );
}

import { Card, CardHeader } from "@/components/card";
import { getAnalyticsOverview } from "@/lib/mock-api";

export default async function PlatformAnalyticsPage() {
  const analytics = await getAnalyticsOverview();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
          Platform Analytics
        </h1>
        <p className="mt-1 font-mono text-[11px] text-text2">
          Comprehensive platform metrics including verification volumes, client growth
          trends, provider latency distributions, and error rate analysis.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AnalyticsKpi label="Daily Volume" value={analytics.dailyVolume.toLocaleString()} />
        <AnalyticsKpi
          label="Weekly Growth"
          value={analytics.weeklyGrowth}
          valueClass="text-green"
        />
        <AnalyticsKpi label="Avg Latency" value={analytics.avgLatency} />
        <AnalyticsKpi
          label="Top Clients"
          value={String(analytics.topClients.length)}
        />
      </div>

      <Card>
        <CardHeader title="Top Clients by Volume" />
        <div className="flex flex-col gap-2 p-4">
          {analytics.topClients.map((client, idx) => (
            <div key={client.name} className="flex items-center gap-3">
              <span className="w-4 font-mono text-[10px] text-text3">
                {idx + 1}.
              </span>
              <span className="min-w-[140px] text-[11px] text-text1">
                {client.name}
              </span>
              <div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-border">
                <div
                  className="h-full rounded-[3px] bg-amber"
                  style={{
                    width: `${(client.calls / Math.max(...analytics.topClients.map((c) => c.calls))) * 100}%`,
                  }}
                />
              </div>
              <span className="w-[60px] text-right font-mono text-[10px] text-text2">
                {client.calls.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AnalyticsKpi({
  label,
  value,
  valueClass,
}: {
  readonly label: string;
  readonly value: string;
  readonly valueClass?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded border border-border bg-panel p-4">
      <div className="absolute left-0 right-0 top-0 h-px bg-amber/50" />
      <div className="mb-[10px] font-mono text-[9px] uppercase tracking-[0.14em] text-text2">
        {label}
      </div>
      <div
        className={`font-heading text-[22px] font-extrabold leading-none tracking-[-0.02em] ${valueClass ?? "text-text1"}`}
      >
        {value}
      </div>
    </div>
  );
}

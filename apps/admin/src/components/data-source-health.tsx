import { Card, CardHeader, CardHeaderButton } from "@/components/card";

type HealthStatus = "ok" | "warn" | "down";

export interface DataSourceItem {
  readonly name: string;
  readonly description: string;
  readonly status: HealthStatus;
  readonly latency: string;
  readonly uptime: string;
  readonly uptimeStatus: "ok" | "warn";
}

interface DataSourceHealthProps {
  readonly sources: readonly DataSourceItem[];
}

const DOT_STYLES: Record<HealthStatus, string> = {
  ok: "bg-green shadow-[0_0_5px_#10B981]",
  warn: "bg-amber shadow-[0_0_5px_#F59E0B] animate-blink-slow",
  down: "bg-red shadow-[0_0_5px_#EF4444] animate-blink",
};

const UPTIME_STYLES: Record<string, string> = {
  ok: "text-green",
  warn: "text-amber",
};

export function DataSourceHealth({ sources }: DataSourceHealthProps) {
  const degradedCount = sources.filter((s) => s.status !== "ok").length;

  return (
    <Card>
      <CardHeader
        title="Data Source Health"
        badges={
          degradedCount > 0
            ? [{ label: `${degradedCount} Degraded`, variant: "amber" as const }]
            : [{ label: "All Healthy", variant: "green" as const }]
        }
        actions={<CardHeaderButton>Manage</CardHeaderButton>}
      />
      <div className="flex flex-col gap-[6px] p-4">
        {sources.map((source) => (
          <div
            key={source.name}
            className="flex items-center gap-[10px] rounded-[3px] border border-border bg-panel-2 px-3 py-[9px]"
          >
            <div
              className={`h-2 w-2 flex-shrink-0 rounded-full ${DOT_STYLES[source.status]}`}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-medium text-text1">
                {source.name}
              </div>
              <div className="font-mono text-[9px] text-text2">
                {source.description}
              </div>
            </div>
            <div className="min-w-[52px] text-right font-mono text-[10px] text-text3">
              {source.latency}
            </div>
            <div
              className={`min-w-[44px] text-right font-mono text-[9px] ${UPTIME_STYLES[source.uptimeStatus]}`}
            >
              {source.uptime}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

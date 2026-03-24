import { Card, CardHeader, CardHeaderButton } from "@/components/card";

type HealthStatus = "ok" | "warn" | "down";

interface DataSource {
  readonly name: string;
  readonly description: string;
  readonly status: HealthStatus;
  readonly latency: string;
  readonly uptime: string;
  readonly uptimeStatus: "ok" | "warn";
}

const DATA_SOURCES: readonly DataSource[] = [
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

const DOT_STYLES: Record<HealthStatus, string> = {
  ok: "bg-green shadow-[0_0_5px_#10B981]",
  warn: "bg-amber shadow-[0_0_5px_#F59E0B] animate-blink-slow",
  down: "bg-red shadow-[0_0_5px_#EF4444] animate-blink",
};

const UPTIME_STYLES: Record<string, string> = {
  ok: "text-green",
  warn: "text-amber",
};

export function DataSourceHealth() {
  return (
    <Card>
      <CardHeader
        title="Data Source Health"
        badges={[{ label: "1 Degraded", variant: "amber" }]}
        actions={<CardHeaderButton>Manage</CardHeaderButton>}
      />
      <div className="flex flex-col gap-[6px] p-4">
        {DATA_SOURCES.map((source) => (
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

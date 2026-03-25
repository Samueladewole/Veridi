type StatusLevel = "ok" | "warn" | "down";

export interface SystemService {
  readonly name: string;
  readonly status: StatusLevel;
}

interface SystemStatusProps {
  readonly services: readonly SystemService[];
}

const DOT_STYLES: Record<StatusLevel, string> = {
  ok: "bg-green shadow-[0_0_5px_#10B981]",
  warn: "bg-amber shadow-[0_0_5px_#F59E0B] animate-blink-slow",
  down: "bg-red shadow-[0_0_5px_#EF4444] animate-blink",
};

function getOverallStatus(
  services: readonly SystemService[]
): { label: string; color: string } {
  const hasDown = services.some((s) => s.status === "down");
  if (hasDown) return { label: "System degraded", color: "text-red" };
  return { label: "All systems operational", color: "text-green" };
}

export function SystemStatus({ services }: SystemStatusProps) {
  const overall = getOverallStatus(services);

  return (
    <div className="flex flex-wrap items-center gap-5 rounded border border-border-2 bg-panel px-4 py-[10px]">
      <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.16em] text-text3">
        System
      </span>

      {services.map((service, idx) => (
        <div key={service.name} className="flex items-center gap-2">
          {idx > 0 && (
            <div className="-ml-3 mr-0 h-4 w-px flex-shrink-0 bg-border-2" />
          )}
          <div
            className={`h-[7px] w-[7px] flex-shrink-0 rounded-full ${DOT_STYLES[service.status]}`}
          />
          <span className="font-mono text-[11px] text-text2">
            {service.name}
          </span>
        </div>
      ))}

      <span
        className={`ml-auto flex items-center gap-[6px] font-mono text-[10px] tracking-[0.1em] ${overall.color}`}
      >
        {"\u25CF"} {overall.label}
      </span>
    </div>
  );
}

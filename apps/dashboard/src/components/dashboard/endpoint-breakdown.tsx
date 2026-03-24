import { endpointBreakdowns } from "@/lib/mock-data";
import { PlanMeter } from "./plan-meter";

function BreakdownItem({
  name,
  count,
  percentage,
  color,
}: {
  name: string;
  count: number;
  percentage: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="min-w-[120px] truncate font-mono text-[11px] text-text-2">
        {name}
      </div>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
      <div className="min-w-[40px] text-right font-mono text-[10px] text-text-3">
        {count.toLocaleString()}
      </div>
    </div>
  );
}

export function EndpointBreakdown() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <div className="text-[13px] font-bold tracking-tight text-text-1">
            Endpoint Breakdown
          </div>
          <div className="font-mono text-[10px] text-text-2">
            Today&apos;s call distribution
          </div>
        </div>
      </div>

      {/* Breakdown list */}
      <div className="flex flex-col gap-2.5 px-5 py-4">
        {endpointBreakdowns.map((item) => (
          <BreakdownItem key={item.name} {...item} />
        ))}
      </div>

      {/* Plan usage */}
      <PlanMeter />
    </div>
  );
}

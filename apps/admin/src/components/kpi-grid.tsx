type KpiColor = "amber" | "red" | "green" | "blue" | "purple";
type TrendDirection = "up" | "down" | "same";

export interface KpiItem {
  readonly label: string;
  readonly value: string;
  readonly sub: string;
  readonly trend: string;
  readonly trendDir: TrendDirection;
  readonly color?: KpiColor;
  readonly valueColor?: string;
}

interface KpiGridProps {
  readonly items: readonly KpiItem[];
}

const COLOR_LINES: Record<string, string> = {
  amber: "bg-amber/50",
  red: "bg-red/50",
  green: "bg-green/50",
  blue: "bg-blue/50",
  purple: "bg-purple/50",
};

const TREND_STYLES: Record<TrendDirection, string> = {
  up: "text-green",
  down: "text-red",
  same: "text-text3",
};

export function KpiGrid({ items }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-5">
      {items.map((kpi) => (
        <div
          key={kpi.label}
          className="relative overflow-hidden rounded border border-border bg-panel p-4"
        >
          {/* Top color line */}
          <div
            className={`absolute left-0 right-0 top-0 h-px ${COLOR_LINES[kpi.color ?? "amber"]}`}
          />

          <div className="mb-[10px] font-mono text-[9px] uppercase tracking-[0.14em] text-text2">
            {kpi.label}
          </div>
          <div
            className={`mb-[6px] font-heading text-[26px] font-extrabold leading-none tracking-[-0.02em] ${kpi.valueColor ?? "text-text1"}`}
          >
            {kpi.value}
          </div>
          <div className="font-mono text-[9px] text-text3">{kpi.sub}</div>
          <div
            className={`mt-1 font-mono text-[9px] ${TREND_STYLES[kpi.trendDir]}`}
          >
            {kpi.trend}
          </div>
        </div>
      ))}
    </div>
  );
}

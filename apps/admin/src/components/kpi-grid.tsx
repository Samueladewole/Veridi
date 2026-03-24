type KpiColor = "amber" | "red" | "green" | "blue" | "purple";
type TrendDirection = "up" | "down" | "same";

interface KpiItem {
  readonly label: string;
  readonly value: string;
  readonly sub: string;
  readonly trend: string;
  readonly trendDir: TrendDirection;
  readonly color?: KpiColor;
  readonly valueColor?: string;
}

const KPI_DATA: readonly KpiItem[] = [
  {
    label: "Total Clients",
    value: "47",
    sub: "Active accounts",
    trend: "+4 this month",
    trendDir: "up",
  },
  {
    label: "Pending Queue",
    value: "7",
    sub: "Need review",
    trend: "\u2191 3 from yesterday",
    trendDir: "down",
    color: "red",
    valueColor: "text-red",
  },
  {
    label: "API Calls Today",
    value: "84.2k",
    sub: "All clients",
    trend: "\u2191 12% vs yesterday",
    trendDir: "up",
  },
  {
    label: "MRR",
    value: "\u20A64.2M",
    sub: "Monthly recurring",
    trend: "\u2191 \u20A6620k MoM",
    trendDir: "up",
    color: "green",
    valueColor: "text-green",
  },
  {
    label: "Error Rate",
    value: "0.8%",
    sub: "Last 24 hours",
    trend: "\u2192 Within SLA",
    trendDir: "same",
    color: "purple",
    valueColor: "text-purple",
  },
];

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

export function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-5">
      {KPI_DATA.map((kpi) => (
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

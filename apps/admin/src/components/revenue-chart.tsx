"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader } from "@/components/card";

interface MonthData {
  readonly month: string;
  readonly value: number;
}

const REVENUE_DATA: readonly MonthData[] = [
  { month: "Oct", value: 1200 },
  { month: "Nov", value: 1580 },
  { month: "Dec", value: 2100 },
  { month: "Jan", value: 2800 },
  { month: "Feb", value: 3600 },
  { month: "Mar", value: 4200 },
];

interface TooltipPayloadItem {
  readonly value: number;
  readonly payload: MonthData;
}

interface CustomTooltipProps {
  readonly active?: boolean;
  readonly payload?: readonly TooltipPayloadItem[];
  readonly label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  if (!item) return null;

  const value = item.value;
  const formatted =
    value >= 1000 ? `\u20A6${(value / 1000).toFixed(1)}M` : `\u20A6${value}k`;

  return (
    <div className="rounded border border-border bg-deep px-3 py-2 shadow-lg">
      <p className="font-mono text-[10px] text-amber">{formatted}</p>
    </div>
  );
}

interface RevenueSource {
  readonly label: string;
  readonly percentage: number;
  readonly color: string;
}

const REVENUE_SOURCES: readonly RevenueSource[] = [
  { label: "Subscriptions", percentage: 62, color: "bg-amber" },
  { label: "Pay-per-call", percentage: 28, color: "bg-blue" },
  { label: "Background", percentage: 10, color: "bg-purple" },
];

export function RevenueChart() {
  return (
    <Card>
      <CardHeader
        title="Monthly Revenue"
        actions={
          <span className="font-mono text-[10px] text-green">
            &uarr; +17.3% MoM
          </span>
        }
      />

      {/* Recharts Bar Chart */}
      <div className="px-4 py-4">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={[...REVENUE_DATA]}
            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#2E4055", fontSize: 9, fontFamily: "monospace" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#2E4055", fontSize: 9, fontFamily: "monospace" }}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}M` : `${v}k`
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(245,158,11,0.05)" }}
            />
            <defs>
              <linearGradient id="amberBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B07008" />
              </linearGradient>
            </defs>
            <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={40}>
              {REVENUE_DATA.map((entry) => (
                <Cell key={entry.month} fill="url(#amberBarGrad)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by source */}
      <div className="flex flex-col gap-2 px-4 pb-4">
        <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-text3">
          Revenue by source
        </div>
        {REVENUE_SOURCES.map((source) => (
          <div key={source.label} className="flex items-center gap-[10px]">
            <div className="min-w-[80px] font-mono text-[10px] text-text2">
              {source.label}
            </div>
            <div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-border">
              <div
                className={`h-full rounded-[3px] ${source.color}`}
                style={{ width: `${source.percentage}%` }}
              />
            </div>
            <div className="w-[30px] text-right font-mono text-[9px] text-text3">
              {source.percentage}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

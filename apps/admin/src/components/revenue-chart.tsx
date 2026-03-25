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

export interface MonthData {
  readonly month: string;
  readonly value: number;
}

export interface RevenueSourceData {
  readonly label: string;
  readonly percentage: number;
  readonly color: string;
}

interface RevenueChartProps {
  readonly monthly: readonly MonthData[];
  readonly sources: readonly RevenueSourceData[];
  readonly momGrowth: string;
}

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

export function RevenueChart({ monthly, sources, momGrowth }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader
        title="Monthly Revenue"
        actions={
          <span className="font-mono text-[10px] text-green">
            &uarr; {momGrowth} MoM
          </span>
        }
      />

      {/* Recharts Bar Chart */}
      <div className="px-4 py-4">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={[...monthly]}
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
              {monthly.map((entry) => (
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
        {sources.map((source) => (
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

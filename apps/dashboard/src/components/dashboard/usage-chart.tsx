"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ChartBar } from "@/lib/mock-data";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function ChartTooltipContent({ active, payload, label }: ChartTooltipProps) {
  const firstPayload = payload?.[0];
  if (!active || !firstPayload) return null;

  return (
    <div className="rounded border border-border-2 bg-deep px-3 py-2 shadow-lg">
      <p className="font-mono text-[10px] text-text-3">{label}:00</p>
      <p className="font-mono text-xs font-semibold text-teal">
        {firstPayload.value} calls
      </p>
    </div>
  );
}

function PeriodToggle({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (tab: string) => void;
}) {
  const tabs = ["Hourly", "Daily", "Weekly"];

  return (
    <div className="flex gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`rounded-[3px] px-3 py-[5px] font-mono text-[10px] tracking-[0.08em] transition-all ${
            active === tab
              ? "border border-teal/20 bg-teal-pale text-teal"
              : "border border-transparent text-text-3 hover:text-text-2"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function UsageChart({ data }: { data: ChartBar[] }) {
  const [activeTab, setActiveTab] = useState("Hourly");

  const formattedData = data.map((bar) => ({
    ...bar,
    label: `${bar.hour}h`,
  }));

  return (
    <div className="overflow-hidden rounded-md border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <div className="text-[13px] font-bold tracking-tight text-text-1">
            API Call Volume
          </div>
          <div className="font-mono text-[10px] text-text-2">
            Verifications per hour — today
          </div>
        </div>
        <PeriodToggle active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="px-5 pb-4 pt-5">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={formattedData}
            margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4B4" stopOpacity={1} />
                <stop offset="100%" stopColor="#009E87" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1A2840"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#334766", fontSize: 9, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#334766", fontSize: 9, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
              ticks={[0, 100, 200, 300]}
            />
            <Tooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "rgba(0,212,180,0.04)" }}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={28}>
              {formattedData.map((entry) => (
                <Cell key={entry.hour} fill="url(#tealGradient)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { chartBars } from "@/lib/mock-data";

const maxValue = Math.max(...chartBars.map((b) => b.value));

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

const gridValues = [300, 200, 100, 0];

export function ApiChart() {
  const [activeTab, setActiveTab] = useState("Hourly");

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

      <div className="p-5">
        <div className="relative flex h-40 items-end gap-1.5 pt-5">
          {/* Grid lines */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-5 flex flex-col justify-between">
            {gridValues.map((val) => (
              <div
                key={val}
                className="flex w-full items-center border-t border-dashed border-border"
              >
                <span className="ml-1 whitespace-nowrap font-mono text-[8px] text-text-3">
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Bars */}
          {chartBars.map((bar) => {
            const pct = Math.round((bar.value / maxValue) * 100);
            return (
              <div
                key={bar.hour}
                className="group flex flex-1 flex-col items-center gap-1"
              >
                <div className="relative w-full">
                  <div className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] text-text-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {bar.value}
                  </div>
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-teal-dim to-teal transition-all group-hover:brightness-125"
                    style={{ height: `${pct}%`, minHeight: "4px" }}
                  />
                </div>
                <span className="whitespace-nowrap font-mono text-[9px] text-text-3">
                  {bar.hour}h
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

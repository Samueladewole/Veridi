"use client";

import { useState } from "react";

interface AdminTopBarProps {
  readonly breadcrumb?: string;
  readonly title: string;
}

export function AdminTopBar({ breadcrumb = "Admin", title }: AdminTopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-[52px] flex-shrink-0 items-center gap-3 border-b border-border bg-deep px-6">
      {/* Breadcrumb */}
      <div className="flex flex-1 items-center gap-2">
        <span className="text-[12px] text-text2">{breadcrumb}</span>
        <span className="text-[10px] text-text3">&rsaquo;</span>
        <span className="text-[13px] font-bold text-text1">{title}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden items-center gap-[6px] rounded-[3px] border border-border-2 bg-panel px-3 py-[6px] sm:flex">
          <span className="text-[12px] text-text3">&#x2315;</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients, references, logs..."
            className="w-[180px] bg-transparent font-mono text-[11px] text-text1 outline-none placeholder:text-text3"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-[3px] border border-border-2 bg-panel text-[13px] text-text2 transition-colors hover:border-amber hover:text-amber">
          🔔
          <span className="absolute right-[6px] top-[6px] h-[6px] w-[6px] rounded-full border border-deep bg-red" />
        </button>

        {/* Export */}
        <button className="hidden rounded-[3px] border border-border-2 bg-panel px-[14px] py-[6px] font-mono text-[10px] tracking-[0.08em] text-text2 transition-colors hover:border-amber hover:text-amber md:block">
          Export Report
        </button>

        {/* Approve batch */}
        <button className="rounded-[3px] bg-amber px-[14px] py-[6px] font-mono text-[10px] font-semibold tracking-[0.08em] text-void transition-colors hover:bg-[#FCD34D]">
          + Approve Batch
        </button>
      </div>
    </div>
  );
}

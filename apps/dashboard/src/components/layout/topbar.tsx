"use client";

import { useState } from "react";
import { SearchIcon, BellIcon, PlusIcon } from "@/components/icons";
import { usePageTitleValue } from "./page-title-context";

function SearchBar() {
  return (
    <div className="hidden items-center gap-2 rounded border border-border-2 bg-panel px-3.5 py-[7px] transition-colors focus-within:border-teal sm:flex sm:min-w-[220px]">
      <SearchIcon size={13} className="flex-shrink-0 text-text-3" />
      <input
        type="text"
        placeholder="Search verifications, references..."
        className="w-full border-none bg-transparent font-mono text-xs text-text-1 outline-none placeholder:text-text-3"
      />
    </div>
  );
}

function TabSwitcher() {
  const [active, setActive] = useState("Today");
  const tabs = ["Today", "7d", "30d"];

  return (
    <div className="flex gap-0.5 rounded-[5px] border border-border bg-panel p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`rounded-[3px] px-3.5 py-[5px] font-mono text-[10px] tracking-[0.08em] transition-all ${
            active === tab
              ? "border border-border-2 bg-panel-3 text-teal"
              : "border border-transparent text-text-3 hover:text-text-2"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function NotificationButton() {
  return (
    <button
      className="relative flex h-9 w-9 items-center justify-center rounded border border-border-2 bg-panel transition-colors hover:border-teal"
      aria-label="Notifications"
    >
      <BellIcon size={14} className="text-text-2" />
      <div className="absolute right-[7px] top-[7px] h-[7px] w-[7px] rounded-full border-[1.5px] border-deep bg-teal" />
    </button>
  );
}

export function TopBar() {
  const title = usePageTitleValue();

  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-border bg-deep px-4 sm:px-7">
      {/* Spacer for mobile menu button */}
      <div className="w-9 lg:hidden" />
      <h1 className="flex-1 text-[15px] font-bold tracking-tight text-text-1">
        {title}
      </h1>
      <SearchBar />
      <div className="flex items-center gap-2.5">
        <TabSwitcher />
        <NotificationButton />
        <button className="flex items-center gap-1.5 rounded bg-teal px-3.5 py-[7px] font-mono text-[11px] font-semibold tracking-[0.06em] text-void transition-colors hover:bg-[#00FFDD]">
          <PlusIcon size={12} />
          New Check
        </button>
      </div>
    </header>
  );
}

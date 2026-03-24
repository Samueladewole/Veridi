"use client";

import { useState } from "react";
import { Card, CardHeader, CardHeaderButton } from "@/components/card";
import { ClientRow } from "@/components/client-row";
import {
  CLIENTS,
  FILTER_TABS,
  type FilterStatus,
} from "@/components/clients-data";

const TABLE_HEADERS = [
  "Client",
  "Email",
  "Plan",
  "Status",
  "Calls (30d)",
  "Total Calls",
  "MRR",
  "API Key",
  "Joined",
  "Last Active",
  "Actions",
] as const;

export function ClientsTableFull() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = CLIENTS.filter((client) => {
    const matchesStatus = filter === "all" || client.status === filter;
    const lowerSearch = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      client.name.toLowerCase().includes(lowerSearch) ||
      client.email.toLowerCase().includes(lowerSearch);
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: CLIENTS.length,
    active: CLIENTS.filter((c) => c.status === "active").length,
    pending: CLIENTS.filter((c) => c.status === "pending").length,
    suspended: CLIENTS.filter((c) => c.status === "suspended").length,
  };

  return (
    <Card>
      <CardHeader
        title="Client Accounts"
        badges={[
          { label: `${counts.active} Active`, variant: "green" },
          { label: `${counts.pending} Pending`, variant: "amber" },
          { label: `${counts.suspended} Suspended`, variant: "red" },
        ]}
        actions={<CardHeaderButton>Export</CardHeaderButton>}
      />

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex gap-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`rounded-[3px] px-3 py-[5px] font-mono text-[10px] tracking-[0.08em] transition-colors ${
                filter === tab.value
                  ? "border border-amber/20 bg-amber/10 text-amber"
                  : "border border-border-2 text-text2 hover:border-amber/30 hover:text-text1"
              }`}
            >
              {tab.label} ({counts[tab.value]})
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-[6px] rounded-[3px] border border-border-2 bg-panel px-3 py-[6px]">
          <span className="text-[12px] text-text3">&#x2315;</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-[200px] bg-transparent font-mono text-[11px] text-text1 outline-none placeholder:text-text3"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  className="whitespace-nowrap border-b border-border px-[14px] py-[9px] text-left font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-text3"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-[14px] py-8 text-center font-mono text-[11px] text-text3"
                >
                  No clients match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((client) => (
                <ClientRow key={client.id} client={client} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

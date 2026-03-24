"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
  readonly badge?: {
    readonly value: string;
    readonly variant: "red" | "amber" | "green" | "blue";
  };
}

interface NavSection {
  readonly title: string;
  readonly items: readonly NavItem[];
}

const NAV_SECTIONS: readonly NavSection[] = [
  {
    title: "Operations",
    items: [
      { label: "Overview", href: "/", icon: "⬡" },
      {
        label: "Live Feed",
        href: "/live",
        icon: "⚡",
        badge: { value: "●", variant: "green" },
      },
      {
        label: "Verification Queue",
        href: "/queue",
        icon: "🗂",
        badge: { value: "7", variant: "red" },
      },
      {
        label: "Disputes",
        href: "/disputes",
        icon: "⚠",
        badge: { value: "3", variant: "amber" },
      },
    ],
  },
  {
    title: "Clients",
    items: [
      { label: "All Clients", href: "/clients", icon: "🏢" },
      {
        label: "Pending Approval",
        href: "/clients/pending",
        icon: "✓",
        badge: { value: "4", variant: "amber" },
      },
      { label: "Billing & Revenue", href: "/billing", icon: "💳" },
    ],
  },
  {
    title: "Infrastructure",
    items: [
      { label: "Data Sources", href: "/infrastructure/data-sources", icon: "🔌" },
      { label: "Webhook Monitor", href: "/infrastructure/webhooks", icon: "🔔" },
      { label: "Platform Analytics", href: "/analytics", icon: "📊" },
    ],
  },
  {
    title: "Security",
    items: [
      { label: "Audit Log", href: "/security/audit-log", icon: "📜" },
      {
        label: "Flagged Calls",
        href: "/security/flagged",
        icon: "🚩",
        badge: { value: "12", variant: "red" },
      },
      { label: "Configuration", href: "/config", icon: "⚙" },
    ],
  },
] as const;

const BADGE_STYLES: Record<string, string> = {
  red: "bg-red-pale text-red border border-red/20",
  amber: "bg-amber-pale text-amber border border-amber/20",
  green: "bg-green-pale text-green border border-green/20",
  blue: "bg-blue-pale text-blue border border-blue/20",
};

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="fixed left-3 top-3 z-50 flex h-8 w-8 items-center justify-center rounded bg-deep border border-border text-text2 lg:hidden"
        aria-label="Toggle sidebar"
      >
        {collapsed ? "☰" : "✕"}
      </button>

      <aside
        className={`
          fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-shrink-0
          flex-col border-r border-border bg-deep
          transition-transform duration-200
          lg:relative lg:translate-x-0
          ${collapsed ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-5">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[3px] bg-amber text-[13px] font-extrabold text-void">
            V
          </div>
          <span className="text-[17px] font-extrabold tracking-tight">
            Veridi<span className="text-amber">.</span>
          </span>
          <span className="ml-auto rounded-[2px] border border-amber/20 bg-amber/[0.12] px-[7px] py-[2px] font-mono text-[8px] uppercase tracking-[0.14em] text-amber">
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-[1px] overflow-y-auto px-[6px] py-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="px-2 pb-1 pt-[10px] font-mono text-[8px] uppercase tracking-[0.24em] text-text3">
                {section.title}
              </div>
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) setCollapsed(true);
                    }}
                    className={`
                      relative flex items-center gap-2 rounded-[3px] px-2 py-2
                      text-[12px] font-medium transition-colors
                      ${active ? "bg-panel-2 text-amber" : "text-text2 hover:bg-panel hover:text-text1"}
                    `}
                  >
                    {active && (
                      <span className="absolute bottom-1 left-0 top-1 w-[2px] rounded-r bg-amber" />
                    )}
                    <span className="w-[18px] flex-shrink-0 text-center text-[13px]">
                      {item.icon}
                    </span>
                    {item.label}
                    {item.badge && (
                      <span
                        className={`ml-auto rounded-[2px] px-[6px] py-[1px] font-mono text-[9px] font-semibold ${BADGE_STYLES[item.badge.variant]}`}
                      >
                        {item.badge.value}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer — Admin user */}
        <div className="border-t border-border px-[6px] py-[10px]">
          <div className="flex items-center gap-2 rounded-[3px] px-2 py-2 transition-colors hover:bg-panel">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-amber/30 bg-gradient-to-br from-[#2A1A04] to-[#3D2A06] text-[10px] font-bold text-amber">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-text1">
                Samuel A.
              </div>
              <div className="font-mono text-[9px] tracking-[0.06em] text-amber">
                Super Admin
              </div>
            </div>
            <div className="h-[7px] w-[7px] rounded-full bg-green shadow-[0_0_5px_#10B981]" />
          </div>
        </div>
      </aside>
    </>
  );
}

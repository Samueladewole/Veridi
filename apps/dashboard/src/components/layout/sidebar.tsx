"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Icon, ChevronDownIcon, SettingsIcon, XIcon, MenuIcon } from "@/components/icons";
import { sidebarSections } from "@/lib/mock-data";

function SidebarLogo() {
  return (
    <div className="flex items-center gap-2.5 border-b border-border px-5 pb-5 pt-6">
      <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[3px] bg-teal font-heading text-sm font-extrabold text-void">
        V
      </div>
      <span className="font-heading text-lg font-extrabold tracking-tight text-text-1">
        Veridi<span className="text-teal">.</span>
      </span>
    </div>
  );
}

function OrgSwitcher() {
  return (
    <div className="mx-3 mt-3 flex items-center gap-2.5 rounded border border-border-2 bg-panel p-3">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[3px] bg-gradient-to-br from-teal-dim to-[#006655] text-[11px] font-bold text-void">
        TN
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold text-text-1">Tendr.ng</div>
        <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-teal">
          Growth Plan
        </div>
      </div>
      <ChevronDownIcon size={10} className="flex-shrink-0 text-text-3" />
    </div>
  );
}

function NavSection({ title, items, currentPath }: {
  title: string;
  items: typeof sidebarSections[number]["items"];
  currentPath: string;
}) {
  return (
    <>
      <div className="px-2.5 pb-1.5 pt-3 font-mono text-[8px] uppercase tracking-[0.24em] text-text-3">
        {title}
      </div>
      {items.map((item) => {
        const isActive = currentPath === item.href;
        return (
          <a
            key={item.label}
            href={item.href}
            className={`relative flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium transition-colors ${
              isActive
                ? "bg-panel-2 text-teal"
                : "text-text-2 hover:bg-panel hover:text-text-1"
            }`}
          >
            {isActive && (
              <div className="absolute bottom-1 left-0 top-1 w-0.5 rounded-r bg-teal" />
            )}
            <Icon name={item.icon} size={15} className="w-5 flex-shrink-0 text-center" />
            <span className="flex-1">{item.label}</span>
            {item.external && (
              <span className="text-[10px] text-text-3">&#x2197;</span>
            )}
            {item.badge !== undefined && (
              <span
                className={`ml-auto rounded-sm px-1.5 py-px font-mono text-[9px] font-semibold ${
                  item.badgeType === "warn"
                    ? "bg-gold text-void"
                    : "bg-teal text-void"
                }`}
              >
                {item.badge}
              </span>
            )}
          </a>
        );
      })}
    </>
  );
}

function UserFooter() {
  return (
    <div className="flex items-center gap-2.5 border-t border-border p-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border-2 bg-gradient-to-br from-[#1A3A5C] to-[#0F2A44] text-xs font-bold text-teal">
        SA
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold text-text-1">Samuel A.</div>
        <div className="font-mono text-[9px] text-text-3">Owner</div>
      </div>
      <button className="text-text-3 transition-colors hover:text-teal" aria-label="Settings">
        <SettingsIcon size={14} />
      </button>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPath = usePathname();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded border border-border-2 bg-deep text-text-2 lg:hidden"
        aria-label="Open sidebar"
      >
        <MenuIcon size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-60 flex-shrink-0 flex-col overflow-hidden border-r border-border bg-deep transition-transform lg:relative lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Accent border glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-teal-dim to-transparent opacity-30" />

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 text-text-3 transition-colors hover:text-text-1 lg:hidden"
          aria-label="Close sidebar"
        >
          <XIcon size={16} />
        </button>

        <SidebarLogo />
        <OrgSwitcher />

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-4">
          {sidebarSections.map((section) => (
            <NavSection
              key={section.title}
              title={section.title}
              items={section.items}
              currentPath={currentPath}
            />
          ))}
        </nav>

        <UserFooter />
      </aside>
    </>
  );
}

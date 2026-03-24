"use client";

import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import { PageTitleProvider } from "./page-title-context";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <PageTitleProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-7">
            {children}
          </div>
        </main>
      </div>
    </PageTitleProvider>
  );
}

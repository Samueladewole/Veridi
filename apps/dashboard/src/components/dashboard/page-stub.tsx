"use client";

import { usePageTitle } from "@/components/layout/page-title-context";
import { Icon } from "@/components/icons";

interface PageStubProps {
  title: string;
  icon: string;
  description: string;
}

export function PageStub({ title, icon, description }: PageStubProps) {
  usePageTitle(title);

  return (
    <div className="flex h-full flex-col items-center justify-center py-20">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-border-2 bg-panel-2">
        <Icon name={icon} size={28} className="text-text-3" />
      </div>
      <h2 className="mb-2 font-heading text-xl font-bold text-text-1">
        {title}
      </h2>
      <p className="mb-6 max-w-sm text-center font-mono text-xs text-text-3">
        {description}
      </p>
      <div className="flex items-center gap-2 rounded-md border border-border-2 bg-panel px-4 py-2.5">
        <div className="h-2 w-2 animate-pulse rounded-full bg-teal" />
        <span className="font-mono text-[11px] text-text-2">
          Coming soon
        </span>
      </div>
    </div>
  );
}

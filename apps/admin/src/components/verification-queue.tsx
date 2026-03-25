"use client";

import { Card, CardHeader, CardHeaderButton } from "@/components/card";

export interface QueueItem {
  readonly icon: string;
  readonly iconVariant: "amber" | "red" | "blue";
  readonly urgency: "urgent" | "review";
  readonly title: string;
  readonly meta: string;
  readonly time: string;
  readonly actions: readonly ("approve" | "reject" | "view")[];
}

interface VerificationQueueProps {
  readonly items: readonly QueueItem[];
  readonly pendingCount: number;
}

const ICON_VARIANT_STYLES: Record<string, string> = {
  amber: "bg-amber-pale border border-amber/15",
  red: "bg-red-pale border border-red/15",
  blue: "bg-blue-pale border border-blue/15",
};

const URGENCY_BORDER: Record<string, string> = {
  urgent: "border-l-2 border-l-red",
  review: "border-l-2 border-l-amber",
};

function ActionButton({
  action,
}: {
  readonly action: "approve" | "reject" | "view";
}) {
  const styles: Record<string, string> = {
    approve:
      "bg-green-pale text-green border border-green/20 hover:bg-green hover:text-void",
    reject:
      "bg-red-pale text-red border border-red/20 hover:bg-red hover:text-void",
    view: "bg-transparent text-text2 border border-border-2 hover:border-amber hover:text-amber",
  };

  const labels: Record<string, string> = {
    approve: "\u2713 Approve",
    reject: "\u2715 Reject",
    view: "View",
  };

  return (
    <button
      className={`rounded-[2px] px-[10px] py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] transition-colors ${styles[action]}`}
    >
      {labels[action]}
    </button>
  );
}

export function VerificationQueue({ items, pendingCount }: VerificationQueueProps) {
  return (
    <Card>
      <CardHeader
        title="Verification Queue"
        badges={[{ label: `${pendingCount} Pending`, variant: "red" }]}
        actions={<CardHeaderButton>View All</CardHeaderButton>}
      />
      <div className="max-h-[280px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center font-mono text-[11px] text-text3">
            No items in the queue.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.title}
              className={`flex items-start gap-3 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-white/[0.02] ${URGENCY_BORDER[item.urgency]}`}
            >
              {/* Icon */}
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[3px] text-[14px] ${ICON_VARIANT_STYLES[item.iconVariant]}`}
              >
                {item.icon}
              </div>

              {/* Body */}
              <div className="min-w-0 flex-1">
                <div className="mb-[3px] text-[12px] font-semibold text-text1">
                  {item.title}
                </div>
                <div className="flex flex-wrap gap-[10px] font-mono text-[10px] text-text2">
                  <span>{item.meta}</span>
                </div>
              </div>

              {/* Time */}
              <span className="mt-[2px] flex-shrink-0 font-mono text-[9px] text-text3">
                {item.time}
              </span>

              {/* Actions */}
              <div className="flex flex-shrink-0 items-start gap-[6px]">
                {item.actions.map((action) => (
                  <ActionButton key={action} action={action} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

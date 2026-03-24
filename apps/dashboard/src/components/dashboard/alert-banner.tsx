"use client";

import { useState } from "react";
import { AlertTriangleIcon, XIcon } from "@/components/icons";

export function AlertBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded-[5px] border border-gold/20 bg-gold-pale px-4 py-2.5 text-gold">
      <AlertTriangleIcon size={14} className="flex-shrink-0" />
      <span className="flex-1 font-mono text-[11px]">
        2 background checks require manual review — caregiver employment records
        flagged for inconsistency
      </span>
      <button
        onClick={() => setVisible(false)}
        className="opacity-60 transition-opacity hover:opacity-100"
        aria-label="Dismiss alert"
      >
        <XIcon size={14} />
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardHeader, CardHeaderButton } from "@/components/card";

type VerificationType = "NIN" | "BVN" | "FACE" | "BG";
type FeedStatus = "ok" | "fail" | "pend";

interface FeedItem {
  readonly id: string;
  readonly time: string;
  readonly type: VerificationType;
  readonly client: string;
  readonly status: FeedStatus;
  readonly statusLabel: string;
  readonly latency: string;
}

const TYPE_STYLES: Record<VerificationType, string> = {
  NIN: "bg-teal/10 text-teal border border-teal/15",
  BVN: "bg-blue-pale text-blue border border-blue/15",
  FACE: "bg-amber-pale text-amber border border-amber/15",
  BG: "bg-purple-pale text-purple border border-purple/15",
};

const STATUS_STYLES: Record<FeedStatus, string> = {
  ok: "text-green",
  fail: "text-red",
  pend: "text-amber",
};

const STATUS_LABELS: Record<FeedStatus, string> = {
  ok: "\u2713 Verified",
  fail: "\u2717 Failed",
  pend: "\u23F3 Pending",
};

const TYPES: readonly VerificationType[] = ["NIN", "BVN", "FACE", "BG"];
const CLIENTS = [
  "Tendr.ng",
  "MedStaff NG",
  "Logistics247",
  "TrustPay Africa",
  "Kareful App",
] as const;
const STATUSES: readonly FeedStatus[] = ["ok", "ok", "ok", "fail", "pend"];

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function generateFeedItem(): FeedItem {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const status = randomItem(STATUSES);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: `${hours}:${minutes}:${seconds}`,
    type: randomItem(TYPES),
    client: randomItem(CLIENTS),
    status,
    statusLabel: STATUS_LABELS[status],
    latency: `${200 + Math.floor(Math.random() * 900)}ms`,
  };
}

const MAX_ITEMS = 20;

export function LiveFeed() {
  const [items, setItems] = useState<readonly FeedItem[]>([]);
  const [paused, setPaused] = useState(false);
  const initializedRef = useRef(false);

  const addItem = useCallback(() => {
    setItems((prev) => {
      const next = [generateFeedItem(), ...prev];
      return next.slice(0, MAX_ITEMS);
    });
  }, []);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const initial = Array.from({ length: 12 }, () => generateFeedItem());
    setItems(initial);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(addItem, 1800);
    return () => clearInterval(interval);
  }, [paused, addItem]);

  return (
    <Card>
      <CardHeader
        title="Live API Feed"
        badges={[{ label: "\u25CF Live", variant: "green" }]}
        actions={
          <CardHeaderButton onClick={() => setPaused((p) => !p)}>
            {paused ? "Resume" : "Pause"}
          </CardHeaderButton>
        }
      />
      <div className="max-h-[220px] overflow-y-auto py-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex animate-feed-in items-center gap-[10px] px-[14px] py-[7px] transition-colors hover:bg-white/[0.02]"
          >
            <span className="w-[46px] flex-shrink-0 font-mono text-[9px] text-text3">
              {item.time}
            </span>
            <span
              className={`flex-shrink-0 rounded-[2px] px-[6px] py-[1px] font-mono text-[9px] tracking-[0.1em] ${TYPE_STYLES[item.type]}`}
            >
              {item.type}
            </span>
            <span className="flex-1 text-[11px] text-text2">
              {item.client}
            </span>
            <span
              className={`flex-shrink-0 font-mono text-[9px] ${STATUS_STYLES[item.status]}`}
            >
              {item.statusLabel}
            </span>
            <span className="w-[52px] flex-shrink-0 text-right font-mono text-[9px] text-text3">
              {item.latency}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

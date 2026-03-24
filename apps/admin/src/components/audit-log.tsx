import { Card, CardHeader, CardHeaderButton } from "@/components/card";

interface AuditRow {
  readonly time: string;
  readonly actor: string;
  readonly action: string;
  readonly entity: string;
}

const AUDIT_DATA: readonly AuditRow[] = [
  {
    time: "14:32",
    actor: "samuel.a",
    action: "Approved NIN verification \u2014 edge case override",
    entity: "vrd_nin_9xK",
  },
  {
    time: "14:28",
    actor: "samuel.a",
    action: "Suspended client account \u2014 abuse pattern detected",
    entity: "QuickTest Ltd",
  },
  {
    time: "14:15",
    actor: "system",
    action:
      "Auto-rejected NIN \u2014 confidence below threshold (58%)",
    entity: "vrd_nin_2mP",
  },
  {
    time: "13:58",
    actor: "samuel.a",
    action: "Upgraded client plan: Starter \u2192 Growth",
    entity: "Kareful App",
  },
  {
    time: "13:42",
    actor: "system",
    action:
      "Webhook retry 3/5 failed \u2014 client endpoint unreachable",
    entity: "vrd_wh_7tG",
  },
  {
    time: "13:20",
    actor: "samuel.a",
    action: "Rotated API key \u2014 security audit",
    entity: "TrustPay Africa",
  },
  {
    time: "12:44",
    actor: "system",
    action: "NIMC NVS latency alert \u2014 p95 exceeded 1,200ms",
    entity: "nimc_nvs",
  },
];

export function AuditLog() {
  return (
    <Card className="col-span-full">
      <CardHeader
        title="Audit Log"
        badges={[{ label: "Immutable", variant: "blue" }]}
        actions={<CardHeaderButton>Export</CardHeaderButton>}
      />
      <div>
        {AUDIT_DATA.map((row, idx) => (
          <div
            key={`${row.time}-${row.entity}`}
            className={`flex items-center gap-[10px] px-[14px] py-2 font-mono text-[10px] transition-colors hover:bg-white/[0.015] ${
              idx < AUDIT_DATA.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="w-[52px] flex-shrink-0 text-text3">
              {row.time}
            </span>
            <span className="w-[72px] flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-amber">
              {row.actor}
            </span>
            <span className="flex-1 text-text1">{row.action}</span>
            <span
              className="w-[80px] flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-text2"
              title={row.entity}
            >
              {row.entity}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

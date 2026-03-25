import { Card, CardHeader, CardHeaderButton } from "@/components/card";

export interface AuditRow {
  readonly time: string;
  readonly actor: string;
  readonly action: string;
  readonly entity: string;
}

interface AuditLogProps {
  readonly entries: readonly AuditRow[];
}

export function AuditLog({ entries }: AuditLogProps) {
  return (
    <Card className="col-span-full">
      <CardHeader
        title="Audit Log"
        badges={[{ label: "Immutable", variant: "blue" }]}
        actions={<CardHeaderButton>Export</CardHeaderButton>}
      />
      <div>
        {entries.length === 0 ? (
          <div className="px-4 py-8 text-center font-mono text-[11px] text-text3">
            No audit entries found.
          </div>
        ) : (
          entries.map((row, idx) => (
            <div
              key={`${row.time}-${row.entity}`}
              className={`flex items-center gap-[10px] px-[14px] py-2 font-mono text-[10px] transition-colors hover:bg-white/[0.015] ${
                idx < entries.length - 1 ? "border-b border-border" : ""
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
          ))
        )}
      </div>
    </Card>
  );
}

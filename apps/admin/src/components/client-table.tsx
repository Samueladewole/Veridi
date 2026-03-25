import { Card, CardHeader, CardHeaderButton } from "@/components/card";

type PlanTier = "Growth" | "Starter" | "Scale" | "Enterprise";
type AccountStatus = "active" | "pending" | "suspended";

export interface ClientTableRow {
  readonly name: string;
  readonly initials: string;
  readonly plan: PlanTier;
  readonly status: AccountStatus;
  readonly calls: string;
  readonly mrr: string;
  readonly joined: string;
  readonly lastActive: string;
}

interface ClientTableProps {
  readonly clients: readonly ClientTableRow[];
  readonly activeCount: number;
  readonly pendingCount: number;
}

const PLAN_STYLES: Record<PlanTier, string> = {
  Growth: "bg-amber-pale text-amber border border-amber/15",
  Starter: "bg-blue-pale text-blue border border-blue/15",
  Scale: "bg-purple-pale text-purple border border-purple/15",
  Enterprise: "bg-green-pale text-green border border-green/15",
};

const STATUS_STYLES: Record<AccountStatus, string> = {
  active: "bg-green-pale text-green border border-green/15",
  pending: "bg-amber-pale text-amber border border-amber/15",
  suspended: "bg-red-pale text-red border border-red/15",
};

export function ClientTable({
  clients,
  activeCount,
  pendingCount,
}: ClientTableProps) {
  return (
    <Card className="col-span-full">
      <CardHeader
        title="Client Accounts"
        badges={[
          { label: `${activeCount} Active`, variant: "green" },
          { label: `${pendingCount} Pending`, variant: "amber" },
        ]}
        actions={
          <>
            <CardHeaderButton>Filter</CardHeaderButton>
            <CardHeaderButton>Export</CardHeaderButton>
          </>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                "Client",
                "Plan",
                "Status",
                "Calls (30d)",
                "MRR",
                "Joined",
                "Last Active",
                "",
              ].map((header) => (
                <th
                  key={header || "actions"}
                  className="whitespace-nowrap border-b border-border px-[14px] py-[9px] text-left font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-text3"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-[14px] py-8 text-center font-mono text-[11px] text-text3"
                >
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.name}
                  className="cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-white/[0.015]"
                >
                  <td className="px-[14px] py-[10px] text-[11px] text-text1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[3px] border border-border-2 bg-panel-2 text-[9px] font-bold text-amber">
                        {client.initials}
                      </div>
                      {client.name}
                    </div>
                  </td>
                  <td className="px-[14px] py-[10px]">
                    <span
                      className={`rounded-[2px] px-[7px] py-[2px] font-mono text-[9px] uppercase tracking-[0.08em] ${PLAN_STYLES[client.plan]}`}
                    >
                      {client.plan}
                    </span>
                  </td>
                  <td className="px-[14px] py-[10px]">
                    <span
                      className={`inline-flex items-center gap-1 rounded-[2px] px-[7px] py-[2px] font-mono text-[9px] uppercase tracking-[0.08em] ${STATUS_STYLES[client.status]}`}
                    >
                      <span className="h-[5px] w-[5px] rounded-full bg-current" />
                      {client.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text1">
                    {client.calls}
                  </td>
                  <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-green">
                    {client.mrr}
                  </td>
                  <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text2">
                    {client.joined}
                  </td>
                  <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text2">
                    {client.lastActive}
                  </td>
                  <td className="px-[14px] py-[10px]">
                    <span className="cursor-pointer px-1 text-[14px] text-text3 transition-colors hover:text-amber">
                      &#x22EF;
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

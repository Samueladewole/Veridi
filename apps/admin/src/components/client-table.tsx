import { Card, CardHeader, CardHeaderButton } from "@/components/card";

type PlanTier = "Growth" | "Starter" | "Scale" | "Enterprise";
type AccountStatus = "active" | "pending" | "suspended";

interface ClientRow {
  readonly name: string;
  readonly initials: string;
  readonly plan: PlanTier;
  readonly status: AccountStatus;
  readonly calls: string;
  readonly mrr: string;
  readonly joined: string;
  readonly lastActive: string;
}

const CLIENTS: readonly ClientRow[] = [
  {
    name: "Tendr.ng",
    initials: "TN",
    plan: "Growth",
    status: "active",
    calls: "84,291",
    mrr: "\u20A6200k",
    joined: "Jan 2026",
    lastActive: "2 min ago",
  },
  {
    name: "QuickHire Ltd",
    initials: "QH",
    plan: "Starter",
    status: "pending",
    calls: "\u2014",
    mrr: "\u20A60",
    joined: "Mar 2026",
    lastActive: "Onboarding",
  },
  {
    name: "MedStaff NG",
    initials: "MS",
    plan: "Scale",
    status: "active",
    calls: "210,847",
    mrr: "\u20A6750k",
    joined: "Nov 2025",
    lastActive: "4 min ago",
  },
  {
    name: "Logistics247",
    initials: "L2",
    plan: "Growth",
    status: "active",
    calls: "52,410",
    mrr: "\u20A6200k",
    joined: "Dec 2025",
    lastActive: "1 hr ago",
  },
  {
    name: "TrustPay Africa",
    initials: "TP",
    plan: "Enterprise",
    status: "active",
    calls: "1.2M",
    mrr: "Custom",
    joined: "Oct 2025",
    lastActive: "12 min ago",
  },
  {
    name: "Kareful App",
    initials: "KA",
    plan: "Starter",
    status: "active",
    calls: "9,841",
    mrr: "\u20A650k",
    joined: "Feb 2026",
    lastActive: "3 hr ago",
  },
  {
    name: "DomestiqNG",
    initials: "DN",
    plan: "Growth",
    status: "suspended",
    calls: "18,240",
    mrr: "\u20A60",
    joined: "Dec 2025",
    lastActive: "5 days ago",
  },
];

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

export function ClientTable() {
  return (
    <Card className="col-span-full">
      <CardHeader
        title="Client Accounts"
        badges={[
          { label: "47 Active", variant: "green" },
          { label: "4 Pending", variant: "amber" },
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
            {CLIENTS.map((client) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

import { Card, CardHeader } from "@/components/card";
import { getDisputes } from "@/lib/mock-api";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-red-pale text-red border border-red/15",
  investigating: "bg-amber-pale text-amber border border-amber/15",
  resolved: "bg-green-pale text-green border border-green/15",
};

export default async function DisputesPage() {
  const disputes = await getDisputes();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
          Disputes
        </h1>
        <p className="mt-1 font-mono text-[11px] text-text2">
          Manage client disputes on verification results. Track escalations, review
          evidence, and record resolutions for compliance.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Active Disputes"
          badges={[
            {
              label: `${disputes.filter((d) => d.status === "open").length} Open`,
              variant: "red",
            },
          ]}
        />
        <div>
          {disputes.map((dispute, idx) => (
            <div
              key={dispute.id}
              className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.015] ${
                idx < disputes.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-text1">
                    {dispute.clientName}
                  </span>
                  <span className="font-mono text-[9px] text-text3">
                    {dispute.type}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-text2">
                  {dispute.description}
                </p>
              </div>
              <span
                className={`flex-shrink-0 rounded-[2px] px-[7px] py-[2px] font-mono text-[9px] uppercase tracking-[0.08em] ${STATUS_STYLES[dispute.status] ?? ""}`}
              >
                {dispute.status}
              </span>
              <span className="flex-shrink-0 font-mono text-[9px] text-text3">
                {new Date(dispute.createdAt).toLocaleDateString("en-NG", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

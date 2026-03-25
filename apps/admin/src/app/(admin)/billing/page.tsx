import { Card, CardHeader } from "@/components/card";
import { getBillingOverview } from "@/lib/mock-api";

export default async function BillingPage() {
  const billing = await getBillingOverview();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
          Billing & Revenue
        </h1>
        <p className="mt-1 font-mono text-[11px] text-text2">
          Platform-wide revenue dashboard. Track MRR, subscription tiers, pay-per-call
          revenue, invoices, and payment collection rates across all clients.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <BillingKpi label="MRR" value={billing.mrr} valueClass="text-green" />
        <BillingKpi label="ARR" value={billing.arr} valueClass="text-green" />
        <BillingKpi
          label="Active Subscriptions"
          value={String(billing.activeSubscriptions)}
        />
        <BillingKpi label="Pay-per-call Revenue" value={billing.payPerCallRevenue} />
        <BillingKpi label="Collection Rate" value={billing.collectionRate} />
      </div>

      <Card>
        <CardHeader title="Revenue Breakdown" />
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-2 rounded-[3px] border border-amber/20 bg-amber/[0.08] px-4 py-[6px] font-mono text-[10px] uppercase tracking-[0.14em] text-amber">
              Detailed breakdowns coming soon
            </div>
            <p className="font-mono text-[10px] text-text3">
              Invoice history, payment methods, and tier analytics will appear here.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BillingKpi({
  label,
  value,
  valueClass,
}: {
  readonly label: string;
  readonly value: string;
  readonly valueClass?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded border border-border bg-panel p-4">
      <div className="absolute left-0 right-0 top-0 h-px bg-amber/50" />
      <div className="mb-[10px] font-mono text-[9px] uppercase tracking-[0.14em] text-text2">
        {label}
      </div>
      <div
        className={`font-heading text-[22px] font-extrabold leading-none tracking-[-0.02em] ${valueClass ?? "text-text1"}`}
      >
        {value}
      </div>
    </div>
  );
}

import type { WebhookDelivery } from "@/lib/mock-data";

function WebhookRow({ delivery }: { delivery: WebhookDelivery }) {
  return (
    <div className="flex items-center gap-2.5 rounded border border-border bg-panel-2 px-3 py-2.5">
      <div
        className={`h-[7px] w-[7px] flex-shrink-0 rounded-full ${
          delivery.ok
            ? "bg-green shadow-[0_0_6px_var(--green)]"
            : "bg-red shadow-[0_0_6px_var(--red)]"
        }`}
      />
      <span className="rounded-sm border border-teal/15 bg-teal-pale px-1.5 py-[2px] font-mono text-[9px] tracking-[0.1em] text-teal">
        {delivery.method}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-text-2">
        {delivery.path}
      </span>
      <span className="whitespace-nowrap font-mono text-[9px] text-text-3">
        {delivery.ago}
      </span>
    </div>
  );
}

export function WebhooksWidget({ data }: { data: WebhookDelivery[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="text-[13px] font-bold tracking-tight text-text-1">
          Webhooks
        </div>
        <div className="font-mono text-[10px] text-text-2">
          Recent deliveries
        </div>
      </div>
      <div className="flex flex-col gap-2 px-4 py-3.5">
        {data.map((delivery, idx) => (
          <WebhookRow key={idx} delivery={delivery} />
        ))}
      </div>
    </div>
  );
}

import { Card, CardHeader, CardHeaderButton } from "@/components/card";
import { getWebhooks } from "@/lib/mock-api";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-pale text-green border border-green/15",
  failing: "bg-red-pale text-red border border-red/15",
  disabled: "bg-amber-pale text-amber border border-amber/15",
};

export default async function WebhookMonitorPage() {
  const webhooks = await getWebhooks();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
          Webhook Monitor
        </h1>
        <p className="mt-1 font-mono text-[11px] text-text2">
          Track outbound webhook delivery to client endpoints. Monitor success rates,
          retry queues, and failed deliveries with detailed request/response logs.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Webhooks"
          badges={[
            {
              label: `${webhooks.filter((w) => w.status === "failing").length} Failing`,
              variant: "red",
            },
          ]}
          actions={<CardHeaderButton>Retry All</CardHeaderButton>}
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Client", "Endpoint", "Status", "Success Rate", "Last Delivery"].map(
                  (h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap border-b border-border px-[14px] py-[9px] text-left font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-text3"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {webhooks.map((wh) => (
                <tr
                  key={wh.id}
                  className="border-b border-border transition-colors last:border-b-0 hover:bg-white/[0.015]"
                >
                  <td className="px-[14px] py-[10px] text-[11px] text-text1">
                    {wh.clientName}
                  </td>
                  <td className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text2">
                    {wh.endpoint}
                  </td>
                  <td className="px-[14px] py-[10px]">
                    <span
                      className={`inline-flex items-center gap-1 rounded-[2px] px-[7px] py-[2px] font-mono text-[9px] uppercase tracking-[0.08em] ${STATUS_STYLES[wh.status] ?? ""}`}
                    >
                      <span className="h-[5px] w-[5px] rounded-full bg-current" />
                      {wh.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text1">
                    {wh.successRate}
                  </td>
                  <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text2">
                    {wh.lastDelivery}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

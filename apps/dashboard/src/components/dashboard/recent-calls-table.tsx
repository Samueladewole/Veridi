import type { RecentCall, VerificationType, VerificationStatus } from "@/lib/mock-data";

const typeStyles: Record<VerificationType, string> = {
  NIN: "border-teal/15 bg-teal/10 text-teal",
  BVN: "border-blue/15 bg-blue/10 text-blue",
  FACE: "border-gold/15 bg-gold/10 text-gold",
  BG: "border-purple/15 bg-purple/10 text-[#A78BFA]",
};

const statusStyles: Record<VerificationStatus, string> = {
  Verified: "border-green/15 bg-green-pale text-green",
  Failed: "border-red/15 bg-red-pale text-red",
  Pending: "border-gold/15 bg-gold-pale text-gold",
};

function LatencyBar({ latency }: { latency: number }) {
  const pct = Math.min((latency / 1500) * 100, 100);
  const barColor =
    latency < 600
      ? "bg-teal"
      : latency < 900
        ? "bg-gold"
        : "bg-red";

  return (
    <div className="flex items-center gap-1.5">
      <div className="h-[3px] w-12 overflow-hidden rounded-sm bg-border">
        <div
          className={`h-full rounded-sm ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-text-2">{latency}ms</span>
    </div>
  );
}

export function RecentCallsTable({ data }: { data: RecentCall[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <div className="text-[13px] font-bold tracking-tight text-text-1">
            Recent Verification Calls
          </div>
          <div className="font-mono text-[10px] text-text-2">
            Last 50 API calls across all endpoints
          </div>
        </div>
        <button className="rounded-[3px] border border-border-2 bg-transparent px-3 py-[5px] font-mono text-[10px] tracking-[0.08em] text-text-3 transition-all hover:text-text-2">
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Reference", "Type", "Status", "Confidence", "Latency", "Timestamp"].map(
                (header) => (
                  <th
                    key={header}
                    className="whitespace-nowrap border-b border-border px-4 py-2.5 text-left font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-text-3"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((call) => (
              <tr
                key={call.reference}
                className="border-b border-border transition-colors last:border-b-0 hover:bg-white/[0.02]"
              >
                <td className="whitespace-nowrap px-4 py-[11px] font-mono text-[10px] text-teal">
                  {call.reference}
                </td>
                <td className="whitespace-nowrap px-4 py-[11px]">
                  <span
                    className={`inline-block rounded-sm border px-2 py-[2px] font-mono text-[9px] uppercase tracking-[0.08em] ${typeStyles[call.type]}`}
                  >
                    {call.type}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-[11px]">
                  <span
                    className={`inline-flex items-center gap-[5px] rounded-[3px] border px-[9px] py-[3px] font-mono text-[9px] font-medium uppercase tracking-[0.1em] ${statusStyles[call.status]}`}
                  >
                    <span className="h-[5px] w-[5px] rounded-full bg-current" />
                    {call.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-[11px] font-mono text-[11px] text-text-1">
                  {call.confidence}
                </td>
                <td className="whitespace-nowrap px-4 py-[11px]">
                  <LatencyBar latency={call.latency} />
                </td>
                <td className="whitespace-nowrap px-4 py-[11px] font-mono text-[11px] text-text-3">
                  {call.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

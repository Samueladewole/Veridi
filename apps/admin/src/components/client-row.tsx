import type { ClientRecord } from "@/components/clients-data";
import { PLAN_STYLES, STATUS_STYLES } from "@/components/clients-data";

export function ClientRow({ client }: { readonly client: ClientRecord }) {
  return (
    <tr className="cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-white/[0.015]">
      <td className="px-[14px] py-[10px] text-[11px] text-text1">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[3px] border border-border-2 bg-panel-2 text-[9px] font-bold text-amber">
            {client.initials}
          </div>
          {client.name}
        </div>
      </td>
      <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text2">
        {client.email}
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
        {client.calls30d}
      </td>
      <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text2">
        {client.callsTotal}
      </td>
      <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-green">
        {client.mrr}
      </td>
      <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text3">
        {client.apiKeyPrefix}...
      </td>
      <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text2">
        {client.joined}
      </td>
      <td className="whitespace-nowrap px-[14px] py-[10px] font-mono text-[10px] text-text2">
        {client.lastActive}
      </td>
      <td className="px-[14px] py-[10px]">
        <div className="flex gap-[6px]">
          {client.status === "pending" && (
            <button className="rounded-[2px] border border-green/20 bg-green-pale px-[10px] py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-green transition-colors hover:bg-green hover:text-void">
              Approve
            </button>
          )}
          {client.status === "active" && (
            <button className="rounded-[2px] border border-red/20 bg-red-pale px-[10px] py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-red transition-colors hover:bg-red hover:text-void">
              Suspend
            </button>
          )}
          {client.status === "suspended" && (
            <button className="rounded-[2px] border border-green/20 bg-green-pale px-[10px] py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-green transition-colors hover:bg-green hover:text-void">
              Reactivate
            </button>
          )}
          <button className="rounded-[2px] border border-border-2 bg-transparent px-[10px] py-1 font-mono text-[9px] text-text2 transition-colors hover:border-amber hover:text-amber">
            View
          </button>
        </div>
      </td>
    </tr>
  );
}

import type { ApiKey } from "@/lib/mock-data";

function KeyRow({ apiKey }: { apiKey: ApiKey }) {
  const envStyle =
    apiKey.env === "live"
      ? "border-green/15 bg-green-pale text-green"
      : "border-gold/15 bg-gold-pale text-gold";

  return (
    <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-text-1">{apiKey.name}</div>
        <div className="mt-0.5 font-mono text-[9px] text-text-3">
          {apiKey.description}
        </div>
      </div>
      <span
        className={`rounded-sm border px-[7px] py-[2px] font-mono text-[9px] uppercase tracking-[0.1em] ${envStyle}`}
      >
        {apiKey.env === "live" ? "Live" : "Test"}
      </span>
      <div className="cursor-pointer rounded-[3px] border border-border bg-panel-2 px-2.5 py-1 font-mono text-[10px] text-text-3 transition-all hover:border-teal hover:text-teal">
        {apiKey.maskedKey}
      </div>
      <div className="flex gap-1.5">
        <button
          className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-border bg-panel-2 font-mono text-[11px] text-text-2 transition-all hover:border-teal hover:text-teal"
          title="Copy"
          aria-label="Copy key"
        >
          &#x2398;
        </button>
        <button
          className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-border bg-panel-2 font-mono text-[11px] text-text-2 transition-all hover:border-teal hover:text-teal"
          title="Rotate"
          aria-label="Rotate key"
        >
          &#x21BB;
        </button>
      </div>
    </div>
  );
}

export function ApiKeysWidget({ data }: { data: ApiKey[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="text-[13px] font-bold tracking-tight text-text-1">
          API Keys
        </div>
        <button className="rounded-[3px] border border-border-2 bg-transparent px-3 py-[5px] font-mono text-[10px] tracking-[0.08em] text-text-3 transition-all hover:text-text-2">
          + New Key
        </button>
      </div>
      {data.map((key) => (
        <KeyRow key={key.name} apiKey={key} />
      ))}
    </div>
  );
}

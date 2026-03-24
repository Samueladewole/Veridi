export function PlanMeter() {
  return (
    <div className="px-5 pb-5">
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-text-1">
              Growth Plan
            </div>
            <div className="mt-0.5 font-mono text-[9px] text-text-3">
              2,847 of 3,000 calls used
            </div>
          </div>
          <span className="rounded-sm border border-teal/20 bg-teal-pale px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.1em] text-teal">
            Growth
          </span>
        </div>

        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-dim to-teal"
            style={{ width: "94.9%" }}
          />
        </div>

        <button className="mt-3 w-full rounded-[3px] border border-border-2 bg-transparent px-2 py-2 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-text-2 transition-all hover:border-teal hover:bg-teal-pale hover:text-teal">
          &#x2191; Upgrade to Scale Plan
        </button>
      </div>
    </div>
  );
}

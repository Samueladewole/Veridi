const countries = [
  { flag: "🇳🇬", name: "Nigeria", status: "Live", cls: "bg-[rgba(34,197,94,0.1)] text-[#22C55E] border border-[rgba(34,197,94,0.2)]" },
  { flag: "🇬🇭", name: "Ghana", status: "Q2 2026", cls: "bg-[rgba(0,212,180,0.1)] text-[var(--teal)] border border-[rgba(0,212,180,0.2)]" },
  { flag: "🇰🇪", name: "Kenya", status: "Q4 2026", cls: "bg-[rgba(240,168,48,0.1)] text-[var(--gold)] border border-[rgba(240,168,48,0.2)]" },
  { flag: "🇿🇦", name: "South Africa", status: "2027", cls: "bg-[rgba(100,116,139,0.1)] text-[var(--slate2)] border border-[var(--border2)]" },
  { flag: "🇷🇼", name: "Rwanda", status: "2027", cls: "bg-[rgba(100,116,139,0.1)] text-[var(--slate2)] border border-[var(--border2)]" },
];

export function Africa() {
  return (
    <section className="px-6 md:px-16 py-20 bg-[var(--deep)] border-t border-[var(--border)] flex items-center justify-between gap-[60px] flex-wrap">
      <div>
        <div className="flex items-center gap-[14px] mb-5">
          <div className="w-8 h-px bg-[var(--teal)]" />
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--teal)]">
            Coverage
          </div>
        </div>
        <h2 className="font-serif text-[clamp(36px,4vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] text-white mb-5">
          Africa-first.
          <br />
          <em className="text-[var(--teal)]">Continent-ready.</em>
        </h2>
        <p className="font-mono text-[12px] font-light leading-[1.75] text-[var(--text2)] max-w-[420px]">
          Launching in Nigeria with NIMC and NIBSS direct integration. Expanding to 5 countries by
          2027 through local data source partnerships and Smile Identity relay.
        </p>
      </div>

      <div className="flex flex-col gap-[10px] shrink-0">
        {countries.map((c) => (
          <div
            key={c.name}
            className="flex items-center gap-[14px] px-5 py-3 bg-[var(--panel)] border border-[var(--border2)] rounded-[3px] min-w-[260px] hover:border-[var(--teal)] transition-colors"
          >
            <span className="text-[20px]">{c.flag}</span>
            <span className="font-[Syne] font-semibold text-[14px] text-white flex-1">
              {c.name}
            </span>
            <span
              className={`font-mono text-[9px] tracking-[0.14em] uppercase px-2 py-[2px] rounded-[2px] ${c.cls}`}
            >
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

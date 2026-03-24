export function Ticker() {
  const items = [
    "NIN Verification · NIMC Licensed",
    "BVN · NIBSS Partnership",
    "Liveness Detection · 99.8% Accuracy",
    "Background Checks · 48hr Turnaround",
    "NDPA 2023 Compliant · Privacy by Design",
    "Veridi Score · Africa's Trust Layer",
    "Cloudflare Edge · Railway Compute",
    "Response Time <800ms · 99.9% SLA",
  ];

  return (
    <div className="relative z-[2] border-y border-[var(--border)] py-[14px] overflow-hidden bg-[var(--panel)]">
      <div className="ticker-track">
        {[...items, ...items].map((text, i) => (
          <div
            key={i}
            className="flex items-center gap-[14px] px-10 whitespace-nowrap font-mono text-[11px] text-[var(--slate2)] tracking-[0.1em]"
          >
            <span className="text-[var(--teal)] opacity-50">{"//"}</span> {text}
          </div>
        ))}
      </div>
    </div>
  );
}

import { SectionHeader } from "./section-header";

const layers = [
  { icon: "🌐", text: "Cloudflare WAF · DDoS · Rate Limiting", status: "CF Edge", cls: "bg-[rgba(240,168,48,0.1)] text-[var(--gold)] border border-[rgba(240,168,48,0.2)]" },
  { icon: "🔑", text: "API Key Validation · IP Allowlist Check", status: "Authenticated", cls: "bg-[rgba(34,197,94,0.1)] text-[#22C55E] border border-[rgba(34,197,94,0.2)]" },
  { icon: "📜", text: "Consent Token Verification · NDPA", status: "Compliant", cls: "bg-[rgba(0,212,180,0.1)] text-[var(--teal)] border border-[rgba(0,212,180,0.2)]" },
  { icon: "🔐", text: "PII Tokenisation · AES-256 Encryption", status: "Encrypted", cls: "bg-[rgba(0,212,180,0.1)] text-[var(--teal)] border border-[rgba(0,212,180,0.2)]" },
  { icon: "🪪", text: "NIMC NVS · NIBSS · Government Databases", status: "Verified", cls: "bg-[rgba(34,197,94,0.1)] text-[#22C55E] border border-[rgba(34,197,94,0.2)]" },
  { icon: "📊", text: "Audit Log · Immutable · Append-Only", status: "Logged", cls: "bg-[rgba(0,212,180,0.1)] text-[var(--teal)] border border-[rgba(0,212,180,0.2)]" },
];

const points = [
  { num: "01", title: "Zero raw PII storage", desc: "NINs and BVNs are one-way hashed on arrival using Argon2id. Raw identity data is never stored. Verification results reference pseudonymous tokens only." },
  { num: "02", title: "Consent-gated by design", desc: "Every API call requires a valid, signed consent token proving the subject agreed to be verified. No token — no verification. This is a hard architectural constraint, not an optional policy." },
  { num: "03", title: "NDPA 2023 compliant", desc: "Built from day one for Nigeria's Data Protection Act. Consent records, data minimisation, right-to-erasure API, and full audit trails available as standard." },
  { num: "04", title: "Quarterly pen tests", desc: "Independent third-party penetration testing every quarter. Reports shared with enterprise clients on request. Full OWASP compliance enforced in CI/CD." },
];

export function Trust() {
  return (
    <section className="px-6 md:px-16 py-[120px] relative z-[2]">
      <SectionHeader
        label="Security & Compliance"
        title={<>Precision without<br /><em className="text-[var(--slate)]">compromising privacy</em></>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-md:gap-12 items-center mt-[72px]">
        {/* Visual */}
        <div className="relative h-[440px] border border-[var(--border)] rounded bg-[var(--panel)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,180,0.06),transparent_70%)]" />
          <div className="absolute inset-0 flex flex-col justify-around p-8 gap-[10px]">
            {layers.map((l, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 bg-[var(--panel2)] border border-[var(--border2)] rounded-[3px]"
                style={{ animation: `layerPulse ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite` }}
              >
                <span className="text-[16px] shrink-0">{l.icon}</span>
                <span className="font-mono text-[11px] text-[var(--text2)] flex-1">{l.text}</span>
                <span className={`font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-[2px] rounded-[2px] ${l.cls}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Points */}
        <div className="flex flex-col gap-7">
          {points.map((p) => (
            <div key={p.num} className="flex gap-5 items-start">
              <div className="font-mono text-[13px] text-[var(--teal)] w-7 shrink-0 pt-[2px]">
                {p.num}
              </div>
              <div>
                <div className="font-[Syne] font-semibold text-[17px] text-white mb-2 tracking-[-0.01em]">
                  {p.title}
                </div>
                <p className="font-mono text-[12px] font-light leading-[1.7] text-[var(--text2)]">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

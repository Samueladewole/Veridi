import { SectionHeader } from "./section-header";

const products = [
  {
    num: "01",
    icon: "🪪",
    name: "Veridi ID",
    code: "Government Identity",
    desc: "NIN, BVN, Driver's Licence, Passport, Voter's Card, TIN — verified against official government databases in real time.",
    tags: ["NIN", "BVN", "FRSC", "INEC", "<800ms"],
    variant: "",
  },
  {
    num: "02",
    icon: "👤",
    name: "Veridi Face",
    code: "Biometric Liveness",
    desc: "Passive liveness detection and face matching. 99.8% accuracy on African faces. No gestures required — works on low-end devices.",
    tags: ["Liveness", "Face Match", "Anti-Spoof", "Low-Bandwidth"],
    variant: "",
  },
  {
    num: "03",
    icon: "📋",
    name: "Veridi Background",
    code: "Professional Checks",
    desc: "Employment history, reference checks, credential verification, criminal records. The layer that NIN alone can never provide.",
    tags: ["Employment", "References", "Credentials", "48hr"],
    variant: "",
  },
  {
    num: "04",
    icon: "📍",
    name: "Veridi Address",
    code: "Location Verification",
    desc: "Three-tier address verification: digital signals, document OCR, or on-ground agent visit. Choose your assurance level.",
    tags: ["Digital", "Document OCR", "Field Agent", "6 States"],
    variant: "gold",
  },
  {
    num: "05",
    icon: "⭐",
    name: "Veridi Score",
    code: "Behavioural Trust",
    desc: "A portable trust score for Africa's informal workforce. Built from verified identity, contract completions, ratings, and employment history. 0–1000 scale.",
    tags: ["0–1000", "Portable", "Cross-Platform", "Phase 2"],
    variant: "gold",
  },
  {
    num: "06",
    icon: "🔔",
    name: "Veridi Consent",
    code: "NDPA Compliance Widget",
    desc: "Hosted consent widget. Generates signed consent tokens required for every verification call. Manages right-to-erasure requests automatically.",
    tags: ["NDPA 2023", "Consent Tokens", "Erasure API", "Embeddable"],
    variant: "slate",
  },
];

function getCardColor(variant: string) {
  if (variant === "gold") return "var(--gold)";
  if (variant === "slate") return "var(--slate)";
  return "var(--teal)";
}

export function Products() {
  return (
    <section className="px-6 md:px-16 py-[120px] relative z-[2]" id="products">
      <SectionHeader
        label="Product Suite"
        title={
          <>
            Everything you need
            <br />
            to <em className="text-[var(--slate)]">verify with certainty</em>
          </>
        }
        description={`Six API products. One integration.\nFrom basic NIN lookup to behavioural trust scores.`}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)]">
        {products.map((p) => (
          <div
            key={p.num}
            className="group bg-[var(--deep)] p-[44px_40px] relative overflow-hidden hover:bg-[var(--panel)] transition-colors"
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400"
              style={{ background: getCardColor(p.variant) }}
            />
            <div className="font-mono text-[11px] text-[var(--slate3)] tracking-[0.14em] mb-7">
              {p.num} ——
            </div>
            <div className="w-12 h-12 border border-[var(--border2)] rounded-[3px] flex items-center justify-center text-[22px] mb-6 bg-[var(--panel)] group-hover:border-[var(--teal)] group-hover:shadow-[0_0_16px_rgba(0,212,180,0.15)] transition-all">
              {p.icon}
            </div>
            <div className="font-[Syne] font-bold text-[18px] text-white mb-[6px] tracking-[-0.01em]">
              {p.name}
            </div>
            <div
              className="font-mono text-[10px] tracking-[0.12em] uppercase mb-4"
              style={{ color: getCardColor(p.variant) }}
            >
              {p.code}
            </div>
            <p className="font-mono text-[12px] font-light leading-[1.75] text-[var(--text2)] mb-6">
              {p.desc}
            </p>
            <div className="flex flex-wrap gap-[6px]">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-[10px] py-1 rounded-[2px] bg-[var(--panel2)] border border-[var(--border2)] font-mono text-[9px] text-[var(--slate2)] tracking-[0.1em]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

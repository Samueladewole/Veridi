import { SectionHeader } from "./section-header";

const plans = [
  {
    tier: "Starter",
    tierColor: "text-[var(--teal)]",
    price: "0",
    currency: "₦",
    period: "/mo",
    desc: "For developers exploring Veridi. Full API access, sandbox environment, 100 verifications/month.",
    features: [
      "100 mixed verification calls/month",
      "Full sandbox environment",
      "API docs + playground access",
      "Node.js + Python SDK",
      "Standard email support",
    ],
    ctaText: "Start Free",
    ctaClass: "border-[var(--teal)] text-[var(--teal)] bg-[var(--teal-pale)]",
    featured: false,
    goldFeatures: false,
  },
  {
    tier: "Growth",
    tierColor: "text-[var(--teal)]",
    price: "200k",
    currency: "₦",
    period: "/mo",
    desc: "For growing platforms with predictable volume. Includes Veridi Score access and priority support.",
    features: [
      "3,000 mixed calls/month included",
      "Webhook delivery system",
      "Team access (5 members)",
      "Veridi Score queries",
      "99.5% SLA + priority support",
    ],
    ctaText: "Get Started",
    ctaClass: "bg-[var(--teal)] text-[var(--void)] border-[var(--teal)] font-semibold hover:bg-white hover:border-white",
    featured: true,
    goldFeatures: false,
  },
  {
    tier: "Enterprise",
    tierColor: "text-[var(--gold)]",
    price: "Custom",
    currency: "",
    period: "",
    desc: "For banks, insurers, and government programmes. Custom SLA, dedicated infrastructure, direct NIMC integration.",
    features: [
      "Unlimited calls + custom data",
      "Dedicated Railway infrastructure",
      "99.95% SLA + dedicated engineer",
      "Quarterly security reviews",
      "NIMC direct integration support",
    ],
    ctaText: "Talk to Sales",
    ctaClass: "border-[var(--border2)] text-[var(--text2)] hover:border-[var(--teal)] hover:text-[var(--teal)] hover:bg-[var(--teal-pale)]",
    featured: false,
    goldFeatures: true,
  },
];

export function Pricing() {
  return (
    <section
      className="px-6 md:px-16 py-[120px] bg-[var(--deep)] border-y border-[var(--border)]"
      id="pricing"
    >
      <SectionHeader
        label="Pricing"
        title={<>Start free.<br /><em className="text-[var(--slate)]">Scale as you grow.</em></>}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)] mt-[72px]">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            className={`relative p-[44px_40px] transition-colors ${
              plan.featured ? "bg-[var(--panel2)]" : "bg-[var(--panel)]"
            }`}
          >
            {plan.featured && (
              <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 bg-[var(--teal)] text-[var(--void)] font-mono text-[9px] font-medium tracking-[0.18em] px-[14px] py-1 rounded-b-[3px]">
                MOST POPULAR
              </div>
            )}
            <div className={`font-mono text-[10px] tracking-[0.2em] uppercase mb-5 ${plan.tierColor}`}>
              {plan.tier}
            </div>
            <div className="font-serif font-normal text-white leading-none tracking-[-0.02em] mb-[6px]" style={{ fontSize: plan.price === "Custom" ? "40px" : "52px" }}>
              {plan.currency && (
                <span className="text-[24px] text-[var(--slate2)] align-super">{plan.currency}</span>
              )}
              {plan.price}
              {plan.period && (
                <span className="text-[16px] text-[var(--slate2)] font-mono">{plan.period}</span>
              )}
            </div>
            <p className="font-mono text-[11px] text-[var(--text2)] mb-8 leading-[1.6]">
              {plan.desc}
            </p>
            <div className="h-px bg-[var(--border)] mb-7" />
            <ul className="list-none flex flex-col gap-3 mb-9">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-[10px] font-mono text-[11px] text-[var(--text2)] leading-[1.5]">
                  <span className={`text-[14px] shrink-0 -mt-[1px] ${plan.goldFeatures ? "text-[var(--gold)]" : "text-[var(--teal)]"}`}>
                    ›
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className={`block w-full py-3 text-center border rounded-[2px] font-mono text-[11px] tracking-[0.14em] uppercase no-underline transition-all ${plan.ctaClass}`}
            >
              {plan.ctaText}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="relative px-6 md:px-16 py-[160px] overflow-hidden text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(0,212,180,0.08)_0%,transparent_60%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[Syne] font-extrabold text-[240px] text-[rgba(255,255,255,0.02)] whitespace-nowrap pointer-events-none tracking-[-0.04em]">
        VERIDI
      </div>

      <h2 className="relative z-[1] font-serif text-[clamp(48px,6vw,84px)] font-normal leading-[1.05] tracking-[-0.025em] text-white mb-6">
        Build trust
        <br />
        into <em className="text-[var(--teal)]">every transaction.</em>
      </h2>
      <p className="relative z-[1] font-mono text-[13px] font-light text-[var(--text2)] max-w-[440px] mx-auto mb-[52px] leading-[1.7]">
        Join the platforms building Africa&apos;s trust infrastructure. Start with 100 free
        verifications. No credit card required.
      </p>
      <div className="relative z-[1] flex gap-4 justify-center flex-wrap">
        <a
          href="#"
          className="bg-[var(--teal)] text-[var(--void)] px-8 py-[14px] font-[Syne] text-[12px] font-bold tracking-[0.14em] uppercase rounded-[2px] no-underline inline-flex items-center gap-[10px] hover:bg-white hover:shadow-[0_0_40px_rgba(0,212,180,0.4)] hover:-translate-y-[1px] transition-all"
        >
          Get API Key Free
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-[10px] px-8 py-[14px] border border-[var(--teal)] text-[var(--teal)] font-[Syne] text-[12px] font-semibold tracking-[0.14em] uppercase rounded-[2px] no-underline hover:bg-[var(--teal-pale)] hover:shadow-[0_0_24px_rgba(0,212,180,0.2)] transition-all"
        >
          Read the Docs
        </a>
      </div>
    </section>
  );
}

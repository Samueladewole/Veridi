const footerCols = [
  {
    title: "Product",
    links: ["Veridi ID", "Veridi Face", "Veridi Background", "Veridi Score", "Veridi Consent", "Pricing"],
  },
  {
    title: "Developers",
    links: ["Documentation", "API Reference", "SDKs", "Playground", "Status", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact", "Security", "Privacy Policy"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 md:px-16 pt-16 pb-10 bg-[var(--deep)]">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-[60px] max-md:gap-8 mb-[60px] pb-[60px] border-b border-[var(--border)]">
        <div>
          <div className="font-[Syne] font-extrabold text-[24px] text-white mb-3 tracking-[-0.02em]">
            Veridi<span className="text-[var(--teal)]">.</span>
          </div>
          <p className="font-mono text-[11px] text-[var(--slate2)] italic tracking-[0.04em]">
            The truth layer for Africa&apos;s digital economy.
          </p>
        </div>
        {footerCols.map((col) => (
          <div key={col.title}>
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-[var(--slate3)] mb-4">
              {col.title}
            </div>
            <ul className="list-none flex flex-col gap-[10px]">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-mono text-[12px] text-[var(--slate2)] no-underline hover:text-[var(--teal)] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4 font-mono text-[11px] text-[var(--slate3)]">
        <span>© 2026 Veridi Technologies Limited. Lagos, Nigeria.</span>
        <div className="flex gap-6">
          <a href="#" className="text-[var(--slate3)] no-underline hover:text-[var(--slate2)] transition-colors">
            Terms
          </a>
          <a href="#" className="text-[var(--slate3)] no-underline hover:text-[var(--slate2)] transition-colors">
            Privacy
          </a>
          <a href="#" className="text-[var(--slate3)] no-underline hover:text-[var(--slate2)] transition-colors">
            Security
          </a>
        </div>
      </div>
    </footer>
  );
}

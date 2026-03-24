"use client";

import { useEffect, useState } from "react";

export function Nav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[800] flex items-center justify-between transition-all duration-400 ${
        stuck
          ? "bg-[rgba(5,8,15,0.92)] backdrop-blur-[24px] px-16 py-4 border-b border-[var(--border)]"
          : "px-16 py-6"
      }`}
    >
      <a
        href="#"
        className="font-[Syne] font-extrabold text-[22px] text-white tracking-[-0.02em] no-underline flex items-baseline gap-[2px]"
      >
        Veridi<span className="text-[var(--teal)]">.</span>
      </a>
      <ul className="hidden md:flex gap-9 list-none items-center">
        {[
          { href: "#products", label: "Products" },
          { href: "#how", label: "How It Works" },
          { href: "#devs", label: "Developers" },
          { href: "#pricing", label: "Pricing" },
        ].map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-[12px] tracking-[0.12em] uppercase text-[var(--text2)] no-underline font-medium hover:text-[var(--teal)] transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#"
            className="border border-[var(--teal)] text-[var(--teal)] px-[22px] py-[9px] text-[11px] font-semibold tracking-[0.14em] uppercase rounded-[2px] no-underline font-[Syne] hover:bg-[var(--teal)] hover:text-[var(--void)] hover:shadow-[0_0_24px_var(--teal-glow)] transition-all"
          >
            Get API Key
          </a>
        </li>
      </ul>
    </nav>
  );
}

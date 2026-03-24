"use client";

import { motion, type Variants } from "framer-motion";
import { ConstellationCanvas } from "./constellation-canvas";
import { HeroVisual } from "./hero-visual";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const, delay },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-[140px] pb-20 overflow-hidden">
      {/* Radial glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-[radial-gradient(ellipse,rgba(0,212,180,0.07)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(ellipse,rgba(240,168,48,0.04)_0%,transparent_65%)] pointer-events-none" />

      <ConstellationCanvas />

      <div className="relative z-[2] grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">
        {/* Left — copy */}
        <div>
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="inline-flex items-center gap-[10px] border border-[var(--border2)] bg-[var(--panel)] px-4 py-[7px] rounded-[2px] mb-10"
          >
            <div className="w-[6px] h-[6px] rounded-full bg-[var(--teal)] shadow-[0_0_8px_var(--teal)] animate-[blink_2s_ease-in-out_infinite]" />
            <span className="font-mono text-[11px] text-[var(--teal)] tracking-[0.1em]">
              veridi.africa · api.veridi.africa/v1 · 99.9% uptime
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="font-serif text-[clamp(48px,5.5vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-white mb-8"
          >
            The <span className="text-[var(--teal)]">truth layer</span>
            <br />
            for <span className="italic text-[var(--slate)]">Africa&apos;s</span>{" "}
            digital
            <br />
            economy<span className="text-[var(--teal)]">.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="font-mono text-[14px] font-light leading-[1.75] text-[var(--text2)] max-w-[520px] mb-[44px]"
          >
            One API. Every African identity.
            <br />
            NIN · BVN · Liveness · Background checks · Trust scores.
            <br />
            Built for the platforms serving 500M informal workers.
          </motion.p>

          {/* Actions */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.7}
            className="flex gap-4 items-center flex-wrap"
          >
            <a
              href="#"
              className="bg-[var(--teal)] text-[var(--void)] px-8 py-[14px] font-[Syne] text-[12px] font-bold tracking-[0.14em] uppercase rounded-[2px] no-underline inline-flex items-center gap-[10px] hover:bg-white hover:shadow-[0_0_40px_rgba(0,212,180,0.4)] hover:-translate-y-[1px] transition-all"
            >
              Start Building Free
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
              className="inline-flex items-center gap-[10px] font-mono text-[12px] text-[var(--text2)] no-underline py-[14px] border-b border-[var(--border2)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-colors tracking-[0.06em]"
            >
              View API Docs
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 6H11M11 6L7 2M11 6L7 10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Right — live verification visual */}
        <div className="hidden lg:block">
          <HeroVisual />
        </div>
      </div>

      {/* Code block — full width below */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.9}
        className="relative z-[2] mt-16"
      >
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--slate2)] mb-[10px] flex items-center gap-[10px]">
          Quick Integration
          <span className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <div className="relative bg-[var(--panel)] border border-[var(--border2)] rounded-[3px] p-5 px-6 font-mono text-[12.5px] leading-[1.8] max-w-[580px] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--teal)] to-transparent" />
          <pre className="whitespace-pre-wrap">
            <span className="text-[var(--slate2)] italic">
              {`// Verify a NIN in under 800ms`}
            </span>
            {"\n"}
            <span className="text-[#79B8FF]">const</span> veridi ={" "}
            <span className="text-[#79B8FF]">require</span>(
            <span className="text-[#85E89D]">{`'@veridi/node'`}</span>);{"\n"}
            <span className="text-[#79B8FF]">const</span> client ={" "}
            <span className="text-[#79B8FF]">new</span>{" "}
            <span className="text-[var(--teal)]">veridi.Client</span>(
            <span className="text-[#85E89D]">process.env.VERIDI_KEY</span>);
            {"\n\n"}
            <span className="text-[#79B8FF]">const</span> result ={" "}
            <span className="text-[#79B8FF]">await</span> client.id.
            <span className="text-[var(--teal)]">verifyNIN</span>({`{`}
            {"\n"}
            {"  "}
            <span className="text-[#79B8FF]">nin:</span>{"           "}
            <span className="text-[#85E89D]">{`"12345678901"`}</span>,{"\n"}
            {"  "}
            <span className="text-[#79B8FF]">consent_token:</span>{" "}
            <span className="text-[#85E89D]">req.body.consent_token</span>,
            {"\n"}
            {`}`};{"\n\n"}
            <span className="text-[var(--slate2)] italic">
              {`// → { verified: true, confidence: 98, ref: "vrd_..." }`}
            </span>
          </pre>
        </div>
      </motion.div>
    </section>
  );
}

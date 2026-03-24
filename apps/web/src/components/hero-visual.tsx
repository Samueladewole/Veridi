"use client";

import { motion } from "framer-motion";

const verifications = [
  { type: "NIN", status: "Verified", confidence: 98, ms: 612, source: "NIMC NVS", color: "var(--teal)" },
  { type: "BVN", status: "Verified", confidence: 95, ms: 340, source: "NIBSS", color: "var(--teal)" },
  { type: "Liveness", status: "Pass", confidence: 99, ms: 180, source: "Veridi ML", color: "#22C55E" },
  { type: "Background", status: "Pending", confidence: null, ms: null, source: "Queue", color: "var(--gold)" },
];

function VerificationCard({
  v,
  index,
}: {
  v: (typeof verifications)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
      className="bg-[var(--panel)] border border-[var(--border2)] rounded-[3px] p-4 flex items-center gap-3 hover:border-[var(--teal)] transition-colors"
    >
      {/* Status dot */}
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{
          background: v.color,
          boxShadow: `0 0 8px ${v.color}`,
          animation: v.status === "Pending" ? "blink 2s ease-in-out infinite" : "none",
        }}
      />

      {/* Type */}
      <div className="flex-1 min-w-0">
        <div className="font-[Syne] font-semibold text-[13px] text-white">{v.type}</div>
        <div className="font-mono text-[9px] text-[var(--slate2)] tracking-[0.08em]">
          {v.source}
        </div>
      </div>

      {/* Confidence */}
      {v.confidence !== null && (
        <div className="text-right">
          <div className="font-mono text-[14px] font-medium" style={{ color: v.color }}>
            {v.confidence}%
          </div>
          <div className="font-mono text-[9px] text-[var(--slate3)]">{v.ms}ms</div>
        </div>
      )}

      {/* Status badge */}
      <div
        className="font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-[2px] rounded-[2px] shrink-0"
        style={{
          background: `color-mix(in srgb, ${v.color} 10%, transparent)`,
          color: v.color,
          border: `1px solid color-mix(in srgb, ${v.color} 20%, transparent)`,
        }}
      >
        {v.status}
      </div>
    </motion.div>
  );
}

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="relative"
    >
      {/* Main card */}
      <div className="bg-[var(--deep)] border border-[var(--border)] rounded overflow-hidden">
        {/* Header bar */}
        <div className="bg-[var(--panel2)] px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
          <div className="w-[8px] h-[8px] rounded-full bg-[#FF5F57]" />
          <div className="w-[8px] h-[8px] rounded-full bg-[#FFBD2E]" />
          <div className="w-[8px] h-[8px] rounded-full bg-[#28CA41]" />
          <span className="ml-2 font-mono text-[10px] text-[var(--slate2)] tracking-[0.08em]">
            veridi — live verification stream
          </span>
          <div className="ml-auto flex items-center gap-[6px]">
            <div className="w-[6px] h-[6px] rounded-full bg-[#22C55E] animate-[blink_2s_ease-in-out_infinite]" />
            <span className="font-mono text-[9px] text-[#22C55E] tracking-[0.1em]">LIVE</span>
          </div>
        </div>

        {/* Subject info */}
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--panel)] border border-[var(--border2)] flex items-center justify-center font-mono text-[11px] text-[var(--teal)]">
            S.A
          </div>
          <div>
            <div className="font-mono text-[11px] text-white">Subject: vrd_tok_9xK3m...</div>
            <div className="font-mono text-[9px] text-[var(--slate3)]">
              Consent granted · 3 checks queued
            </div>
          </div>
          <div className="ml-auto font-mono text-[10px] text-[var(--teal)] bg-[var(--teal-pale)] px-2 py-[2px] rounded-[2px] border border-[rgba(0,212,180,0.2)]">
            Veridi Score: 847
          </div>
        </div>

        {/* Verification cards */}
        <div className="p-3 flex flex-col gap-2">
          {verifications.map((v, i) => (
            <VerificationCard key={v.type} v={v} index={i} />
          ))}
        </div>

        {/* Footer stats */}
        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex gap-4">
            <div>
              <div className="font-mono text-[9px] text-[var(--slate3)] tracking-[0.12em] uppercase">
                Avg Response
              </div>
              <div className="font-mono text-[13px] text-[var(--teal)]">377ms</div>
            </div>
            <div>
              <div className="font-mono text-[9px] text-[var(--slate3)] tracking-[0.12em] uppercase">
                Today
              </div>
              <div className="font-mono text-[13px] text-white">1,247 calls</div>
            </div>
          </div>
          <div className="font-mono text-[9px] text-[var(--slate3)]">api.veridi.africa/v1</div>
        </div>
      </div>

      {/* Glow effect behind card */}
      <div className="absolute -inset-8 bg-[radial-gradient(ellipse_at_center,rgba(0,212,180,0.06),transparent_70%)] -z-10 pointer-events-none" />
    </motion.div>
  );
}

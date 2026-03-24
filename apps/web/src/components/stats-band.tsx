"use client";

import { useEffect, useRef, useState } from "react";

interface StatProps {
  value: string;
  tealPart: string;
  suffix: string;
  prefix?: string;
  label: string;
  sub: string;
}

function StatCol({ value, tealPart, suffix, prefix, label, sub }: StatProps) {
  return (
    <div className="px-10 border-r border-[var(--border)] last:border-r-0 first:pl-0 max-md:px-5 max-md:border-r-0 max-md:border-b max-md:border-[var(--border)] max-md:py-5">
      <div className="font-serif text-[52px] font-normal text-white leading-none tracking-[-0.02em] mb-2">
        {prefix}
        <span className="text-[var(--teal)]">{tealPart}</span>
        {suffix}
      </div>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--slate2)]">
        {label}
      </div>
      <div className="text-[11px] text-[var(--slate3)] mt-1">{sub}</div>
    </div>
  );
}

export function StatsBand() {
  return (
    <div className="relative z-[2] grid grid-cols-4 max-md:grid-cols-2 px-16 max-md:px-6 py-16 max-md:py-10 border-b border-[var(--border)] bg-[var(--deep)]">
      <StatCol
        tealPart="500"
        suffix="M+"
        value="500"
        label="Addressable Workers"
        sub="Nigeria's informal workforce"
      />
      <StatCol
        tealPart="9"
        suffix=""
        value="9"
        label="ID Databases"
        sub="NIN, BVN, DL, Passport, Voters & more"
      />
      <StatCol
        prefix="<"
        tealPart="800"
        suffix="ms"
        value="800"
        label="API Response Time"
        sub="p95 on synchronous calls"
      />
      <StatCol
        tealPart="99.9"
        suffix="%"
        value="99.9"
        label="Uptime SLA"
        sub="Cloudflare + Railway redundancy"
      />
    </div>
  );
}

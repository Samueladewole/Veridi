"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Auth integration placeholder
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      {/* Background subtle gradient */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.03)_0%,_transparent_70%)]" />

      <div className="relative w-full max-w-[380px]">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-amber text-[18px] font-extrabold text-void">
              V
            </div>
            <span className="font-heading text-[24px] font-extrabold tracking-tight text-text1">
              Veridi<span className="text-amber">.</span>
            </span>
          </div>
          <span className="rounded-[3px] border border-amber/20 bg-amber/[0.12] px-3 py-[3px] font-mono text-[9px] uppercase tracking-[0.18em] text-amber">
            Admin Control
          </span>
        </div>

        {/* Login card */}
        <div className="rounded border border-border bg-panel p-6">
          <h1 className="mb-1 font-heading text-[16px] font-bold text-text1">
            Sign in to admin
          </h1>
          <p className="mb-6 font-mono text-[11px] text-text2">
            Authorized personnel only. All sessions are logged.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="email"
                className="font-mono text-[9px] uppercase tracking-[0.14em] text-text3"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@veridi.africa"
                required
                className="rounded-[3px] border border-border-2 bg-deep px-3 py-[10px] font-mono text-[12px] text-text1 outline-none transition-colors placeholder:text-text3 focus:border-amber"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="password"
                className="font-mono text-[9px] uppercase tracking-[0.14em] text-text3"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="rounded-[3px] border border-border-2 bg-deep px-3 py-[10px] font-mono text-[12px] text-text1 outline-none transition-colors placeholder:text-text3 focus:border-amber"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-[3px] bg-amber px-4 py-[10px] font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-void transition-colors hover:bg-[#FCD34D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-[5px] w-[5px] rounded-full bg-green shadow-[0_0_5px_#10B981]" />
            <span className="font-mono text-[9px] tracking-[0.08em] text-text3">
              Protected by Cloudflare Zero Trust
            </span>
          </div>
          <span className="font-mono text-[8px] text-text3/60">
            Session expires after 8 hours of inactivity
          </span>
        </div>
      </div>
    </div>
  );
}

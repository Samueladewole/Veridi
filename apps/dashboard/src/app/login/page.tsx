"use client";

import { useState } from "react";
import type { FormEvent } from "react";

function VeridiLogo() {
  return (
    <div className="mb-8 flex items-center justify-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal font-heading text-lg font-extrabold text-void">
        V
      </div>
      <div>
        <span className="font-heading text-2xl font-extrabold tracking-tight text-text-1">
          Veridi<span className="text-teal">.</span>
        </span>
        <span className="ml-1.5 rounded border border-border-2 bg-panel-2 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-text-3">
          Dashboard
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulated login - in production this would call the auth API
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/[0.03] blur-[120px]" />

      <div className="relative w-full max-w-[380px]">
        <VeridiLogo />

        <div className="rounded-lg border border-border bg-deep p-6">
          {/* Card accent line */}
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/40 to-transparent" />

          <h2 className="mb-1 font-heading text-lg font-bold text-text-1">
            Sign in to your account
          </h2>
          <p className="mb-6 font-mono text-[11px] text-text-3">
            Access your verification dashboard
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-text-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded border border-border-2 bg-panel px-3.5 py-2.5 font-mono text-xs text-text-1 outline-none transition-colors placeholder:text-text-3 focus:border-teal focus:ring-1 focus:ring-teal/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-text-2"
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
                className="w-full rounded border border-border-2 bg-panel px-3.5 py-2.5 font-mono text-xs text-text-1 outline-none transition-colors placeholder:text-text-3 focus:border-teal focus:ring-1 focus:ring-teal/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center rounded bg-teal py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-void transition-all hover:bg-[#00FFDD] disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-void border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <a
              href="#"
              className="font-mono text-[10px] text-text-3 transition-colors hover:text-teal"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[9px] text-text-3">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-teal transition-colors hover:text-[#00FFDD]">
            Contact sales
          </a>
        </p>
      </div>
    </div>
  );
}

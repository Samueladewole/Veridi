"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body: unknown = await res.json();

      if (!res.ok) {
        const errorMessage =
          body && typeof body === "object" && "error" in body
            ? String((body as { error: string }).error)
            : "Authentication failed";
        setError(errorMessage);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-[3px] border border-red/20 bg-red-pale px-3 py-[10px] font-mono text-[11px] text-red">
          {error}
        </div>
      )}

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
            disabled={loading}
            className="rounded-[3px] border border-border-2 bg-deep px-3 py-[10px] font-mono text-[12px] text-text1 outline-none transition-colors placeholder:text-text3 focus:border-amber disabled:opacity-60"
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
            disabled={loading}
            className="rounded-[3px] border border-border-2 bg-deep px-3 py-[10px] font-mono text-[12px] text-text1 outline-none transition-colors placeholder:text-text3 focus:border-amber disabled:opacity-60"
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
    </>
  );
}

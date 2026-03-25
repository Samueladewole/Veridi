"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-20">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-red/20 bg-red-pale">
        <span className="text-2xl text-red">!</span>
      </div>
      <h2 className="mb-2 font-heading text-xl font-bold text-text-1">
        Something went wrong
      </h2>
      <p className="mb-2 max-w-sm text-center font-mono text-xs text-text-3">
        {error.message === "Not authenticated"
          ? "Your session has expired. Please log in again."
          : "Failed to load dashboard data. Please try again."}
      </p>
      {error.digest && (
        <p className="mb-4 font-mono text-[9px] text-text-3">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-[3px] border border-border-2 bg-transparent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-text-2 transition-all hover:border-teal hover:text-teal"
        >
          Try again
        </button>
        <a
          href="/login"
          className="rounded-[3px] bg-teal px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-void transition-all hover:bg-[#00FFDD]"
        >
          Log in
        </a>
      </div>
    </div>
  );
}

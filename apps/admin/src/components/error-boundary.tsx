"use client";

interface ErrorBoundaryProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-[6px] border border-red/15 bg-red-pale text-[28px]">
        !
      </div>
      <h2 className="font-heading text-[18px] font-extrabold text-text1">
        Something went wrong
      </h2>
      <p className="max-w-[400px] text-center font-mono text-[11px] text-text2">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-[3px] border border-amber/20 bg-amber/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-amber transition-colors hover:bg-amber hover:text-void"
      >
        Try Again
      </button>
    </div>
  );
}

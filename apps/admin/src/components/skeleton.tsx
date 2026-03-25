interface SkeletonProps {
  readonly className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-border/50 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div className={`rounded border border-border bg-panel p-4 ${className}`}>
      <Skeleton className="mb-3 h-3 w-[100px]" />
      <Skeleton className="mb-2 h-6 w-[60px]" />
      <Skeleton className="h-2 w-[80px]" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { readonly rows?: number }) {
  return (
    <div className="rounded border border-border bg-panel">
      <div className="border-b border-border px-4 py-[14px]">
        <Skeleton className="h-3 w-[120px]" />
      </div>
      <div className="p-4">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <Skeleton className="h-6 w-6 rounded-[3px]" />
            <Skeleton className="h-3 w-[120px]" />
            <Skeleton className="h-3 w-[80px]" />
            <Skeleton className="h-3 w-[60px]" />
            <div className="flex-1" />
            <Skeleton className="h-3 w-[40px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

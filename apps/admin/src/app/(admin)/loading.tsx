import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/skeleton";

export default function AdminLoading() {
  return (
    <>
      {/* System status skeleton */}
      <div className="flex items-center gap-5 rounded border border-border-2 bg-panel px-4 py-[10px]">
        <Skeleton className="h-3 w-[50px]" />
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-[7px] w-[7px] rounded-full" />
            <Skeleton className="h-3 w-[70px]" />
          </div>
        ))}
      </div>

      {/* KPI grid skeleton */}
      <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Two column skeleton */}
      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-2">
        <SkeletonTable rows={4} />
        <SkeletonTable rows={4} />
      </div>

      {/* Table skeleton */}
      <SkeletonTable rows={6} />
    </>
  );
}

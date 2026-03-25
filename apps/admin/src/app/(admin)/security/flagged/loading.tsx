import { SkeletonTable } from "@/components/skeleton";

export default function FlaggedLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="h-6 w-[160px] animate-pulse rounded bg-border/50" />
        <div className="h-3 w-[400px] animate-pulse rounded bg-border/50" />
      </div>
      <SkeletonTable rows={5} />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-md border border-border bg-panel p-5">
      <div className="mb-3 h-3 w-24 rounded bg-border" />
      <div className="mb-2 h-8 w-20 rounded bg-border" />
      <div className="h-2.5 w-32 rounded bg-border" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="animate-pulse overflow-hidden rounded-md border border-border bg-panel">
      <div className="border-b border-border px-5 py-4">
        <div className="h-4 w-28 rounded bg-border" />
        <div className="mt-1.5 h-2.5 w-40 rounded bg-border" />
      </div>
      <div className="flex items-end gap-2 px-5 pb-4 pt-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-border"
            style={{ height: `${30 + Math.random() * 120}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="animate-pulse overflow-hidden rounded-md border border-border bg-panel">
      <div className="border-b border-border px-5 py-4">
        <div className="h-4 w-40 rounded bg-border" />
        <div className="mt-1.5 h-2.5 w-56 rounded bg-border" />
      </div>
      <div className="p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="mb-3 flex gap-4">
            <div className="h-3 w-24 rounded bg-border" />
            <div className="h-3 w-12 rounded bg-border" />
            <div className="h-3 w-16 rounded bg-border" />
            <div className="h-3 w-10 rounded bg-border" />
            <div className="h-3 flex-1 rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonWidget() {
  return (
    <div className="animate-pulse overflow-hidden rounded-md border border-border bg-panel">
      <div className="border-b border-border px-5 py-4">
        <div className="h-4 w-20 rounded bg-border" />
      </div>
      <div className="p-4">
        <div className="mb-3 h-10 rounded bg-border" />
        <div className="h-10 rounded bg-border" />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <>
      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Chart + Breakdown */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <SkeletonChart />
        <SkeletonWidget />
      </div>

      {/* Table + Widgets */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <SkeletonTable />
        <div className="flex flex-col gap-3.5">
          <SkeletonWidget />
          <SkeletonWidget />
        </div>
      </div>
    </>
  );
}

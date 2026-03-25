import { VerificationQueue } from "@/components/verification-queue";
import { fetchQueueItems } from "@/lib/dashboard-data";

export default async function FlaggedCallsPage() {
  const { items, pendingCount } = await fetchQueueItems();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
          Flagged Calls
        </h1>
        <p className="mt-1 font-mono text-[11px] text-text2">
          API calls flagged by the security engine for suspicious patterns. High-frequency
          bursts, unusual IP ranges, and potential abuse require investigation.
        </p>
      </div>
      <VerificationQueue items={items} pendingCount={pendingCount} />
    </div>
  );
}

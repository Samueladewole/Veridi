import { VerificationQueue } from "@/components/verification-queue";
import { fetchQueueItems } from "@/lib/dashboard-data";

export default async function VerificationQueuePage() {
  const { items, pendingCount } = await fetchQueueItems();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
          Verification Queue
        </h1>
        <p className="mt-1 font-mono text-[11px] text-text2">
          Review pending verifications that require manual approval. NIN mismatches,
          flagged background checks, and edge cases await your decision.
        </p>
      </div>
      <VerificationQueue items={items} pendingCount={pendingCount} />
    </div>
  );
}

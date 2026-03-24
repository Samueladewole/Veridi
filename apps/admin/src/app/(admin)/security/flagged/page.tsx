import { PageStub } from "@/components/page-stub";

export default function FlaggedCallsPage() {
  return (
    <PageStub
      title="Flagged Calls"
      description="API calls flagged by the security engine for suspicious patterns. High-frequency bursts, unusual IP ranges, and potential abuse require investigation."
      icon="\uD83D\uDEA9"
    />
  );
}

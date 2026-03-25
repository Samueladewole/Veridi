import { AuditLog } from "@/components/audit-log";
import { fetchAuditLog } from "@/lib/dashboard-data";

export default async function AuditLogPage() {
  const entries = await fetchAuditLog();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
          Audit Log
        </h1>
        <p className="mt-1 font-mono text-[11px] text-text2">
          Immutable record of all administrative actions. Every approval, rejection,
          configuration change, and system event is permanently logged for compliance.
        </p>
      </div>
      <AuditLog entries={entries} />
    </div>
  );
}

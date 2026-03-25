import { Card, CardHeader } from "@/components/card";
import { getSecurityConfig } from "@/lib/mock-api";

export default async function ConfigurationPage() {
  const config = await getSecurityConfig();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
          Configuration
        </h1>
        <p className="mt-1 font-mono text-[11px] text-text2">
          Platform-wide settings including rate limits, provider configurations,
          notification preferences, feature flags, and admin user management.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Rate Limiting" />
          <div className="flex flex-col gap-3 p-4">
            <ConfigRow
              label="Status"
              value={config.rateLimiting.enabled ? "Enabled" : "Disabled"}
              valueClass={config.rateLimiting.enabled ? "text-green" : "text-red"}
            />
            <ConfigRow
              label="Max Requests"
              value={`${config.rateLimiting.maxRequests} per window`}
            />
            <ConfigRow
              label="Window"
              value={`${config.rateLimiting.windowMs / 1000}s`}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Security" />
          <div className="flex flex-col gap-3 p-4">
            <ConfigRow
              label="MFA Required"
              value={config.mfaRequired ? "Yes" : "No"}
              valueClass={config.mfaRequired ? "text-green" : "text-amber"}
            />
            <ConfigRow
              label="Session Timeout"
              value={`${config.sessionTimeout / 3600}h`}
            />
            <ConfigRow
              label="IP Whitelist"
              value={`${config.ipWhitelist.length} ranges`}
            />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="IP Whitelist" />
        <div className="flex flex-col gap-1 p-4">
          {config.ipWhitelist.map((ip) => (
            <div
              key={ip}
              className="rounded-[3px] border border-border bg-panel-2 px-3 py-2 font-mono text-[11px] text-text1"
            >
              {ip}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ConfigRow({
  label,
  value,
  valueClass,
}: {
  readonly label: string;
  readonly value: string;
  readonly valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] text-text2">{label}</span>
      <span className={`font-mono text-[11px] ${valueClass ?? "text-text1"}`}>
        {value}
      </span>
    </div>
  );
}

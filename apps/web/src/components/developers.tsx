import { SectionHeader } from "./section-header";

const sdks = [
  { icon: "🟢", name: "Node.js SDK", version: "@veridi/node · v1.0.0", cmd: "npm install @veridi/node" },
  { icon: "🐍", name: "Python SDK", version: "veridi-python · v1.0.0", cmd: "pip install veridi" },
  { icon: "🐘", name: "PHP SDK", version: "veridi/php · v1.0.0", cmd: "composer require veridi/php" },
  { icon: "📱", name: "React Native SDK", version: "@veridi/react-native · Phase 2", cmd: "Coming Q3 2026" },
];

const apiSpecs = [
  {
    method: "POST",
    methodClass: "bg-[rgba(0,212,180,0.15)] text-[var(--teal)]",
    path: "/v1/verify/nin",
    comment: "// Verify National Identification Number",
    fields: [
      { key: "nin", type: "string", desc: "required · 11 digits" },
      { key: "consent_token", type: "string", desc: "required · expires 10min" },
      { key: "webhook_url", type: "string", desc: "optional · async callback" },
    ],
  },
  {
    method: "GET",
    methodClass: "bg-[rgba(240,168,48,0.15)] text-[var(--gold)]",
    path: "/v1/verify/{reference}",
    comment: "// Poll async verification result",
    fields: [
      { key: "reference", type: "string", desc: "required · from POST response" },
    ],
    result: "→ verified · confidence · match_fields",
  },
  {
    method: "POST",
    methodClass: "bg-[rgba(0,212,180,0.15)] text-[var(--teal)]",
    path: "/v1/face/liveness",
    comment: "// Passive liveness detection",
    fields: [
      { key: "image", type: "base64", desc: "required · selfie" },
      { key: "consent_token", type: "string", desc: "required" },
    ],
    result: "→ liveness · confidence · spoof_detected",
  },
];

export function Developers() {
  return (
    <section className="relative px-6 md:px-16 py-[120px] z-[2] overflow-hidden" id="devs">
      <div className="absolute left-[-200px] bottom-[-200px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,212,180,0.05),transparent_65%)]" />

      <SectionHeader
        label="For Developers"
        title={<>Built by engineers,<br /><em className="text-[var(--slate)]">for engineers</em></>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-md:gap-12 items-start mt-[72px]">
        {/* SDK cards */}
        <div className="flex flex-col gap-3">
          {sdks.map((sdk) => (
            <div
              key={sdk.name}
              className="bg-[var(--panel)] border border-[var(--border2)] rounded-[3px] px-[22px] py-[18px] flex items-center gap-4 hover:border-[var(--teal)] hover:translate-x-[6px] transition-all"
            >
              <span className="text-[24px] shrink-0">{sdk.icon}</span>
              <div>
                <div className="font-[Syne] font-semibold text-[14px] text-white mb-[3px]">
                  {sdk.name}
                </div>
                <div className="font-mono text-[10px] text-[var(--teal)] tracking-[0.1em]">
                  {sdk.version}
                </div>
              </div>
              <div className="ml-auto font-mono text-[10px] text-[var(--slate2)] bg-[var(--panel2)] px-[10px] py-1 rounded-[2px] border border-[var(--border)]">
                {sdk.cmd}
              </div>
            </div>
          ))}
        </div>

        {/* API specs */}
        <div>
          <p className="font-mono text-[13px] font-light leading-[1.75] text-[var(--text2)] mb-10">
            REST API with OpenAPI 3.1 spec. Interactive playground at veridi.io. SDKs that feel
            natural in your stack. Integration guides for Next.js, NestJS, Laravel, and Django.
          </p>
          {apiSpecs.map((spec, i) => (
            <div
              key={i}
              className="bg-[var(--panel)] border border-[var(--border2)] rounded-[3px] overflow-hidden mb-6"
            >
              <div className="bg-[var(--panel2)] px-5 py-3 border-b border-[var(--border)] flex items-center gap-[10px]">
                <span
                  className={`font-mono text-[10px] font-semibold tracking-[0.1em] px-2 py-[2px] rounded-[2px] ${spec.methodClass}`}
                >
                  {spec.method}
                </span>
                <span className="font-mono text-[12px] text-[var(--text)] tracking-[0.04em]">
                  {spec.path}
                </span>
              </div>
              <div className="px-5 py-4 font-mono text-[11px] leading-[1.8]">
                <div className="text-[var(--slate2)] italic">{spec.comment}</div>
                {spec.fields.map((f) => (
                  <div key={f.key}>
                    <span className="text-[#79B8FF]">{f.key}</span>
                    {"  "}
                    <span className="text-[#85E89D]">{f.type}</span>
                    {"  "}
                    <span className="text-[var(--slate2)] italic">{f.desc}</span>
                  </div>
                ))}
                {spec.result && (
                  <div className="text-[var(--teal)] font-medium">{spec.result}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { SectionHeader } from "./section-header";

const steps = [
  {
    num: "01",
    title: "Get your API key",
    desc: "Sign up at veridi.africa, create a client account, and generate your first API key. Free tier includes 100 verifications per month with full sandbox access.",
  },
  {
    num: "02",
    title: "Embed the consent widget",
    desc: "Drop the Veridi Consent widget into your onboarding flow. Your users confirm consent, and Veridi issues a signed consent_token. NDPA-compliant from day one.",
  },
  {
    num: "03",
    title: "Call the verification API",
    desc: "Pass the document number and consent token. Veridi validates, checks cache, queries the government database, and returns a result — all in under 800ms.",
  },
  {
    num: "04",
    title: "Receive via webhook",
    desc: "For async calls (police records, background checks), Veridi fires an HMAC-signed webhook to your endpoint. Result is cached for 24 hours — no repeated charges.",
  },
];

const terminalLines = [
  { type: "prompt", content: "$ POST /v1/verify/nin" },
  { type: "blank", content: "" },
  { type: "header", key: "Authorization:", value: "Bearer vrd_live_sk_..." },
  { type: "header", key: "Content-Type:", value: "application/json" },
  { type: "blank", content: "" },
  { type: "comment", content: "// Request body" },
  { type: "raw", content: "{" },
  { type: "field", key: '"nin":', value: '"12345678901"', comma: true },
  { type: "field", key: '"consent_token":', value: '"eyJhbG..."', comma: false },
  { type: "raw", content: "}" },
  { type: "blank", content: "" },
  { type: "comment", content: "// ✓ Response 200 · 612ms" },
  { type: "raw", content: "{" },
  { type: "field", key: '"verified":', value: "true", comma: true, isNum: true },
  { type: "field", key: '"confidence":', value: "98", comma: true, isNum: true },
  { type: "field", key: '"reference":', value: '"vrd_nin_3xK9m..."', comma: true },
  { type: "field", key: '"match_fields":', value: '["name", "dob"]', comma: true, isRaw: true },
  { type: "field", key: '"source":', value: '"nimc_nvs"', comma: false },
  { type: "raw", content: "}" },
  { type: "blank", content: "" },
  { type: "success", content: "✓ Identity verified · NIMC · Cached 24h" },
];

export function HowItWorks() {
  return (
    <section
      className="relative px-6 md:px-16 py-[120px] bg-[var(--deep)] border-y border-[var(--border)] overflow-hidden"
      id="how"
    >
      <div className="absolute right-[-200px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,212,180,0.05)_0%,transparent_65%)]" />

      <SectionHeader
        label="Integration Flow"
        title={
          <>
            Integrate in
            <br />
            <em className="text-[var(--slate)]">under 30 minutes</em>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[100px] max-md:gap-12 items-start mt-[72px]">
        {/* Steps */}
        <div className="flex flex-col">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group flex gap-6 py-7 border-b border-[var(--border)] first:border-t first:border-[var(--border)]"
            >
              <div className="font-mono text-[13px] text-[var(--slate3)] tracking-[0.1em] shrink-0 pt-[3px] w-8 group-hover:text-[var(--teal)] transition-colors">
                {step.num}
              </div>
              <div>
                <div className="font-[Syne] font-semibold text-[16px] text-white mb-2 tracking-[-0.01em] group-hover:text-[var(--teal)] transition-colors">
                  {step.title}
                </div>
                <p className="font-mono text-[12px] font-light leading-[1.7] text-[var(--text2)]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Terminal */}
        <div className="sticky top-[120px] bg-[var(--panel)] border border-[var(--border2)] rounded overflow-hidden">
          <div className="bg-[var(--panel2)] px-4 py-3 flex items-center gap-2 border-b border-[var(--border)]">
            <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]" />
            <div className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]" />
            <div className="w-[10px] h-[10px] rounded-full bg-[#28CA41]" />
            <span className="ml-2 font-mono text-[11px] text-[var(--slate2)] tracking-[0.08em]">
              veridi — verification live
            </span>
          </div>
          <div className="p-6 font-mono text-[12px] leading-[1.9]">
            {terminalLines.map((line, i) => {
              if (line.type === "blank") return <div key={i}>&nbsp;</div>;
              if (line.type === "prompt")
                return (
                  <div key={i}>
                    <span className="text-[var(--teal)]">$</span>{" "}
                    <span className="text-white">{line.content?.replace("$ ", "")}</span>
                  </div>
                );
              if (line.type === "header")
                return (
                  <div key={i}>
                    <span className="text-[#79B8FF]">{line.key}</span>{" "}
                    <span className="text-[#85E89D]">{line.value}</span>
                  </div>
                );
              if (line.type === "comment")
                return (
                  <div key={i} className="text-[var(--slate3)] italic">
                    {line.content}
                  </div>
                );
              if (line.type === "raw")
                return (
                  <div key={i} className="text-[var(--slate3)]">
                    {line.content}
                  </div>
                );
              if (line.type === "field")
                return (
                  <div key={i}>
                    &nbsp;&nbsp;
                    <span className="text-[#79B8FF]">{line.key}</span>{" "}
                    <span
                      className={
                        line.isNum
                          ? "text-[var(--gold)]"
                          : line.isRaw
                            ? "text-[var(--slate3)]"
                            : "text-[#85E89D]"
                      }
                    >
                      {line.value}
                    </span>
                    {line.comma && <span className="text-[var(--slate3)]">,</span>}
                  </div>
                );
              if (line.type === "success")
                return (
                  <div key={i} className="text-[var(--teal)] font-medium">
                    {line.content}
                  </div>
                );
              return null;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

interface PageStubProps {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export function PageStub({ title, description, icon }: PageStubProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      {/* Icon container */}
      <div className="flex h-16 w-16 items-center justify-center rounded-[6px] border border-amber/15 bg-amber-pale text-[28px]">
        {icon}
      </div>

      {/* Title */}
      <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
        {title}
      </h1>

      {/* Description */}
      <p className="max-w-[420px] text-center font-mono text-[11px] leading-[1.7] text-text2">
        {description}
      </p>

      {/* Coming soon badge */}
      <div className="mt-2 rounded-[3px] border border-amber/20 bg-amber/[0.08] px-4 py-[6px] font-mono text-[10px] uppercase tracking-[0.14em] text-amber">
        Coming Soon
      </div>

      {/* Decorative line */}
      <div className="mt-4 h-px w-[120px] bg-gradient-to-r from-transparent via-amber/30 to-transparent" />
    </div>
  );
}

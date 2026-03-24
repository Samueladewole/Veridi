interface SectionHeaderProps {
  label: string;
  title: React.ReactNode;
  description?: string;
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-[14px] mb-6">
        <div className="w-8 h-px bg-[var(--teal)]" />
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--teal)]">
          {label}
        </div>
      </div>
      <h2 className="font-serif text-[clamp(38px,4.5vw,62px)] font-normal leading-[1.08] tracking-[-0.02em] text-white mb-5">
        {title}
      </h2>
      {description && (
        <p className="font-mono text-[13px] font-light leading-[1.75] text-[var(--text2)] max-w-[480px] mb-[72px]">
          {description}
        </p>
      )}
    </>
  );
}

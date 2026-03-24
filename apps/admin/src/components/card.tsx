interface CardProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

interface CardHeaderProps {
  readonly title: string;
  readonly badges?: readonly {
    readonly label: string;
    readonly variant: "red" | "amber" | "green" | "blue";
  }[];
  readonly actions?: React.ReactNode;
}

const BADGE_VARIANTS: Record<string, string> = {
  red: "bg-red-pale text-red border border-red/15",
  amber: "bg-amber-pale text-amber border border-amber/15",
  green: "bg-green-pale text-green border border-green/15",
  blue: "bg-blue-pale text-blue border border-blue/15",
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded border border-border bg-panel ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, badges, actions }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-[14px]">
      <div className="flex items-center gap-[10px]">
        <h3 className="text-[12px] font-bold tracking-[-0.01em]">{title}</h3>
        {badges?.map((badge) => (
          <span
            key={badge.label}
            className={`rounded-[2px] px-[7px] py-[2px] font-mono text-[9px] tracking-[0.08em] ${BADGE_VARIANTS[badge.variant]}`}
          >
            {badge.label}
          </span>
        ))}
      </div>
      {actions && <div className="flex gap-[6px]">{actions}</div>}
    </div>
  );
}

export function CardHeaderButton({
  children,
  variant = "default",
  onClick,
}: {
  readonly children: React.ReactNode;
  readonly variant?: "default" | "danger";
  readonly onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-[3px] border border-border-2 bg-transparent px-3 py-[5px]
        font-mono text-[10px] text-text2 transition-colors
        ${variant === "danger" ? "hover:border-red hover:text-red" : "hover:border-amber hover:text-amber"}
      `}
    >
      {children}
    </button>
  );
}

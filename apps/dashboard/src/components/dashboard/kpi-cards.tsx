import type { KpiCard } from "@/lib/mock-data";
import { Icon } from "@/components/icons";

const sparkColors: Record<KpiCard["color"], string> = {
  teal: "#00D4B4",
  gold: "#F0A830",
  blue: "#3B82F6",
  green: "#22C55E",
};

const topLineColors: Record<KpiCard["color"], string> = {
  teal: "from-teal to-transparent",
  gold: "from-gold to-transparent",
  blue: "from-blue to-transparent",
  green: "from-green to-transparent",
};

const deltaIcons: Record<KpiCard["deltaType"], string> = {
  up: "\u2191",
  down: "\u2193",
  neutral: "",
};

const deltaColors: Record<KpiCard["deltaType"], string> = {
  up: "text-green",
  down: "text-red",
  neutral: "text-text-3",
};

function KpiCardItem({ card }: { card: KpiCard }) {
  return (
    <div className="group relative cursor-default overflow-hidden rounded-md border border-border bg-panel p-5 transition-colors hover:border-border-2">
      <div
        className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${topLineColors[card.color]}`}
      />

      <svg
        className="absolute bottom-0 right-0 h-10 w-20 opacity-15"
        viewBox="0 0 80 40"
      >
        <polyline
          points={card.sparkPoints}
          fill="none"
          stroke={sparkColors[card.color]}
          strokeWidth="1.5"
        />
      </svg>

      <div className="mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-2">
        <Icon name={card.icon} size={13} className="opacity-60" />
        {card.label}
      </div>

      <div className="mb-2 font-heading text-[30px] font-extrabold leading-none tracking-tight text-text-1">
        {card.value}
        <span className="text-sm font-medium text-text-2">{card.unit}</span>
      </div>

      <div
        className={`flex items-center gap-1 font-mono text-[10px] ${deltaColors[card.deltaType]}`}
      >
        {deltaIcons[card.deltaType]} {card.delta}
      </div>
    </div>
  );
}

export function KpiCards({ data }: { data: KpiCard[] }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((card) => (
        <KpiCardItem key={card.label} card={card} />
      ))}
    </div>
  );
}

export function formatNaira(amount: number): string {
  if (amount >= 1_000_000) return `\u20A6${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `\u20A6${(amount / 1_000).toFixed(0)}k`;
  return `\u20A6${amount}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type PlanTier = "Growth" | "Starter" | "Scale" | "Enterprise";
type AccountStatus = "active" | "pending" | "suspended";

const PLAN_MAP: Record<string, PlanTier> = {
  growth: "Growth",
  starter: "Starter",
  scale: "Scale",
  enterprise: "Enterprise",
};

const STATUS_MAP: Record<string, AccountStatus> = {
  active: "active",
  pending: "pending",
  suspended: "suspended",
};

export function tierToPlan(tier: string): PlanTier {
  return PLAN_MAP[tier.toLowerCase()] ?? "Starter";
}

export function statusToAccountStatus(status: string): AccountStatus {
  return STATUS_MAP[status.toLowerCase()] ?? "active";
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

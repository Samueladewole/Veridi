export type VerificationType = "NIN" | "BVN" | "FACE" | "BG";
export type VerificationStatus = "Verified" | "Failed" | "Pending";

export interface KpiCard {
  label: string;
  icon: string;
  value: string;
  unit: string;
  delta: string;
  deltaType: "up" | "down" | "neutral";
  color: "teal" | "gold" | "blue" | "green";
  sparkPoints: string;
}

export interface EndpointBreakdown {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RecentCall {
  reference: string;
  type: VerificationType;
  status: VerificationStatus;
  confidence: string;
  latency: number;
  timestamp: string;
}

export interface WebhookDelivery {
  method: string;
  path: string;
  ago: string;
  ok: boolean;
}

export interface ApiKey {
  name: string;
  description: string;
  env: "live" | "test";
  maskedKey: string;
}

export interface ChartBar {
  hour: string;
  value: number;
}

export const kpiCards: KpiCard[] = [
  {
    label: "Total Verifications",
    icon: "zap",
    value: "2,847",
    unit: " calls",
    delta: "18.4% vs yesterday",
    deltaType: "up",
    color: "teal",
    sparkPoints: "0,35 10,28 20,30 30,18 40,22 50,10 60,14 70,6 80,8",
  },
  {
    label: "Verified",
    icon: "check",
    value: "2,611",
    unit: " /2847",
    delta: "91.7% success rate",
    deltaType: "up",
    color: "gold",
    sparkPoints: "0,32 10,26 20,28 30,16 40,20 50,8 60,12 70,4 80,6",
  },
  {
    label: "Avg Latency",
    icon: "clock",
    value: "612",
    unit: " ms",
    delta: "34ms vs yesterday",
    deltaType: "down",
    color: "blue",
    sparkPoints: "0,20 10,24 20,18 30,22 40,14 50,18 60,12 70,16 80,10",
  },
  {
    label: "Monthly Spend",
    icon: "wallet",
    value: "₦142k",
    unit: " /200k",
    delta: "71% of plan limit",
    deltaType: "neutral",
    color: "green",
    sparkPoints: "0,38 10,34 20,30 30,28 40,24 50,20 60,16 70,13 80,10",
  },
];

export const chartBars: ChartBar[] = [
  { hour: "00", value: 18 },
  { hour: "02", value: 12 },
  { hour: "04", value: 22 },
  { hour: "06", value: 45 },
  { hour: "08", value: 120 },
  { hour: "10", value: 210 },
  { hour: "12", value: 280 },
  { hour: "14", value: 260 },
  { hour: "16", value: 195 },
  { hour: "18", value: 245 },
  { hour: "20", value: 310 },
  { hour: "22", value: 280 },
];

export const endpointBreakdowns: EndpointBreakdown[] = [
  { name: "/verify/nin", count: 1847, percentage: 78, color: "var(--teal)" },
  { name: "/verify/bvn", count: 412, percentage: 34, color: "#3B82F6" },
  { name: "/face/liveness", count: 308, percentage: 22, color: "var(--gold)" },
  { name: "/face/match", count: 196, percentage: 14, color: "#8B5CF6" },
  { name: "/background/request", count: 84, percentage: 7, color: "#EC4899" },
];

export const recentCalls: RecentCall[] = [
  { reference: "vrd_nin_3xK9m", type: "NIN", status: "Verified", confidence: "94%", latency: 612, timestamp: "just now" },
  { reference: "vrd_bvn_8mR2p", type: "BVN", status: "Verified", confidence: "91%", latency: 420, timestamp: "3m ago" },
  { reference: "vrd_fc_7nQ1k", type: "FACE", status: "Verified", confidence: "96%", latency: 895, timestamp: "6m ago" },
  { reference: "vrd_nin_2pL4w", type: "BG", status: "Failed", confidence: "—", latency: 310, timestamp: "9m ago" },
  { reference: "vrd_bg_5tS8r", type: "NIN", status: "Pending", confidence: "—", latency: 1240, timestamp: "12m ago" },
  { reference: "vrd_nin_9kM2x", type: "BVN", status: "Verified", confidence: "89%", latency: 580, timestamp: "15m ago" },
  { reference: "vrd_bvn_4jN6v", type: "FACE", status: "Verified", confidence: "93%", latency: 445, timestamp: "18m ago" },
  { reference: "vrd_fc_1qA3z", type: "BG", status: "Failed", confidence: "—", latency: 730, timestamp: "21m ago" },
];

export const webhookDeliveries: WebhookDelivery[] = [
  { method: "POST", path: "tendr.ng/api/webhook/veridi", ago: "12s ago", ok: true },
  { method: "POST", path: "tendr.ng/api/webhook/veridi", ago: "1m ago", ok: true },
  { method: "POST", path: "tendr.ng/api/webhook/veridi", ago: "4m ago · Retry 2/5", ok: false },
  { method: "POST", path: "tendr.ng/api/webhook/veridi", ago: "8m ago", ok: true },
];

export const apiKeys: ApiKey[] = [
  {
    name: "Production Key",
    description: "Last used 3 mins ago",
    env: "live",
    maskedKey: "vrd_live_sk_••••••••3kZ9",
  },
  {
    name: "Sandbox Key",
    description: "Used for testing",
    env: "test",
    maskedKey: "vrd_test_sk_••••••••8mR2",
  },
];

export interface SidebarNavItem {
  icon: string;
  label: string;
  badge?: number;
  badgeType?: "default" | "warn";
  href: string;
  external?: boolean;
}

export interface SidebarSection {
  title: string;
  items: SidebarNavItem[];
}

export const sidebarSections: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { icon: "hexagon", label: "Dashboard", href: "/" },
      { icon: "chart", label: "Analytics", href: "/analytics" },
      { icon: "zap", label: "Live Calls", badge: 3, href: "/live" },
    ],
  },
  {
    title: "Verification",
    items: [
      { icon: "id-card", label: "Veridi ID", href: "/verifications/id" },
      { icon: "user", label: "Veridi Face", href: "/verifications/face" },
      { icon: "clipboard", label: "Background Checks", badge: 2, badgeType: "warn", href: "/verifications/background" },
      { icon: "map-pin", label: "Address", href: "/verifications/address" },
      { icon: "star", label: "Veridi Score", href: "/verifications/score" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { icon: "key", label: "API Keys", href: "/api-keys" },
      { icon: "bell", label: "Webhooks", href: "/webhooks" },
      { icon: "users", label: "Team", href: "/team" },
      { icon: "credit-card", label: "Billing", href: "/billing" },
      { icon: "scroll", label: "Audit Log", href: "/audit-log" },
      { icon: "book", label: "API Docs", href: "https://docs.veridi.africa", external: true },
    ],
  },
];

export type PlanTier = "Growth" | "Starter" | "Scale" | "Enterprise";
export type AccountStatus = "active" | "pending" | "suspended";
export type FilterStatus = "all" | AccountStatus;

export interface ClientRecord {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly email: string;
  readonly plan: PlanTier;
  readonly status: AccountStatus;
  readonly calls30d: string;
  readonly callsTotal: string;
  readonly mrr: string;
  readonly joined: string;
  readonly lastActive: string;
  readonly apiKeyPrefix: string;
}

export const CLIENTS: readonly ClientRecord[] = [
  {
    id: "cl_01",
    name: "Tendr.ng",
    initials: "TN",
    email: "api@tendr.ng",
    plan: "Growth",
    status: "active",
    calls30d: "84,291",
    callsTotal: "412,800",
    mrr: "\u20A6200k",
    joined: "Jan 2026",
    lastActive: "2 min ago",
    apiKeyPrefix: "vrd_live_8kP",
  },
  {
    id: "cl_02",
    name: "QuickHire Ltd",
    initials: "QH",
    email: "dev@quickhire.com.ng",
    plan: "Starter",
    status: "pending",
    calls30d: "\u2014",
    callsTotal: "\u2014",
    mrr: "\u20A60",
    joined: "Mar 2026",
    lastActive: "Onboarding",
    apiKeyPrefix: "vrd_test_2nX",
  },
  {
    id: "cl_03",
    name: "MedStaff NG",
    initials: "MS",
    email: "tech@medstaff.ng",
    plan: "Scale",
    status: "active",
    calls30d: "210,847",
    callsTotal: "1.8M",
    mrr: "\u20A6750k",
    joined: "Nov 2025",
    lastActive: "4 min ago",
    apiKeyPrefix: "vrd_live_3mQ",
  },
  {
    id: "cl_04",
    name: "Logistics247",
    initials: "L2",
    email: "api@logistics247.ng",
    plan: "Growth",
    status: "active",
    calls30d: "52,410",
    callsTotal: "248,100",
    mrr: "\u20A6200k",
    joined: "Dec 2025",
    lastActive: "1 hr ago",
    apiKeyPrefix: "vrd_live_9rT",
  },
  {
    id: "cl_05",
    name: "TrustPay Africa",
    initials: "TP",
    email: "engineering@trustpay.africa",
    plan: "Enterprise",
    status: "active",
    calls30d: "1.2M",
    callsTotal: "8.4M",
    mrr: "Custom",
    joined: "Oct 2025",
    lastActive: "12 min ago",
    apiKeyPrefix: "vrd_live_1aB",
  },
  {
    id: "cl_06",
    name: "Kareful App",
    initials: "KA",
    email: "dev@kareful.app",
    plan: "Starter",
    status: "active",
    calls30d: "9,841",
    callsTotal: "18,200",
    mrr: "\u20A650k",
    joined: "Feb 2026",
    lastActive: "3 hr ago",
    apiKeyPrefix: "vrd_live_5gH",
  },
  {
    id: "cl_07",
    name: "DomestiqNG",
    initials: "DN",
    email: "api@domestiq.ng",
    plan: "Growth",
    status: "suspended",
    calls30d: "18,240",
    callsTotal: "72,400",
    mrr: "\u20A60",
    joined: "Dec 2025",
    lastActive: "5 days ago",
    apiKeyPrefix: "vrd_live_7tG",
  },
  {
    id: "cl_08",
    name: "SecureID Solutions",
    initials: "SI",
    email: "tech@secureid.com.ng",
    plan: "Scale",
    status: "active",
    calls30d: "142,300",
    callsTotal: "620,000",
    mrr: "\u20A6500k",
    joined: "Sep 2025",
    lastActive: "8 min ago",
    apiKeyPrefix: "vrd_live_4wE",
  },
  {
    id: "cl_09",
    name: "PayQuick NG",
    initials: "PQ",
    email: "dev@payquick.ng",
    plan: "Growth",
    status: "active",
    calls30d: "67,890",
    callsTotal: "310,500",
    mrr: "\u20A6200k",
    joined: "Nov 2025",
    lastActive: "25 min ago",
    apiKeyPrefix: "vrd_live_6fJ",
  },
  {
    id: "cl_10",
    name: "HealthFirst Africa",
    initials: "HF",
    email: "api@healthfirst.africa",
    plan: "Enterprise",
    status: "pending",
    calls30d: "\u2014",
    callsTotal: "\u2014",
    mrr: "Custom",
    joined: "Mar 2026",
    lastActive: "KYB Review",
    apiKeyPrefix: "vrd_test_0cM",
  },
];

export const PLAN_STYLES: Record<PlanTier, string> = {
  Growth: "bg-amber-pale text-amber border border-amber/15",
  Starter: "bg-blue-pale text-blue border border-blue/15",
  Scale: "bg-purple-pale text-purple border border-purple/15",
  Enterprise: "bg-green-pale text-green border border-green/15",
};

export const STATUS_STYLES: Record<AccountStatus, string> = {
  active: "bg-green-pale text-green border border-green/15",
  pending: "bg-amber-pale text-amber border border-amber/15",
  suspended: "bg-red-pale text-red border border-red/15",
};

export const FILTER_TABS: readonly { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
];

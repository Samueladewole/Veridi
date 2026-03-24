export const API_VERSION = "v1";

export const VERIFICATION_TYPES = [
  "NIN",
  "BVN",
  "PASSPORT",
  "DRIVERS_LICENCE",
  "VOTERS_CARD",
  "TIN",
] as const;

export type VerificationType = (typeof VERIFICATION_TYPES)[number];

export const PLAN_LIMITS: Record<string, { calls: number; price: number }> = {
  STARTER: { calls: 100, price: 0 },
  GROWTH: { calls: 3000, price: 200000 },
  SCALE: { calls: 10000, price: 500000 },
  ENTERPRISE: { calls: -1, price: -1 }, // custom
};

export const ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  CONSENT_EXPIRED: "CONSENT_EXPIRED",
  CONSENT_INVALID: "CONSENT_INVALID",
  VERIFICATION_FAILED: "VERIFICATION_FAILED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export const SCORE_BANDS = {
  TRUSTED: { min: 800, max: 1000, label: "Trusted" },
  ESTABLISHED: { min: 600, max: 799, label: "Established" },
  EMERGING: { min: 400, max: 599, label: "Emerging" },
  NEW: { min: 200, max: 399, label: "New" },
  UNVERIFIED: { min: 0, max: 199, label: "Unverified" },
} as const;

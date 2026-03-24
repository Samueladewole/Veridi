import { SCORE_BANDS } from "../constants";

export function maskApiKey(key: string): string {
  if (key.length < 16) return "••••••••";
  const prefix = key.slice(0, 12);
  const suffix = key.slice(-4);
  return `${prefix}${"•".repeat(8)}${suffix}`;
}

export function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function getScoreBand(score: number): string {
  for (const band of Object.values(SCORE_BANDS)) {
    if (score >= band.min && score <= band.max) {
      return band.label;
    }
  }
  return "Unknown";
}

export function truncateReference(ref: string): string {
  if (ref.length <= 12) return ref;
  return `${ref.slice(0, 9)}...`;
}

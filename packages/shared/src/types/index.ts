// API response types

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
  requestId: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
  statusCode: number;
  requestId: string;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  _meta: PaginationMeta;
}

// Verification types
export interface VerificationResult {
  verified: boolean;
  confidence: number;
  reference_id: string;
  match_fields: string[];
  source: string;
  cached: boolean;
  ms: number;
}

export interface FaceLivenessResult {
  liveness: boolean;
  confidence: number;
  spoof_detected: boolean;
  reference_id: string;
  ms: number;
}

export interface FaceMatchResult {
  match: boolean;
  similarity: number;
  reference_id: string;
  ms: number;
}

export interface BackgroundCheckResult {
  request_id: string;
  status: string;
  check_types: string[];
  report_url: string | null;
  requested_at: string;
  completed_at: string | null;
}

export interface ScoreResult {
  score: number | null;
  band?: string;
  verification_count?: number;
  last_verified_at: string | null;
  score_updated_at: string | null;
}

export interface ConsentTokenResult {
  consent_token: string;
  expires_at: string;
}

// Client & admin types
export interface ClientSummary {
  id: string;
  name: string;
  email: string;
  tier: string;
  status: string;
  callsThisMonth: number;
  createdAt: string;
}

export interface ApiKeySummary {
  id: string;
  name: string;
  keyPrefix: string;
  isLive: boolean;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface AdminStats {
  total_clients: number;
  active_clients: number;
  calls_today: number;
  calls_month: number;
  mrr: number;
  error_rate_24h: number;
  queue_depth: number;
  failed_webhooks: number;
}

export interface QueueStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

export interface DataSourceHealth {
  name: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  lastSuccess: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

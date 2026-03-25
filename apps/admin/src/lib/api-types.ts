/** API response shapes for admin endpoints */

export interface AdminStatsResponse {
  total_clients: number;
  active_clients: number;
  calls_today: number;
  calls_month: number;
  mrr: number;
  error_rate_24h: number;
  queue_depth: number;
  failed_webhooks: number;
}

export interface ClientApiItem {
  id: string;
  name: string;
  email: string;
  tier: string;
  status: string;
  callsThisMonth: number;
  createdAt: string;
}

export interface ClientsApiResponse {
  data: ClientApiItem[];
  _meta: { page: number; limit: number; total: number; pages: number };
}

export interface VerificationApiItem {
  id: string;
  type: string;
  clientName: string;
  status: string;
  confidence: number;
  createdAt: string;
  reason?: string;
}

export interface VerificationsApiResponse {
  data: VerificationApiItem[];
  _meta: { page: number; limit: number; total: number; pages: number };
}

export interface AuditApiItem {
  id: string;
  action: string;
  actor: string;
  entity: string;
  createdAt: string;
}

export interface AuditApiResponse {
  data: AuditApiItem[];
  _meta: { page: number; limit: number; total: number; pages: number };
}

export interface FlaggedApiItem {
  id: string;
  type: string;
  clientName: string;
  reason: string;
  severity: string;
  createdAt: string;
}

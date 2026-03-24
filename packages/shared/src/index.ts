// Types
export type {
  ApiSuccess,
  ApiError,
  PaginationMeta,
  PaginatedResponse,
  VerificationResult,
  FaceLivenessResult,
  FaceMatchResult,
  BackgroundCheckResult,
  ScoreResult,
  ConsentTokenResult,
  ClientSummary,
  ApiKeySummary,
  AdminStats,
  QueueStatus,
  DataSourceHealth,
  TokenPair,
} from "./types";

// API Clients
export { VeridiClient } from "./api/client";
export { AdminClient } from "./api/admin-client";

// Constants
export {
  API_VERSION,
  VERIFICATION_TYPES,
  PLAN_LIMITS,
  ERROR_CODES,
  SCORE_BANDS,
} from "./constants";
export type { VerificationType } from "./constants";

// Utils
export {
  maskApiKey,
  formatNGN,
  getScoreBand,
  truncateReference,
} from "./utils";

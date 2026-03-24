import axios, { type AxiosInstance, type AxiosError } from "axios";
import type {
  ApiSuccess,
  VerificationResult,
  FaceLivenessResult,
  FaceMatchResult,
  BackgroundCheckResult,
  ScoreResult,
  ConsentTokenResult,
} from "../types";

interface VeridiClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export class VeridiClient {
  private readonly http: AxiosInstance;

  constructor(options: VeridiClientOptions) {
    this.http = axios.create({
      baseURL: options.baseUrl || "https://api.veridi.africa",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Retry on 429
    this.http.interceptors.response.use(undefined, async (error: AxiosError) => {
      const config = error.config;
      if (!config || error.response?.status !== 429) throw error;

      const retryAfter = Number(error.response.headers["retry-after"]) || 2;
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      return this.http.request(config);
    });
  }

  // Verification
  async verifyNIN(params: { nin: string; consent_token: string }) {
    const { data } = await this.http.post<ApiSuccess<VerificationResult>>("/v1/verify/nin", params);
    return data.data;
  }

  async verifyBVN(params: { bvn: string; consent_token: string }) {
    const { data } = await this.http.post<ApiSuccess<VerificationResult>>("/v1/verify/bvn", params);
    return data.data;
  }

  async verifyDriversLicence(params: { licence_number: string; consent_token: string }) {
    const { data } = await this.http.post<ApiSuccess<VerificationResult>>("/v1/verify/drivers-licence", params);
    return data.data;
  }

  async verifyPassport(params: { passport_number: string; consent_token: string }) {
    const { data } = await this.http.post<ApiSuccess<VerificationResult>>("/v1/verify/passport", params);
    return data.data;
  }

  async getVerification(referenceId: string) {
    const { data } = await this.http.get<ApiSuccess<VerificationResult>>(`/v1/verify/${referenceId}`);
    return data.data;
  }

  // Consent
  async issueConsentToken(params: { purpose: string; subject_id: string }) {
    const { data } = await this.http.post<ApiSuccess<ConsentTokenResult>>("/v1/verify/consent", params);
    return data.data;
  }

  // Face
  async livenessCheck(params: { image: string; consent_token: string }) {
    const { data } = await this.http.post<ApiSuccess<FaceLivenessResult>>("/v1/face/liveness", params);
    return data.data;
  }

  async faceMatch(params: {
    selfie: string;
    reference_nin?: string;
    reference_image?: string;
    consent_token: string;
  }) {
    const { data } = await this.http.post<ApiSuccess<FaceMatchResult>>("/v1/face/match", params);
    return data.data;
  }

  // Background
  async requestBackgroundCheck(params: {
    subject_nin: string;
    consent_token: string;
    check_types: string[];
    webhook_url?: string;
  }) {
    const { data } = await this.http.post<ApiSuccess<BackgroundCheckResult>>("/v1/background/request", params);
    return data.data;
  }

  async getBackgroundCheck(requestId: string) {
    const { data } = await this.http.get<ApiSuccess<BackgroundCheckResult>>(`/v1/background/${requestId}`);
    return data.data;
  }

  // Score
  async getScore(subjectToken: string) {
    const { data } = await this.http.get<ApiSuccess<ScoreResult>>(`/v1/score/${subjectToken}`);
    return data.data;
  }
}

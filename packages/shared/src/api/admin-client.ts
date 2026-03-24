import axios, { type AxiosInstance } from "axios";
import type {
  ApiSuccess,
  AdminStats,
  ClientSummary,
  PaginatedResponse,
  TokenPair,
} from "../types";

interface AdminClientOptions {
  baseUrl?: string;
}

export class AdminClient {
  private readonly http: AxiosInstance;
  private accessToken: string | null = null;

  constructor(options: AdminClientOptions = {}) {
    this.http = axios.create({
      baseURL: options.baseUrl || "https://api.veridi.africa",
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    });

    this.http.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });
  }

  setToken(token: string): void {
    this.accessToken = token;
  }

  // Auth
  async login(email: string, password: string) {
    const { data } = await this.http.post<ApiSuccess<TokenPair>>("/auth/admin/login", {
      email,
      password,
    });
    this.accessToken = data.data.accessToken;
    return data.data;
  }

  async refresh(refreshToken: string) {
    const { data } = await this.http.post<ApiSuccess<TokenPair>>("/auth/admin/refresh", {
      refreshToken,
    });
    this.accessToken = data.data.accessToken;
    return data.data;
  }

  // Dashboard
  async getStats() {
    const { data } = await this.http.get<ApiSuccess<AdminStats>>("/admin/dashboard/stats");
    return data.data;
  }

  // Clients
  async getClients(filters?: { status?: string; tier?: string; page?: number; limit?: number }) {
    const { data } = await this.http.get<ApiSuccess<PaginatedResponse<ClientSummary>>>("/admin/clients", {
      params: filters,
    });
    return data.data;
  }

  async getClient(id: string) {
    const { data } = await this.http.get<ApiSuccess<ClientSummary>>(`/admin/clients/${id}`);
    return data.data;
  }

  async approveClient(id: string) {
    const { data } = await this.http.put<ApiSuccess<{ success: boolean }>>(`/admin/clients/${id}/approve`);
    return data.data;
  }

  async suspendClient(id: string) {
    const { data } = await this.http.put<ApiSuccess<{ success: boolean }>>(`/admin/clients/${id}/suspend`);
    return data.data;
  }

  // Verifications
  async getVerifications(filters?: { status?: string; type?: string; clientId?: string; page?: number }) {
    const { data } = await this.http.get("/admin/verifications", { params: filters });
    return data.data;
  }

  async overrideVerification(id: string, result: { status: string; confidence: number; reason: string }) {
    const { data } = await this.http.put(`/admin/verifications/${id}/override`, result);
    return data.data;
  }

  // Queue & data sources
  async getQueueStatus() {
    const { data } = await this.http.get("/admin/queue");
    return data.data;
  }

  async getDataSources() {
    const { data } = await this.http.get("/admin/data-sources");
    return data.data;
  }

  // Audit
  async getAuditLog(filters?: { action?: string; adminId?: string; page?: number; limit?: number }) {
    const { data } = await this.http.get("/admin/audit-log", { params: filters });
    return data.data;
  }
}

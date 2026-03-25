import { adminFetch, ApiError } from "./api";
import {
  getInitials,
  tierToPlan,
  statusToAccountStatus,
  formatNumber,
} from "./format-helpers";
import type { ClientApiItem, ClientsApiResponse } from "./api-types";
import type { ClientRecord } from "@/components/clients-data";

function mapClientToRecord(c: ClientApiItem): ClientRecord {
  return {
    id: c.id,
    name: c.name,
    initials: getInitials(c.name),
    email: c.email,
    plan: tierToPlan(c.tier),
    status: statusToAccountStatus(c.status),
    calls30d: formatNumber(c.callsThisMonth),
    callsTotal: "--",
    mrr: "--",
    joined: new Date(c.createdAt).toLocaleDateString("en-NG", {
      month: "short",
      year: "numeric",
    }),
    lastActive: "--",
    apiKeyPrefix: "vrd_...",
  };
}

export async function fetchAllClients(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<readonly ClientRecord[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.status && params.status !== "all") {
      searchParams.set("status", params.status);
    }
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));

    const query = searchParams.toString();
    const path = `/admin/clients${query ? `?${query}` : ""}`;
    const response = await adminFetch<ClientsApiResponse>(path);

    return response.data.map(mapClientToRecord);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) throw error;
    return [];
  }
}

export async function fetchClientDetail(
  id: string
): Promise<ClientRecord | null> {
  try {
    const client = await adminFetch<ClientApiItem>(`/admin/clients/${id}`);
    return mapClientToRecord(client);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) throw error;
    return null;
  }
}

import { getSession, refreshSession } from "./auth";

const API_URL = process.env.API_URL || "http://localhost:3000";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function adminFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const session = await getSession();
  if (!session) throw new ApiError("Not authenticated", 401);

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    const newSession = await refreshSession();
    if (!newSession) throw new ApiError("Session expired", 401);

    const retryRes = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${newSession.accessToken}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!retryRes.ok) {
      throw new ApiError(
        `API error: ${retryRes.statusText}`,
        retryRes.status
      );
    }

    const retryJson: unknown = await retryRes.json();
    return extractData<T>(retryJson);
  }

  if (!res.ok) {
    throw new ApiError(`API error: ${res.statusText}`, res.status);
  }

  const json: unknown = await res.json();
  return extractData<T>(json);
}

function extractData<T>(json: unknown): T {
  if (
    json &&
    typeof json === "object" &&
    "data" in json &&
    (json as Record<string, unknown>).data !== undefined
  ) {
    return (json as Record<string, unknown>).data as T;
  }
  return json as T;
}

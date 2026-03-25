import { getSession } from "./auth";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getBaseUrl(): string {
  return process.env.API_URL || "http://localhost:3000";
}

export async function apiGet<T>(
  path: string,
  options?: { revalidate?: number },
): Promise<T> {
  const session = await getSession();
  if (!session) throw new ApiError("Not authenticated", 401);

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${session.apiKey}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: options?.revalidate ?? 30 },
  });

  if (!res.ok) {
    throw new ApiError(`API error: ${res.status}`, res.status);
  }

  const json = (await res.json()) as { data: T };
  return json.data;
}

export async function apiPost<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const session = await getSession();
  if (!session) throw new ApiError("Not authenticated", 401);

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ApiError(`API error: ${res.status}`, res.status);
  }

  const json = (await res.json()) as { data: T };
  return json.data;
}

/**
 * Validate an API key by calling the health/ping endpoint.
 * Returns true if the key is valid, false otherwise.
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/v1/health`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

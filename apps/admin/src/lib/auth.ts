import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const API_URL = process.env.API_URL || "http://localhost:3000";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "veridi-admin-secret"
);

const ACCESS_TOKEN_COOKIE = "admin_access_token";
const REFRESH_TOKEN_COOKIE = "admin_refresh_token";

const ACCESS_MAX_AGE = 900; // 15 minutes
const REFRESH_MAX_AGE = 604800; // 7 days

interface AdminSession {
  readonly accessToken: string;
  readonly email: string;
  readonly sub: string;
  readonly role: string;
}

interface TokenPayload {
  readonly sub: string;
  readonly email: string;
  readonly role: string;
}

interface LoginResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body && typeof body === "object" && "error" in body
        ? String(body.error)
        : "Invalid credentials";
    throw new Error(message);
  }

  const json = await res.json();
  const data: LoginResponse = json.data ?? json;

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ACCESS_MAX_AGE,
    path: "/",
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_MAX_AGE,
    path: "/",
  });

  return data;
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) return null;

  try {
    const { payload } = await jwtVerify(accessToken, JWT_SECRET);
    const tokenPayload = payload as unknown as TokenPayload;

    return {
      accessToken,
      email: tokenPayload.email ?? "",
      sub: tokenPayload.sub ?? "",
      role: tokenPayload.role ?? "admin",
    };
  } catch {
    // Token expired or invalid — try refresh
    return null;
  }
}

export async function refreshSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/admin/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data: LoginResponse = json.data ?? json;

    cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    });
    cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_MAX_AGE,
      path: "/",
    });

    const { payload } = await jwtVerify(data.accessToken, JWT_SECRET);
    const tokenPayload = payload as unknown as TokenPayload;

    return {
      accessToken: data.accessToken,
      email: tokenPayload.email ?? "",
      sub: tokenPayload.sub ?? "",
      role: tokenPayload.role ?? "admin",
    };
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  // Best effort: call API logout
  if (accessToken) {
    await fetch(`${API_URL}/auth/admin/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }).catch(() => {
      // Ignore network errors during logout
    });
  }

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  if (session) return session.accessToken;

  const refreshed = await refreshSession();
  return refreshed?.accessToken ?? null;
}

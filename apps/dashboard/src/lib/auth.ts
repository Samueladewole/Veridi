import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "veridi_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

export interface SessionPayload {
  clientId: string;
  clientName: string;
  email: string;
  tier: string;
  apiKey: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.DASHBOARD_SECRET;
  if (!secret) {
    throw new Error("DASHBOARD_SECRET environment variable is required");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(data: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());

    return {
      clientId: payload.clientId as string,
      clientName: payload.clientName as string,
      email: payload.email as string,
      tier: payload.tier as string,
      apiKey: payload.apiKey as string,
    };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

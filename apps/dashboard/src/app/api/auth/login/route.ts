import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { validateApiKey } from "@/lib/api";

interface LoginRequestBody {
  apiKey: string;
  email?: string;
}

function isValidLoginBody(body: unknown): body is LoginRequestBody {
  if (typeof body !== "object" || body === null) return false;
  const obj = body as Record<string, unknown>;
  return typeof obj.apiKey === "string" && obj.apiKey.length > 0;
}

/**
 * MVP login: client provides their API key.
 * We validate it against the Veridi API, then create a session.
 *
 * Once client auth endpoints exist in the API, this will be replaced
 * with proper email/password authentication.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();

    if (!isValidLoginBody(body)) {
      return NextResponse.json(
        { success: false, error: "API key is required" },
        { status: 400 },
      );
    }

    const { apiKey, email } = body;

    // Validate the API key against the real Veridi API
    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
      // For MVP/development: allow a demo key to bypass API validation
      const demoKey = process.env.DEMO_API_KEY;
      if (!demoKey || apiKey !== demoKey) {
        return NextResponse.json(
          { success: false, error: "Invalid API key" },
          { status: 401 },
        );
      }
    }

    // Create session with client info
    // In production, this data would come from the API's key lookup response
    await createSession({
      clientId: "client_demo_001",
      clientName: "Demo Organization",
      email: email ?? "developer@demo.veridi.africa",
      tier: "Growth",
      apiKey,
    });

    return NextResponse.json({
      success: true,
      client: {
        name: "Demo Organization",
        tier: "Growth",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

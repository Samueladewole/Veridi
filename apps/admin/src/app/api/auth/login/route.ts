import { NextResponse } from "next/server";
import { login } from "@/lib/auth";

interface LoginBody {
  email: string;
  password: string;
}

function isValidLoginBody(body: unknown): body is LoginBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    "password" in body &&
    typeof (body as LoginBody).email === "string" &&
    typeof (body as LoginBody).password === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidLoginBody(body)) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email.trim() || !password.trim()) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await login(email, password);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

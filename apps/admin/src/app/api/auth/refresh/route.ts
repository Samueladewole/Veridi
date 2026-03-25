import { NextResponse } from "next/server";
import { refreshSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await refreshSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unable to refresh session" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to refresh session" },
      { status: 401 }
    );
  }
}

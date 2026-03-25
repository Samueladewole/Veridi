import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ success: true });
  } catch {
    // Even if logout fails, clear cookies
    return NextResponse.json({ success: true });
  }
}

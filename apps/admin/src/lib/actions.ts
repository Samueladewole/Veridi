"use server";

import { revalidatePath } from "next/cache";
import { adminFetch } from "./api";

interface ActionResult {
  readonly success: boolean;
  readonly error?: string;
}

export async function approveClient(clientId: string): Promise<ActionResult> {
  try {
    await adminFetch(`/admin/clients/${clientId}/approve`, {
      method: "PUT",
    });
    revalidatePath("/clients");
    revalidatePath("/clients/pending");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to approve client",
    };
  }
}

export async function suspendClient(clientId: string): Promise<ActionResult> {
  try {
    await adminFetch(`/admin/clients/${clientId}/suspend`, {
      method: "PUT",
    });
    revalidatePath("/clients");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to suspend client",
    };
  }
}

export async function overrideVerification(
  verificationId: string,
  result: { status: string; confidence: number; reason: string }
): Promise<ActionResult> {
  try {
    await adminFetch(`/admin/verifications/${verificationId}/override`, {
      method: "PUT",
      body: JSON.stringify(result),
    });
    revalidatePath("/queue");
    revalidatePath("/security/flagged");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to override verification",
    };
  }
}

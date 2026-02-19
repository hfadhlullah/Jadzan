"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/supabase";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

async function getAuthenticatedUserAndMosque() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const { data: mosque, error: mosqueError } = await supabase
    .from("mosques")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (mosqueError || !mosque)
    throw new Error("Mosque not found. Please save mosque settings first.");

  return { supabase, user, mosqueId: mosque.id };
}

/** Generate a unique 6-digit numeric pairing code. */
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─────────────────────────────────────────────────────────────
// getScreens — list all screens for this mosque
// ─────────────────────────────────────────────────────────────

export async function getScreens() {
  const { supabase, mosqueId } = await getAuthenticatedUserAndMosque();

  const { data, error } = await supabase
    .from("screens")
    .select("*")
    .eq("mosque_id", mosqueId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─────────────────────────────────────────────────────────────
// pairScreen — Admin submits a 6-digit pairing code
// Links the PENDING screen to this mosque and marks it ACTIVE.
// ─────────────────────────────────────────────────────────────

export async function pairScreen(
  code: string,
  name: string
): Promise<{ success: true } | { success: false; error: string }> {
  if (!/^\d{6}$/.test(code)) {
    return { success: false, error: "Pairing code must be exactly 6 digits." };
  }
  if (!name.trim()) {
    return { success: false, error: "Screen name is required." };
  }

  const { supabase, mosqueId } = await getAuthenticatedUserAndMosque();

  // Find the PENDING screen with this pairing code
  const { data: screen, error: findError } = await supabase
    .from("screens")
    .select("id, status")
    .eq("pairing_code", code)
    .eq("status", "PENDING")
    .is("mosque_id", null)
    .maybeSingle();

  if (findError) return { success: false, error: findError.message };
  if (!screen) {
    return {
      success: false,
      error: "Invalid or expired code. Make sure the TV is showing this code.",
    };
  }

  // Link screen to mosque
  const updatePayload: TablesUpdate<"screens"> = {
    mosque_id: mosqueId,
    name: name.trim(),
    status: "ACTIVE",
    pairing_code: null, // clear code once paired
    last_seen: new Date().toISOString(),
  };

  const { error: updateError } = await supabase
    .from("screens")
    .update(updatePayload)
    .eq("id", screen.id);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath("/dashboard/screens");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// registerScreen — TV calls this on first boot to create a
// PENDING screen row and get a pairing code back.
// ─────────────────────────────────────────────────────────────

export async function registerScreen(): Promise<
  { success: true; code: string; screenId: string } | { success: false; error: string }
> {
  // TV uses the anon client (no auth) — use service role or anon insert policy
  const { createClient: createAnonClient } = await import("@/lib/supabase/client");
  const supabase = createAnonClient();

  // Generate a unique code
  let code = generateCode();
  let attempts = 0;
  while (attempts < 5) {
    const { data: existing } = await supabase
      .from("screens")
      .select("id")
      .eq("pairing_code", code)
      .maybeSingle();
    if (!existing) break;
    code = generateCode();
    attempts++;
  }

  const insertPayload: TablesInsert<"screens"> = {
    pairing_code: code,
    status: "PENDING",
  };

  const { data, error } = await supabase
    .from("screens")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to register screen." };
  }

  return { success: true, code, screenId: data.id };
}

// ─────────────────────────────────────────────────────────────
// deleteScreen
// ─────────────────────────────────────────────────────────────

export async function deleteScreen(
  screenId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const { supabase, mosqueId } = await getAuthenticatedUserAndMosque();

  const { error } = await supabase
    .from("screens")
    .delete()
    .eq("id", screenId)
    .eq("mosque_id", mosqueId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/screens");
  return { success: true };
}

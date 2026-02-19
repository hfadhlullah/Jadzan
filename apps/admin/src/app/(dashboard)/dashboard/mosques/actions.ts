"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/supabase";

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const IqomahDelaysSchema = z.object({
  fajr:    z.number().min(0).max(60),
  dhuhr:   z.number().min(0).max(60),
  asr:     z.number().min(0).max(60),
  maghrib: z.number().min(0).max(60),
  isha:    z.number().min(0).max(60),
});

const UpsertMosqueSchema = z.object({
  name:               z.string().min(1, "Name is required"),
  latitude:           z.number().min(-90).max(90),
  longitude:          z.number().min(-180).max(180),
  timezone:           z.string().min(1, "Timezone is required"),
  calculation_method: z.string().min(1),
  iqomah_delays:      IqomahDelaysSchema,
});

export type IqomahDelays = z.infer<typeof IqomahDelaysSchema>;
export type UpsertMosqueInput = z.infer<typeof UpsertMosqueSchema>;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return { supabase, user };
}

// ─────────────────────────────────────────────────────────────
// getMosque
// ─────────────────────────────────────────────────────────────

export async function getMosque() {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("mosques")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

// ─────────────────────────────────────────────────────────────
// upsertMosque
// ─────────────────────────────────────────────────────────────

export async function upsertMosque(
  input: UpsertMosqueInput
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = UpsertMosqueSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { supabase, user } = await getAuthenticatedUser();

  // Check if mosque already exists for this user
  const { data: existing } = await supabase
    .from("mosques")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let dbError;

  if (existing) {
    const updatePayload: TablesUpdate<"mosques"> = {
      name:               parsed.data.name,
      latitude:           parsed.data.latitude,
      longitude:          parsed.data.longitude,
      timezone:           parsed.data.timezone,
      calculation_method: parsed.data.calculation_method,
      iqomah_delays:      parsed.data.iqomah_delays,
    };
    const { error } = await supabase
      .from("mosques")
      .update(updatePayload)
      .eq("id", existing.id);
    dbError = error;
  } else {
    const insertPayload: TablesInsert<"mosques"> = {
      user_id:            user.id,
      name:               parsed.data.name,
      latitude:           parsed.data.latitude,
      longitude:          parsed.data.longitude,
      timezone:           parsed.data.timezone,
      calculation_method: parsed.data.calculation_method,
      iqomah_delays:      parsed.data.iqomah_delays,
    };
    const { error } = await supabase
      .from("mosques")
      .insert(insertPayload);
    dbError = error;
  }

  if (dbError) return { success: false, error: dbError.message };

  revalidatePath("/dashboard/mosques");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// updateIqomahDelays
// ─────────────────────────────────────────────────────────────

export async function updateIqomahDelays(
  delays: IqomahDelays
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = IqomahDelaysSchema.safeParse(delays);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { supabase, user } = await getAuthenticatedUser();

  const { data: existing } = await supabase
    .from("mosques")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    return { success: false, error: "Mosque not found. Please save mosque settings first." };
  }

  const { error } = await supabase
    .from("mosques")
    .update({ iqomah_delays: parsed.data })
    .eq("id", existing.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/mosques");
  return { success: true };
}

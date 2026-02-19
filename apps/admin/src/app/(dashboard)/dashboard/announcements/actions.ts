"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/supabase";

async function getAuthContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) throw new Error("Unauthorized");

  const { data: mosque, error: mosqueErr } = await supabase
    .from("mosques")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (mosqueErr || !mosque)
    throw new Error("Mosque not found. Please configure mosque settings first.");

  return { supabase, user, mosqueId: mosque.id };
}

export async function getAnnouncements() {
  const { supabase, mosqueId } = await getAuthContext();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("mosque_id", mosqueId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createAnnouncement(text: string) {
  const { supabase, mosqueId } = await getAuthContext();

  const payload: TablesInsert<"announcements"> = {
    mosque_id: mosqueId,
    text,
    is_active: true,
  };

  const { error } = await supabase.from("announcements").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/announcements");
}

export async function updateAnnouncement(id: string, updates: Partial<TablesUpdate<"announcements">>) {
  const { supabase, mosqueId } = await getAuthContext();

  const { error } = await supabase
    .from("announcements")
    .update(updates)
    .eq("id", id)
    .eq("mosque_id", mosqueId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/announcements");
}

export async function deleteAnnouncement(id: string) {
  const { supabase, mosqueId } = await getAuthContext();

  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id)
    .eq("mosque_id", mosqueId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/announcements");
}

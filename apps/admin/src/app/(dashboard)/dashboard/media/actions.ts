"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/types/supabase";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

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

const STORAGE_BUCKET = "media";

// ─────────────────────────────────────────────────────────────
// getMediaItems
// ─────────────────────────────────────────────────────────────

export async function getMediaItems() {
  const { supabase, mosqueId } = await getAuthContext();

  const { data, error } = await supabase
    .from("media_content")
    .select("*")
    .eq("mosque_id", mosqueId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─────────────────────────────────────────────────────────────
// uploadMedia — JADZ-020
// ─────────────────────────────────────────────────────────────

export async function uploadMedia(
  formData: FormData
): Promise<{ success: true } | { success: false; error: string }> {
  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string | null)?.trim();
  const durationStr = formData.get("duration") as string | null;

  if (!file) return { success: false, error: "No file provided." };
  if (!title) return { success: false, error: "Title is required." };

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) {
    return { success: false, error: "Only image or video files are supported." };
  }

  const maxBytes = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024; // 200MB video / 10MB image
  if (file.size > maxBytes) {
    return {
      success: false,
      error: `File too large. Max ${isVideo ? "200MB" : "10MB"}.`,
    };
  }

  const { supabase, mosqueId } = await getAuthContext();

  // Build storage path: media/{mosqueId}/{timestamp}_{filename}
  const ext = file.name.split(".").pop() ?? "bin";
  const storageKey = `${mosqueId}/${Date.now()}_${crypto.randomUUID()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storageKey, file, { contentType: file.type, upsert: false });

  if (uploadErr) return { success: false, error: uploadErr.message };

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storageKey);

  const payload: TablesInsert<"media_content"> = {
    mosque_id:   mosqueId,
    title,
    type:        isVideo ? "VIDEO" : "IMAGE",
    storage_key: storageKey,
    url:         urlData.publicUrl,
    duration:    isVideo && durationStr ? parseInt(durationStr, 10) : null,
  };

  const { error: dbErr } = await supabase.from("media_content").insert(payload);

  if (dbErr) {
    // Cleanup orphaned file
    await supabase.storage.from(STORAGE_BUCKET).remove([storageKey]);
    return { success: false, error: dbErr.message };
  }

  revalidatePath("/dashboard/media");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// deleteMedia — JADZ-021
// ─────────────────────────────────────────────────────────────

export async function deleteMedia(
  mediaId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const { supabase, mosqueId } = await getAuthContext();

  // Fetch to verify ownership + get storage key
  const { data: item, error: fetchErr } = await supabase
    .from("media_content")
    .select("id, storage_key")
    .eq("id", mediaId)
    .eq("mosque_id", mosqueId)
    .maybeSingle();

  if (fetchErr || !item) {
    return { success: false, error: "Media not found or access denied." };
  }

  // Delete from storage
  if (item.storage_key) {
    await supabase.storage.from(STORAGE_BUCKET).remove([item.storage_key]);
  }

  // Delete DB row (cascade removes targeted_media rows)
  const { error: dbErr } = await supabase
    .from("media_content")
    .delete()
    .eq("id", mediaId);

  if (dbErr) return { success: false, error: dbErr.message };

  revalidatePath("/dashboard/media");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// getScreensWithTargets — JADZ-025
// Returns screens plus which media IDs are targeted to each
// ─────────────────────────────────────────────────────────────

export async function getScreensWithTargets() {
  const { supabase, mosqueId } = await getAuthContext();

  const [screensResult, targetsResult] = await Promise.all([
    supabase
      .from("screens")
      .select("id, name, status")
      .eq("mosque_id", mosqueId),
    supabase
      .from("targeted_media")
      .select("screen_id, media_id"),
  ]);

  if (screensResult.error) throw new Error(screensResult.error.message);

  const screens  = screensResult.data ?? [];
  const targets  = targetsResult.data ?? [];

  return screens.map((screen) => ({
    ...screen,
    targetedMediaIds: targets
      .filter((t) => t.screen_id === screen.id)
      .map((t) => t.media_id),
  }));
}

// ─────────────────────────────────────────────────────────────
// setMediaTarget — JADZ-025
// Toggle a media item on/off for a specific screen
// ─────────────────────────────────────────────────────────────

export async function setMediaTarget(
  mediaId: string,
  screenId: string,
  enabled: boolean
): Promise<{ success: true } | { success: false; error: string }> {
  const { supabase } = await getAuthContext();

  if (enabled) {
    const { error } = await supabase
      .from("targeted_media")
      .upsert({ media_id: mediaId, screen_id: screenId });
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("targeted_media")
      .delete()
      .eq("media_id", mediaId)
      .eq("screen_id", screenId);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/media");
  return { success: true };
}

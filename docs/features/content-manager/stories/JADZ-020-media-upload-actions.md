# JADZ-020: Media Upload & CRUD Server Actions

**Epic:** CORE - Content Manager
**Layer:** L3-backend
**Role:** Backend
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Implement server actions for uploading media files to Supabase Storage and managing `media_content` records (create, list, toggle active, delete). Also handles the `targeted_media` junction for screen-specific assignment.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/media/actions.ts`
*   **Functions:**
    *   `uploadMedia(formData: FormData): Promise<{ id: string; url: string }>` — Uploads file to storage bucket, inserts `media_content` row, returns new record.
    *   `getMediaList(): Promise<MediaContent[]>` — Lists all media for current mosque.
    *   `toggleMedia(id: string, isActive: boolean): Promise<void>` — Activates/deactivates media.
    *   `deleteMedia(id: string): Promise<void>` — Deletes record + removes file from storage.
    *   `assignMediaToScreens(mediaId: string, screenIds: string[] | null): Promise<void>` — `null` = all screens; array = specific screens.
*   **Storage Path**: `media_uploads/{mosque_id}/{uuid}-{filename}`
*   **Validation (Zod):**
    *   File type: `image/jpeg`, `image/png`, `image/webp`, `video/mp4`.
    *   File size: max 50MB.
    *   `label`: required string.
    *   `duration`: integer, min 3, max 300 seconds.

## Acceptance Criteria (Technical)
*   [ ] `uploadMedia()` with a valid JPG → file in storage, `media_content` row created, URL returned.
*   [ ] `uploadMedia()` with unsupported file type → returns `{ error: 'Unsupported file type' }`.
*   [ ] `uploadMedia()` with file > 50MB → returns `{ error: 'File too large' }`.
*   [ ] `deleteMedia()` removes both the DB row AND the file from storage.
*   [ ] `assignMediaToScreens(id, null)` removes all `targeted_media` rows for that media (broadcasts to all).
*   [ ] `assignMediaToScreens(id, ['screen-id-1'])` inserts correct `targeted_media` rows.
*   [ ] Admin can only manage media belonging to their mosque (RLS enforced).

## Business Rules & Logic
*   Deleting media must remove the file from Supabase Storage to avoid orphaned files.
*   `targeted_media` is replaced (not appended) on each `assignMediaToScreens` call.
*   `is_active = false` does not delete media — it just hides it from the TV.

## Dependencies
*   Depends on: JADZ-001, JADZ-004

## Definition of Done
*   [ ] All server actions implemented and type-safe.
*   [ ] Zod schemas in place.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

# JADZ-022: Admin — Media Manager Page

**Epic:** CORE - Content Manager
**Layer:** L4-feature-ui
**Role:** Frontend (Admin)
**Estimation:** 3 Points
**Priority:** Must

---

## Objective
Build the Media Manager page in the Admin Panel: a drag-and-drop file upload zone, a grid of uploaded media with thumbnails, and controls to toggle active state, set duration, assign to screens, and delete.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/media/page.tsx` (Server Component — loads media list + screens)
    *   `apps/admin/app/(dashboard)/media/MediaUploader.tsx` (Client Component — drag-and-drop upload)
    *   `apps/admin/app/(dashboard)/media/MediaGrid.tsx` (Client Component — media card grid)
    *   `apps/admin/app/(dashboard)/media/MediaCard.tsx` (Individual card component)
*   **`MediaUploader` behavior:**
    *   Drag-and-drop zone or click-to-select file input.
    *   Shows upload progress bar.
    *   Accepts: JPG, PNG, WebP, MP4. Rejects others with inline error.
    *   After upload: adds card to grid without page reload (optimistic update).
*   **`MediaCard` shows:**
    *   Thumbnail (image preview or video icon).
    *   Label (editable inline).
    *   Duration input (seconds).
    *   Active/Inactive toggle switch.
    *   Screen assignment select (multi-select: "All Screens" or specific screen names).
    *   Delete button (with confirm dialog).

## Acceptance Criteria (Technical)
*   [ ] Drag-and-drop zone accepts valid files and shows upload progress.
*   [ ] Invalid file type dropped → error toast "Unsupported format".
*   [ ] After upload, new card appears in grid immediately (optimistic UI).
*   [ ] Toggle switch calls `toggleMedia()` and updates visually without full reload.
*   [ ] Delete calls `deleteMedia()` — shows confirm dialog first — removes card on confirm.
*   [ ] Screen assignment multi-select shows all screens for the mosque.
*   [ ] Empty state: "No media uploaded yet. Upload your first image or video."

## Business Rules & Logic
*   "All Screens" is the default assignment (no `targeted_media` rows = broadcast to all).
*   Video thumbnails show a generic video icon (no actual video thumbnail generation in MVP).
*   Duration field minimum = 3 seconds, maximum = 300 seconds.

## Dependencies
*   Depends on: JADZ-005 (Admin Shell), JADZ-012 (getScreens for assignment dropdown), JADZ-020 (Server Actions)

## Definition of Done
*   [ ] Upload, grid, toggle, delete all functional.
*   [ ] Screen assignment saves correctly.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

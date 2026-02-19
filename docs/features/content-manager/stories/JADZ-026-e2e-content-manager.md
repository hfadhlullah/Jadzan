# JADZ-026: E2E — Admin Uploads Media → TV Displays It

**Epic:** CORE - Content Manager
**Layer:** L5-integration
**Role:** Fullstack
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Validate the complete content pipeline: Admin uploads media and adds an announcement → TV syncs and displays both in the carousel and ticker — within 1 minute.

## Technical Specifications
*   **Test Method:** Manual smoke test.
    *   One Admin browser session (Web Dashboard).
    *   One running TV app (Android emulator or device).
    *   Supabase Dashboard for DB/Storage verification.

## Acceptance Criteria (Technical)

### Media Upload Flow
*   [ ] Admin navigates to `/dashboard/media` → uploads a PNG file "test-poster.png".
*   [ ] File appears in Supabase Storage under `media_uploads/{mosque_id}/`.
*   [ ] `media_content` row created with correct URL, type="IMAGE", `is_active=true`.
*   [ ] Within 60 seconds, TV carousel shows the new image without manual restart.
*   [ ] Image is cached locally on TV (verify: disconnect internet → image still shows).

### Announcement Flow
*   [ ] Admin navigates to `/dashboard/announcements` → adds "Test: Kegiatan besok jam 08:00".
*   [ ] Announcement appears in list with `is_active=true`.
*   [ ] Within 60 seconds, new text appears in TV news ticker.

### Toggle Flow
*   [ ] Admin deactivates the announcement → within 60s, text disappears from TV ticker.
*   [ ] Admin deactivates the media → within 60s, image removed from TV carousel rotation.

### Delete Flow
*   [ ] Admin deletes media → row removed from DB + file removed from Supabase Storage.
*   [ ] TV removes it from carousel on next sync cycle.

## Business Rules & Logic
*   If TV sync takes > 60s, investigate Supabase Realtime subscription in `JADZ-024`/`JADZ-025`.
*   If cached image persists after deactivation, ensure `mediaService` re-validates cache against active list on each sync.

## Dependencies
*   Depends on: JADZ-020, JADZ-021, JADZ-022, JADZ-023, JADZ-024, JADZ-025

## Definition of Done
*   [ ] All acceptance criteria verified manually.
*   [ ] Cache verified (offline persistence works).
*   [ ] No console errors on TV or Admin.
*   [ ] `bun run lint` passes on both apps.

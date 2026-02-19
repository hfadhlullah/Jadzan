# JADZ-024: TV — Media Carousel Component (Zone B)

**Epic:** CORE - Content Manager
**Layer:** L4-feature-ui
**Role:** Frontend (TV)
**Estimation:** 3 Points
**Priority:** Must

---

## Objective
Build the TV App's media carousel that occupies Zone B (75% of the display). It fetches the list of active media assigned to the current screen, downloads and caches files locally using `expo-file-system`, and rotates through them with smooth fade transitions.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/components/MediaCarousel.tsx`
    *   `apps/tv/services/mediaService.ts` (fetch + cache logic)
    *   `apps/tv/store/mediaStore.ts` (Zustand — holds cached media list)
*   **`mediaService.ts` functions:**
    *   `fetchMediaList(screenId: string, mosqueId: string): Promise<MediaContent[]>` — Fetches active media from Supabase filtered by screen assignment.
    *   `cacheMedia(media: MediaContent[]): Promise<CachedMedia[]>` — Downloads each file to `FileSystem.documentDirectory/media/{id}`. Returns local URI list.
    *   `getCachedMedia(): Promise<CachedMedia[]>` — Returns already-downloaded media from filesystem.
*   **`MediaCarousel.tsx` behavior:**
    *   Loads `cachedMedia` from `mediaStore`.
    *   Cycles through each item using its `duration` (seconds).
    *   Fade transition: 500ms opacity animation between items.
    *   Supports both `Image` (React Native) and `Video` (`expo-av`) types.
    *   Hidden when `DisplayState !== 'IDLE'`.
*   **Sync trigger:** On app boot + Supabase Realtime update on `media_content` table.

## Acceptance Criteria (Technical)
*   [ ] Media list is fetched for the current `screenId`; only assigned or "all screens" media is shown.
*   [ ] Each media file is downloaded to local filesystem on first load.
*   [ ] Carousel rotates automatically per each item's `duration` (e.g., 10s per image).
*   [ ] Fade transition (500ms) between items — no flash/blank screen.
*   [ ] Video files play muted and loop for their duration slot.
*   [ ] Carousel is hidden (opacity 0 or unmounted) during non-IDLE states.
*   [ ] If `cachedMedia` is empty: shows a placeholder (mosque name or Jadzan logo).
*   [ ] When new media is uploaded by Admin: TV detects via Realtime → downloads → adds to rotation.

## Business Rules & Logic
*   Media is always served from local cache, never streamed from URL directly (offline resilience).
*   If a cached file is corrupted/missing: skip that item, log warning, attempt re-download.
*   `duration` is respected per item — not a global setting.

## Dependencies
*   Depends on: JADZ-006 (deviceStore for screenId/mosqueId), JADZ-016 (prayerStore for DisplayState), JADZ-020 (media_content schema)

## Definition of Done
*   [ ] Carousel rotates through cached media correctly.
*   [ ] Fade transition works smoothly.
*   [ ] Carousel hides during non-IDLE prayer states.
*   [ ] Realtime sync triggers re-download of new media.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

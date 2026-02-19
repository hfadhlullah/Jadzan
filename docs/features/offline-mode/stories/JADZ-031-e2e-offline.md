# JADZ-031: E2E — TV Operates Fully Offline Then Auto-Syncs on Reconnect

**Epic:** CORE - Offline Mode
**Layer:** L5-integration
**Role:** Fullstack
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Validate the complete offline resilience scenario: TV syncs data while online, network is cut, TV continues operating, Admin makes changes while TV is offline, network is restored, TV auto-syncs the changes.

## Technical Specifications
*   **Test Method:** Manual smoke test.
    *   One Android emulator or TV device (Airplane Mode toggle available).
    *   One Admin browser session.
    *   Supabase Dashboard for verification.

## Acceptance Criteria (Technical)

### Phase 1: Successful Online Sync
*   [ ] TV boots online → all data synced, prayer times showing, media carousel running, ticker active.
*   [ ] AsyncStorage keys confirmed populated: `@jadzan/mosque_config`, `@jadzan/media_manifest`, `@jadzan/announcements`.
*   [ ] FileSystem media cache confirmed: files exist in `documentDirectory/media/`.

### Phase 2: Network Cut (Airplane Mode ON)
*   [ ] "Offline" badge appears on TV within 2 seconds.
*   [ ] Prayer times continue displaying with live clock ticking.
*   [ ] Media carousel continues rotating from cached files.
*   [ ] News ticker continues scrolling with last-known announcements.
*   [ ] No crashes or blank screens for at least 5 minutes offline.
*   [ ] Prayer state transitions (IDLE → PRE_ADZAN → ADZAN etc.) continue working correctly (mock time if needed).

### Phase 3: Admin Makes Changes While TV is Offline
*   [ ] Admin uploads a new image "offline-test.png" to media library.
*   [ ] Admin adds announcement "Test offline sync".
*   [ ] TV still shows old content (correct — not yet synced).

### Phase 4: Reconnection (Airplane Mode OFF)
*   [ ] "Offline" badge disappears within 5 seconds.
*   [ ] TV automatically triggers `syncAll()` upon reconnection.
*   [ ] New image "offline-test.png" appears in carousel within 60 seconds.
*   [ ] "Test offline sync" appears in ticker within 60 seconds.
*   [ ] No manual restart required.

### Phase 5: Cold Boot Offline (Cached)
*   [ ] With Airplane Mode ON, force-stop and reopen the TV app.
*   [ ] App boots to Main Display (not Pairing Screen) — `screenId` preserved.
*   [ ] Prayer times displayed correctly from cached config.
*   [ ] Media and ticker loaded from cache.

## Business Rules & Logic
*   Failure in Phase 4 sync → investigate `JADZ-028` retry logic and Supabase Realtime reconnection.
*   Failure in Phase 5 boot → investigate `JADZ-027` persistence and `JADZ-029` boot flow.

## Dependencies
*   Depends on: JADZ-027, JADZ-028, JADZ-029, JADZ-030

## Definition of Done
*   [ ] All 5 phases verified manually.
*   [ ] No crashes during 5+ minutes offline.
*   [ ] Auto-sync verified after reconnection.
*   [ ] Cold boot offline verified.
*   [ ] `bun run lint` passes.

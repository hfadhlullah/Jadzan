# JADZ-029: TV — Offline Boot Flow (Graceful Rehydration)

**Epic:** CORE - Offline Mode
**Layer:** L4-feature-ui
**Role:** Frontend (TV)
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Implement the TV App's boot sequence to gracefully handle the offline scenario: attempt fresh sync from Supabase, fall back to AsyncStorage snapshot if offline, and populate all stores (prayer, media, announcements) from either source.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/app/display.tsx` (update boot logic)
    *   `apps/tv/services/syncService.ts` (orchestrates the full sync flow)
*   **`syncService.ts` — `syncAll(screenId, mosqueId)` function:**
    ```
    1. Try fetchMosqueConfig() from Supabase
       ├── SUCCESS → update prayerStore, saveConfig() to AsyncStorage
       └── FAIL    → loadConfig() from AsyncStorage
                     ├── HAS DATA → use cached config, update prayerStore
                     └── NO DATA  → set appState = 'NO_CONFIG' (first boot offline)

    2. Try fetchMediaList() from Supabase
       ├── SUCCESS → cacheMedia() new files, saveMediaManifest(), update mediaStore
       └── FAIL    → loadMediaManifest() from AsyncStorage, update mediaStore

    3. Try fetchAnnouncements() from Supabase
       ├── SUCCESS → saveAnnouncements(), update announcementStore
       └── FAIL    → loadAnnouncements() from AsyncStorage, update announcementStore

    4. Start prayer engine tick (regardless of online/offline — adhan-js is local)
    ```
*   **`NO_CONFIG` state**: Shows a full-screen message:
    > "No configuration found. Please connect this TV to the internet and restart."
*   **Loading state**: Shows a brief "Syncing..." splash (500ms minimum to avoid flash).

## Acceptance Criteria (Technical)
*   [ ] **Online boot**: All 3 data sources fetched from Supabase, stores populated, display renders in < 3s.
*   [ ] **Offline boot (cached)**: All 3 data sources loaded from AsyncStorage, display renders in < 1s.
*   [ ] **Offline boot (no cache)**: `NO_CONFIG` message shown — prayer engine does NOT start.
*   [ ] Loading splash shown for at minimum 500ms to prevent flash.
*   [ ] After boot, `syncService` re-runs every 60 seconds to check for updates (while online).
*   [ ] Switching to airplane mode mid-session: display stays intact, no crash.

## Business Rules & Logic
*   `syncAll` is the single entry point for all data fetching — called on boot and on reconnection.
*   Prayer engine starts even if media/announcement fetch fails (prayer display is highest priority).
*   `NO_CONFIG` is only shown if BOTH network AND AsyncStorage have no mosque config.

## Dependencies
*   Depends on: JADZ-006 (deviceStore), JADZ-016 (prayerStore), JADZ-024 (mediaStore), JADZ-027 (persistenceService), JADZ-028 (networkService)

## Definition of Done
*   [ ] All 3 boot scenarios tested (online, offline-cached, offline-no-cache).
*   [ ] `NO_CONFIG` screen renders correctly.
*   [ ] Periodic sync (60s) runs without memory leaks.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

# JADZ-027: Config Persistence Service (AsyncStorage Full Snapshot)

**Epic:** CORE - Offline Mode
**Layer:** L3-backend (Service Layer)
**Role:** Fullstack
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Build a `persistenceService` that snapshots the full Mosque config, media manifest, and announcements to AsyncStorage after every successful Supabase sync. On boot, the service loads this snapshot if the network is unavailable.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/services/persistenceService.ts`
*   **AsyncStorage Keys (constants):**
    ```ts
    export const STORAGE_KEYS = {
        SCREEN_ID:      '@jadzan/screen_id',
        MOSQUE_CONFIG:  '@jadzan/mosque_config',
        MEDIA_MANIFEST: '@jadzan/media_manifest',
        ANNOUNCEMENTS:  '@jadzan/announcements',
    };
    ```
*   **Functions:**
    ```ts
    // Save after successful sync
    saveConfig(config: MosqueConfig): Promise<void>
    saveMediaManifest(media: CachedMedia[]): Promise<void>
    saveAnnouncements(items: Announcement[]): Promise<void>

    // Load on boot (returns null if not found)
    loadConfig(): Promise<MosqueConfig | null>
    loadMediaManifest(): Promise<CachedMedia[] | null>
    loadAnnouncements(): Promise<Announcement[] | null>

    // Clear all (for "factory reset" / re-pairing)
    clearAll(): Promise<void>
    ```
*   **Integration Points:**
    *   Call `saveConfig()` after successful `getMosque()` fetch.
    *   Call `saveMediaManifest()` after successful `fetchMediaList()` + `cacheMedia()`.
    *   Call `saveAnnouncements()` after successful `fetchAnnouncements()`.

## Acceptance Criteria (Technical)
*   [ ] After a successful sync, `AsyncStorage.getItem('@jadzan/mosque_config')` returns valid JSON.
*   [ ] `loadConfig()` returns `null` if no snapshot exists (first boot).
*   [ ] `loadConfig()` returns the last saved `MosqueConfig` object correctly deserialized.
*   [ ] `loadMediaManifest()` returns the list including `localUri` for each cached file.
*   [ ] `clearAll()` removes all `@jadzan/*` keys from AsyncStorage.
*   [ ] All functions handle `JSON.parse` errors gracefully (return `null` on corrupt data).

## Business Rules & Logic
*   Persistence writes happen asynchronously **after** the UI is already updated (non-blocking).
*   Data is written atomically per key — not in a single transaction (AsyncStorage limitation).
*   `clearAll()` is called when the device is "un-paired" (screen deleted from Admin).

## Dependencies
*   Depends on: JADZ-003 (AsyncStorage setup), JADZ-006 (screenId storage), JADZ-016 (MosqueConfig types), JADZ-024 (CachedMedia types)

## Definition of Done
*   [ ] All save/load functions implemented.
*   [ ] Graceful null-handling on corrupt/missing data.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

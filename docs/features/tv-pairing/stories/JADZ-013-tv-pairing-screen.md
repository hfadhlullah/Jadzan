# JADZ-013: TV — Pairing Code Display Screen

**Epic:** CORE - TV Pairing Flow
**Layer:** L4-feature-ui
**Role:** Frontend (TV)
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Build the TV App's "Pairing Screen" — the first screen shown when the device has no stored `screenId`. It generates a unique 6-digit code, inserts a `PENDING` row in the `screens` table, displays the code prominently, and polls for activation.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/app/pairing.tsx` (main screen component)
    *   `apps/tv/services/pairingService.ts` (code gen + insert + polling logic)
*   **`pairingService.ts` functions:**
    *   `generatePairingCode(): string` — Generates 6-char uppercase alphanumeric (e.g., "XJ922A").
    *   `registerDevice(code: string): Promise<string>` — Inserts `{pairing_code: code, status: 'PENDING'}` into `screens`, returns row `id`.
    *   `pollForActivation(screenId: string, onActivated: () => void): () => void` — Polls every 5s; resolves when `status = 'ACTIVE'`; returns cleanup fn.
*   **UI Layout (TV — Full Screen Dark):**
    ```
    ┌──────────────────────────────────────────┐
    │                 JADZAN                   │
    │                                          │
    │   Activate this screen                   │
    │   Visit: jadzan.app/pair                 │
    │                                          │
    │   Enter code:                            │
    │   ┌──────────────────┐                  │
    │   │   X J 9 - 2 2    │  ← Large, mono   │
    │   └──────────────────┘                  │
    │                                          │
    │   Waiting for activation...  ⏳          │
    └──────────────────────────────────────────┘
    ```
*   **Fonts:** Code displayed in `JetBrains Mono` (or Inter Mono), `FontSize.displayXL`.

## Acceptance Criteria (Technical)
*   [ ] On mount: generates unique code and inserts PENDING row in Supabase.
*   [ ] Code displays in large, monospaced font, clearly readable on a TV from 5m.
*   [ ] Polling starts automatically on mount and cleans up on unmount.
*   [ ] When `status = 'ACTIVE'` detected: saves `screenId` to AsyncStorage via `storageService.ts`.
*   [ ] Navigates to `display` screen immediately after `screenId` is saved.
*   [ ] If Supabase is unreachable: shows "No internet connection. Retrying..." message.

## Business Rules & Logic
*   Code must be freshly generated each time the Pairing Screen mounts (in case of re-pairing after factory reset).
*   Polling must stop once the device is paired (no dangling intervals).
*   The Admin URL (`jadzan.app/pair`) should be configurable via an `.env` variable (`EXPO_PUBLIC_ADMIN_URL`).

## Dependencies
*   Depends on: JADZ-003 (TV Shell), JADZ-006 (App Shell navigation), JADZ-001 (DB schema)

## Definition of Done
*   [ ] Screen renders with a unique code on each fresh install.
*   [ ] Polling successfully triggers navigation after activation.
*   [ ] Offline fallback message shown correctly.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

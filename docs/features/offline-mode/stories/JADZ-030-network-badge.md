# JADZ-030: TV — Network Status Indicator (Online/Offline Badge)

**Epic:** CORE - Offline Mode
**Layer:** L4-feature-ui
**Role:** Frontend (TV)
**Estimation:** 1 Point
**Priority:** Should

---

## Objective
Add a small, non-intrusive network status indicator on the TV display so Mosque staff can identify at a glance whether the TV is online or offline.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/components/NetworkBadge.tsx`
*   **Placement**: Top-right corner of the Prayer Sidebar (Zone A), below the clock.
*   **Visual Spec:**
    ```
    Online:   [🟢 ·]   (small green dot, 8px, no label — minimal)
    Offline:  [🔴 Offline]  (red dot + "Offline" text, 14px)
    ```
*   **Data source**: `networkStore.isOnline` (from `JADZ-028`).
*   **Offline badge**: Red dot + small text "Offline" in `FontSize.caption` (16px), `--color-text-secondary`.
*   **Online badge**: Just a subtle green dot (no text) — minimal UI noise.
*   **Animation**: Badge fades in/out over 300ms on state change.

## Acceptance Criteria (Technical)
*   [ ] When online: small green dot visible in corner (no text).
*   [ ] When offline: red dot + "Offline" text appears with 300ms fade-in.
*   [ ] Badge updates automatically without page reload when network state changes.
*   [ ] Badge does not obstruct any prayer time information.
*   [ ] Visible in ALL display states (IDLE, ADZAN, IQOMAH, etc.).

## Business Rules & Logic
*   Online indicator is intentionally minimal — the TV is *expected* to be online, so no loud UI.
*   Offline indicator is slightly more prominent — it's the exception that requires attention.
*   No fixed timestamp of "offline since" in MVP [could be a future enhancement].

## Dependencies
*   Depends on: JADZ-017 (Prayer Sidebar layout), JADZ-028 (networkStore)

## Definition of Done
*   [ ] Badge renders and transitions correctly.
*   [ ] Tested by toggling airplane mode on device/emulator.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

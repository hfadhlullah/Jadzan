# JADZ-006: TV App Shell (Kiosk Mode + Keep Awake)

**Epic:** FOUNDATION - Project Scaffold
**Layer:** L4-feature-ui
**Role:** Frontend
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Build the TV App's root shell: a full-screen kiosk layout that prevents the screen from sleeping, hides the Android status bar, and renders a placeholder for the two main screens (PairingScreen, MainDisplay) based on whether the device is paired.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/app/_layout.tsx` (Root: font loading, keep awake, status bar hidden)
    *   `apps/tv/app/index.tsx` (Entry point: redirect logic — Paired? -> MainDisplay : PairingScreen)
    *   `apps/tv/app/pairing.tsx` (Placeholder: renders "Pairing Screen")
    *   `apps/tv/app/display.tsx` (Placeholder: renders "Main Display")
    *   `apps/tv/store/deviceStore.ts` (Zustand store: holds `screenId`, `isConfigured`)
    *   `apps/tv/services/storageService.ts` (Reads/writes `screenId` to AsyncStorage)
*   **Packages Used:**
    *   `expo-keep-awake` — `activateKeepAwakeAsync()` in root layout.
    *   `expo-status-bar` — `<StatusBar hidden />`.
    *   `zustand` — Lightweight global state.

## Acceptance Criteria (Technical)
*   [ ] App launches in full screen (no Android navigation bar or status bar visible).
*   [ ] Screen never goes to sleep while the app is open (KeepAwake active).
*   [ ] If `AsyncStorage.getItem('screenId')` returns `null`, navigate to `pairing`.
*   [ ] If `AsyncStorage.getItem('screenId')` returns a value, navigate to `display`.
*   [ ] Zustand `deviceStore` correctly reflects the persisted state on app boot.

## Business Rules & Logic
*   The TV app must function in "kiosk mode" — no way for visitors to exit or navigate outside the app.
*   On first boot (no `screenId`), the user (Mosque Admin) must see the pairing code immediately.

## Dependencies
*   Depends on: JADZ-003

## Definition of Done
*   [ ] App boots directly to Pairing or Display screen based on stored state.
*   [ ] Keep Awake is active (verified by disabling screen timeout in device settings).
*   [ ] Lint/Type check clear.

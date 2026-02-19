# JADZ-019: E2E — Prayer Engine Transitions Through All States

**Epic:** CORE - Prayer Engine (TV)
**Layer:** L5-integration
**Role:** Fullstack
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Validate the complete Prayer Engine lifecycle: that the TV correctly calculates prayer times, displays the sidebar, and transitions through every FSM state (IDLE → PRE_ADZAN → ADZAN → IQOMAH → PRAYER_ACTIVE → IDLE) in sequence without errors.

## Technical Specifications
*   **Test Method:** Manual testing using **time mocking**.
    *   Temporarily set device time (or override `Date.now()` in dev mode) to T-6 mins before a known prayer.
    *   Observe transitions as time progresses.
*   **Proposed Dev Helper:**
    *   `apps/tv/utils/timeOverride.ts` — `__DEV__` only; exports `getMockNow(): Date` that can be set to any time for testing. Production always returns `new Date()`.

## Acceptance Criteria (Technical)

### Prayer Time Calculation
*   [ ] Using Jakarta coords (-6.2088, 106.8456) + KEMENAG method, Dhuhr is approximately 11:57 WIB. Verify within ±2 minutes.

### State Transitions (Time-mocked)
*   [ ] **T-6 min**: State = `IDLE`. Media carousel visible. Prayer sidebar shows next prayer highlighted.
*   [ ] **T-5 min**: State transitions to `PRE_ADZAN`. `PreAdzanOverlay` fades in. Media hidden.
*   [ ] **T=0**: State transitions to `ADZAN`. `AdzanOverlay` appears with correct prayer name.
*   [ ] **T+1 min**: State transitions to `IQOMAH`. `IqomahOverlay` appears with countdown (e.g., 10:00).
*   [ ] **Countdown reaches 00:00**: State transitions to `PRAYER_ACTIVE`. Dark screen + Arabic text.
*   [ ] **T+16 min (Post-prayer)**: State transitions back to `IDLE`. Media resumes.

### Sidebar
*   [ ] During all states, Prayer Sidebar (Zone A) remains visible and clock continues ticking.
*   [ ] After full cycle, next prayer is correctly highlighted in sidebar.

### Midnight Rollover
*   [ ] Mock time to 23:55 — after Isha completes, sidebar shows next day's Fajr as "next prayer".

## Business Rules & Logic
*   `timeOverride.ts` must be a no-op stub in production builds (guarded by `__DEV__`).
*   Any failed state transition must be traced to `JADZ-016` (PrayerService) for correction.

## Dependencies
*   Depends on: JADZ-016, JADZ-017, JADZ-018

## Definition of Done
*   [ ] All state transitions verified manually via time mock.
*   [ ] Midnight rollover verified.
*   [ ] No console errors during any state.
*   [ ] `timeOverride.ts` is dev-only and stripped from prod.
*   [ ] `bun run lint` passes.

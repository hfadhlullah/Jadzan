# JADZ-016: Prayer Service (adhan-js Wrapper + State Machine)

**Epic:** CORE - Prayer Engine (TV)
**Layer:** L3-backend (Service Layer)
**Role:** Fullstack
**Estimation:** 3 Points
**Priority:** Must

---

## Objective
Build the core `PrayerService` — a pure TypeScript module that wraps `adhan` to calculate daily prayer times and implements the Display State Machine (FSM) that drives the TV display based on current time vs prayer schedule.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/services/prayerService.ts`
    *   `apps/tv/store/prayerStore.ts` (Zustand store — holds current state + times)
*   **`prayerService.ts` exports:**
    ```ts
    // Calculate all prayer times for today
    calculateTimes(config: MosqueConfig): PrayerTimes
    // Returns: { fajr, dhuhr, asr, maghrib, isha } as Date objects

    // Returns the current FSM state based on current time
    getCurrentState(times: PrayerTimes, delays: IqomahDelays): DisplayState

    // Returns milliseconds until next state transition
    getNextTransitionMs(times: PrayerTimes, delays: IqomahDelays): number

    // Returns next prayer info
    getNextPrayer(times: PrayerTimes): { name: PrayerName; time: Date }
    ```
*   **`DisplayState` enum:**
    ```ts
    type DisplayState = 'IDLE' | 'PRE_ADZAN' | 'ADZAN' | 'IQOMAH' | 'PRAYER_ACTIVE';
    ```
*   **`prayerStore.ts` (Zustand):**
    ```ts
    interface PrayerStore {
        times: PrayerTimes | null;
        currentState: DisplayState;
        currentPrayer: PrayerName | null;
        iqomahEndsAt: Date | null;
        setTimes: (times: PrayerTimes) => void;
        tick: (config: MosqueConfig) => void; // called every second
    }
    ```

## Acceptance Criteria (Technical)
*   [ ] `calculateTimes()` returns correct times for Jakarta (-6.2088, 106.8456) using KEMENAG method (verified against known reference).
*   [ ] `getCurrentState()` returns `PRE_ADZAN` when current time is T-5 mins before any prayer.
*   [ ] `getCurrentState()` returns `IQOMAH` immediately after Adzan time, lasting `iqomah_delays.[prayer]` minutes.
*   [ ] `getCurrentState()` returns `PRAYER_ACTIVE` after Iqomah ends, for 15 fixed minutes.
*   [ ] Midnight rollover: after Isha completes, `getNextPrayer()` returns next day's Fajr.
*   [ ] `tick()` called with `setInterval(1000)` correctly transitions state without memory leaks.
*   [ ] All functions are pure (no side effects) — testable in isolation.

## Business Rules & Logic
*   `PRE_ADZAN` window is exactly 5 minutes (300 seconds) before any of the 5 prayers.
*   `PRAYER_ACTIVE` duration is fixed at 15 minutes (MVP — not configurable).
*   If `IQOMAH` delay is `0`, skip to `PRAYER_ACTIVE` immediately after `ADZAN`.
*   Times are calculated once per day (at app boot + at midnight via scheduler).

## Dependencies
*   Depends on: JADZ-003 (Expo app init), JADZ-006 (deviceStore for mosqueId), JADZ-008 (MosqueConfig types)

## Definition of Done
*   [ ] `prayerService.ts` fully implemented and manually tested.
*   [ ] `prayerStore.ts` Zustand store wired and exporting state.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

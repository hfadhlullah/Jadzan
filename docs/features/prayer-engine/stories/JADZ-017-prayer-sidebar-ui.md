# JADZ-017: Prayer Time Sidebar UI (Zone A — Always Visible)

**Epic:** CORE - Prayer Engine (TV)
**Layer:** L4-feature-ui
**Role:** Frontend (TV)
**Estimation:** 3 Points
**Priority:** Must

---

## Objective
Build the persistent prayer time sidebar (Zone A) of the TV Main Display. This panel is always visible and shows the current time (digital clock), Hijri date, and a list of all 5 prayer times with the next prayer highlighted.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/components/PrayerSidebar.tsx`
    *   `apps/tv/components/PrayerRow.tsx` (single prayer item)
    *   `apps/tv/hooks/useClock.ts` (ticks every second, returns current `Date`)
*   **Layout (Right Sidebar, 25% width):**
    ```
    ┌─────────────────────┐
    │  19:30:45           │  ← useClock(), FontSize.displayXL (96px)
    │  Kamis, 20 Feb 2026 │  ← Gregorian date
    │  20 Sya'ban 1447    │  ← Hijri date (via adhan)
    │─────────────────────│
    │  Fajr     04:51     │  ← PrayerRow (dim)
    │  Dhuhr    11:57     │  ← PrayerRow (dim)
    │▶ Asr      15:12     │  ← PrayerRow (NEXT — Gold border)
    │  Maghrib  18:01     │  ← PrayerRow (dim)
    │  Isha     19:15     │  ← PrayerRow (dim)
    └─────────────────────┘
    ```
*   **Prayer names:** English label + Arabic subtitle (e.g., "Asr / العصر"). Use `Amiri` font for Arabic part.
*   **Next prayer highlight:** Left border accent in `--color-accent` (Gold), slightly brighter background.
*   **Active prayer (ADZAN/IQOMAH state):** Full `--color-primary` (Emerald) background on that row.

## Acceptance Criteria (Technical)
*   [ ] Clock ticks every second without performance issues (no re-rendering whole tree).
*   [ ] Current time displays in `FontSize.displayXL` (96px), monospaced.
*   [ ] Hijri date is correct for the current Gregorian date (verify manually).
*   [ ] The "next prayer" row is correctly highlighted (Gold accent).
*   [ ] Prayer rows show Arabic subtitles in `Amiri` font.
*   [ ] Sidebar is visible in ALL display states (IDLE, PRE_ADZAN, ADZAN, IQOMAH, PRAYER_ACTIVE).
*   [ ] When `DisplayState` changes to PRAYER_ACTIVE, active prayer row turns Emerald/primary.

## Business Rules & Logic
*   Prayer names (English): Fajr, Dhuhr, Asr, Maghrib, Isha.
*   Prayer names (Arabic): الفجر, الظهر, العصر, المغرب, العشاء.
*   After Isha ends, Fajr of the next day is highlighted as "next".
*   Sidebar background: `--color-surface` (`#1E293B`), slightly distinguishable from main stage.

## Dependencies
*   Depends on: JADZ-003 (Fonts), JADZ-016 (PrayerStore)

## Definition of Done
*   [ ] Sidebar renders with live clock, Hijri date, and all 5 prayers.
*   [ ] Next prayer highlight updates correctly as time passes.
*   [ ] Arabic subtitles render in Amiri font.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

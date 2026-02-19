# JADZ-025: TV — News Ticker Component (Zone C)

**Epic:** CORE - Content Manager
**Layer:** L4-feature-ui
**Role:** Frontend (TV)
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Build the TV App's scrolling news ticker bar (Zone C) at the bottom of the screen. It displays all active announcements for the mosque in a continuously scrolling right-to-left marquee, similar to a news broadcast ticker.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/components/NewsTicker.tsx`
    *   `apps/tv/services/announcementService.ts` (fetch active announcements)
*   **`announcementService.ts`:**
    *   `fetchAnnouncements(mosqueId: string): Promise<Announcement[]>` — Fetches all active announcements.
*   **`NewsTicker.tsx` behavior:**
    *   Fixed height: 60px, pinned to bottom of screen.
    *   Background: `--color-surface` (`#1E293B`) with a thin top border in `--color-accent` (Gold).
    *   Left label: "📢 INFO" badge in Gold.
    *   Text: all active announcements joined by " • " separator, scrolling left continuously using `Animated.loop` + `Animated.timing`.
    *   Scroll speed: approximately 80dp/second (configurable constant).
    *   Text style: `FontSize.body` (24px), `--color-text-primary`.
*   **Sync:** Fetches announcements on boot + re-fetches on Supabase Realtime update.
*   **Visibility:** Always visible in `IDLE` state; hidden during `PRE_ADZAN`, `ADZAN`, `IQOMAH`, `PRAYER_ACTIVE`.

## Acceptance Criteria (Technical)
*   [ ] All active announcements display in the ticker, joined by " • ".
*   [ ] Text scrolls continuously from right to left without stopping.
*   [ ] When text completes one full scroll, it loops seamlessly (no flash/gap).
*   [ ] Ticker is hidden during non-IDLE prayer states.
*   [ ] If no active announcements: ticker is hidden (not showing empty bar).
*   [ ] When Admin adds new announcement: Realtime update triggers re-fetch and ticker updates.
*   [ ] "📢 INFO" label is always visible (fixed) while text scrolls past it.

## Business Rules & Logic
*   Ticker text is NOT cached (lightweight, always fetched fresh).
*   Separator between announcements: " • " (U+2022 bullet).
*   Ticker is always shown in IDLE regardless of whether media carousel is active.

## Dependencies
*   Depends on: JADZ-006 (deviceStore for mosqueId), JADZ-016 (prayerStore for DisplayState), JADZ-021 (announcements schema)

## Definition of Done
*   [ ] Ticker scrolls continuously with all active announcements.
*   [ ] Hidden in non-IDLE states.
*   [ ] No active announcements → ticker hidden.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

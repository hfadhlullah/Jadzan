# JADZ-018: Iqomah Countdown & State Transition Overlays

**Epic:** CORE - Prayer Engine (TV)
**Layer:** L4-feature-ui
**Role:** Frontend (TV)
**Estimation:** 3 Points
**Priority:** Must

---

## Objective
Build the full-screen overlay components for PRE_ADZAN, ADZAN, IQOMAH, and PRAYER_ACTIVE display states. These overlays appear on top of the Main Display media stage (Zone B) and are driven by the `prayerStore` FSM state.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/components/overlays/PreAdzanOverlay.tsx`
    *   `apps/tv/components/overlays/AdzanOverlay.tsx`
    *   `apps/tv/components/overlays/IqomahOverlay.tsx`
    *   `apps/tv/components/overlays/PrayerActiveOverlay.tsx`
    *   `apps/tv/components/overlays/StateOverlayManager.tsx` (renders the correct overlay based on `DisplayState`)
*   **`PreAdzanOverlay`** — Amber/Gold background, text: "Approaching Asr / قريبًا — العصر", animated pulse.
*   **`AdzanOverlay`** — Dark background, large text: "Adzan / الأذان — [Prayer] / [Arabic]", subtle glow.
*   **`IqomahOverlay`** — Dark background:
    *   Top: "Iqomah in / إقامة"
    *   Centre: **Digital countdown `MM:SS`** in `FontSize.displayXL`, monospaced, color changes:
        *   `> 5 min` → Emerald Green (`#059669`)
        *   `≤ 5 min` → Amber (`#D97706`)
        *   `≤ 1 min` → Red (`#DC2626`)
    *   Bottom: Prayer name (English + Arabic)
*   **`PrayerActiveOverlay`** — Full dark (`#0F172A`), centered Arabic text:
    *   "صفوا واعتدلوا" (Straighten and align your rows)
    *   Smaller subtitle: "Prayer in progress"

## Acceptance Criteria (Technical)
*   [ ] `StateOverlayManager` renders `null` during `IDLE` state (no overlay).
*   [ ] `PreAdzanOverlay` renders correctly at T-5 mins with animated amber pulse.
*   [ ] `AdzanOverlay` renders with correct prayer name (English + Arabic).
*   [ ] `IqomahOverlay` countdown ticks down every second correctly (MM:SS format).
*   [ ] Countdown color changes at 5-min and 1-min thresholds.
*   [ ] `PrayerActiveOverlay` shows Arabic text in `Amiri` font, correctly centered.
*   [ ] All overlays use `StyleSheet.absoluteFillObject` to cover Zone B (media stage) fully.
*   [ ] Smooth fade-in transition (300ms) when overlay appears.

## Business Rules & Logic
*   Overlays cover the media stage (Zone B) but NOT the prayer sidebar (Zone A).
*   `IqomahOverlay` MM:SS is computed from `prayerStore.iqomahEndsAt - Date.now()`.
*   When countdown hits `00:00`, store transitions to `PRAYER_ACTIVE` automatically (via `JADZ-016`).
*   `PrayerActiveOverlay` dismisses after 15 minutes, returning to `IDLE`.

## Dependencies
*   Depends on: JADZ-016 (PrayerStore + DisplayState), JADZ-017 (Main Display layout context)

## Definition of Done
*   [ ] All 4 overlay components render correctly in isolation.
*   [ ] `StateOverlayManager` correctly switches overlays based on FSM state.
*   [ ] Countdown ticks accurately without drift.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

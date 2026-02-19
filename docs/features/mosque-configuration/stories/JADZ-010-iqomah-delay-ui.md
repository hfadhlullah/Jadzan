# JADZ-010: Iqomah Delay Configuration UI

**Epic:** CORE - Mosque Configuration
**Layer:** L4-feature-ui
**Role:** Frontend
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Build a dedicated UI section (within or alongside the Mosque Settings page) for the Admin to configure the Iqomah delay (in minutes) for each of the 5 daily prayers separately. These values are stored in the `iqomah_delays` JSON field on the `mosques` table.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/mosques/IqomahDelayForm.tsx` (Client Component)
*   **Form Fields (5 number inputs):**
    *   `fajr` — Number input, label "Fajr Iqomah (minutes)".
    *   `dhuhr` — Number input, label "Dhuhr Iqomah (minutes)".
    *   `asr` — Number input, label "Asr Iqomah (minutes)".
    *   `maghrib` — Number input, label "Maghrib Iqomah (minutes)".
    *   `isha` — Number input, label "Isha Iqomah (minutes)".
*   **Default Values:** `{fajr:20, dhuhr:10, asr:10, maghrib:10, isha:10}`.
*   **On Submit:** Calls `updateIqomahDelays()` Server Action from `JADZ-008`.
*   **Libraries:** `react-hook-form` + `zod`, Shadcn/ui `Input`, `Button`, `Toast`.

## Acceptance Criteria (Technical)
*   [ ] All 5 delay fields render with correct labels and default values.
*   [ ] Non-numeric input is rejected (HTML `type="number"` + Zod `z.number().min(0).max(60)`).
*   [ ] Value of 0 is allowed (Iqomah immediately after Adzan).
*   [ ] On successful save: shows Toast — "Iqomah settings saved ✓".
*   [ ] Values persist on page reload (loaded from DB via `getMosque()`).

## Business Rules & Logic
*   All 5 prayers must have a delay value — no field can be left blank.
*   Maximum delay is 60 minutes (validation enforced client + server).
*   Minimum delay is 0 minutes (immediate Iqomah).

## Dependencies
*   Depends on: JADZ-008 (Server Actions), JADZ-009 (Mosque Settings page context)

## Definition of Done
*   [ ] All 5 fields render and save correctly.
*   [ ] Values persist after page reload.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

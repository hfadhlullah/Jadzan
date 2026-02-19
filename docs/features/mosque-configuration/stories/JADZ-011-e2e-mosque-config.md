# JADZ-011: E2E — Admin Saves Mosque Config → Verified in DB

**Epic:** CORE - Mosque Configuration
**Layer:** L5-integration
**Role:** Fullstack
**Estimation:** 1 Point
**Priority:** Must

---

## Objective
Validate the full round-trip of the Mosque Configuration feature: Admin fills in the Mosque Settings form and Iqomah Delay form, saves both, and the data is correctly persisted in the Supabase `mosques` table with the right values.

## Technical Specifications
*   **Test Method:** Manual smoke test (no automated framework required at this stage).
*   **Verification:** Supabase Dashboard Table Editor or `supabase db query`.

## Acceptance Criteria (Technical)
*   [ ] Admin logs in → navigates to `/dashboard/mosques`.
*   [ ] Fills in: name="Masjid Al-Falah", lat=-6.2088, long=106.8456, timezone="Asia/Jakarta", method="KEMENAG".
*   [ ] Saves → Toast "Mosque settings saved ✓" appears.
*   [ ] DB row in `mosques` table matches submitted values exactly.
*   [ ] Admin changes Fajr Iqomah to 25 mins → Saves → Toast appears.
*   [ ] DB `iqomah_delays.fajr` = 25 confirmed.
*   [ ] Page refresh → form is pre-populated with saved values (no data loss).
*   [ ] No console errors during the entire flow.

## Business Rules & Logic
*   If verification fails at any step, the issue is traced back to the relevant story (JADZ-008, JADZ-009, or JADZ-010) and fixed before marking this story as Done.

## Dependencies
*   Depends on: JADZ-008, JADZ-009, JADZ-010

## Definition of Done
*   [ ] Manual smoke test passes all acceptance criteria.
*   [ ] No console errors.
*   [ ] `bun run lint` passes.

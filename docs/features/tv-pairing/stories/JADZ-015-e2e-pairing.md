# JADZ-015: E2E — TV Shows Code → Admin Pairs → TV Activates

**Epic:** CORE - TV Pairing Flow
**Layer:** L5-integration
**Role:** Fullstack
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Validate the complete pairing ceremony end-to-end: from a fresh TV install showing a code, to the Admin entering it in the dashboard, to the TV automatically transitioning to the Main Display screen.

## Technical Specifications
*   **Test Method:** Manual smoke test using:
    *   One Android emulator or TV device (running `JADZ-013`).
    *   One browser tab (running the Admin Panel from `JADZ-014`).
    *   Supabase Dashboard for DB verification.

## Acceptance Criteria (Technical)
*   [ ] **Step 1 (TV)**: After fresh install, TV shows Pairing Screen with a code (e.g., "XJ922A").
*   [ ] **Step 2 (DB)**: `screens` table shows a row with `pairing_code='XJ922A'`, `status='PENDING'`, `mosque_id=NULL`.
*   [ ] **Step 3 (Admin)**: Admin logs in → Screens → Add Screen → enters "XJ922A" + name "Main Hall" → submits.
*   [ ] **Step 4 (Admin)**: Success toast "Screen activated ✓" appears. Screen appears in list with status `ACTIVE`.
*   [ ] **Step 5 (DB)**: `screens` row updated: `status='ACTIVE'`, `mosque_id` populated, `pairing_code=NULL`, `name='Main Hall'`.
*   [ ] **Step 6 (TV)**: Within 10 seconds, TV automatically navigates to Main Display screen (no manual restart needed).
*   [ ] **Step 7 (TV)**: `screenId` is persisted in AsyncStorage — confirmed by closing/reopening app and going directly to Display (skipping Pairing).
*   [ ] No console errors on either the TV or Admin panel during the flow.

## Business Rules & Logic
*   If Step 6 doesn't happen within 30s, check Supabase Realtime subscription or polling interval in `JADZ-013`.
*   If Step 5 DB values are wrong, investigate `JADZ-012` Server Action.

## Dependencies
*   Depends on: JADZ-012, JADZ-013, JADZ-014

## Definition of Done
*   [ ] All 7 steps verified manually.
*   [ ] No console errors.
*   [ ] `bun run lint` passes on both `apps/admin` and `apps/tv`.

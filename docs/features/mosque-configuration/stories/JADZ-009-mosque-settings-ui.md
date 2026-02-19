# JADZ-009: Mosque Settings Page (Form UI)

**Epic:** CORE - Mosque Configuration
**Layer:** L4-feature-ui
**Role:** Frontend
**Estimation:** 3 Points
**Priority:** Must

---

## Objective
Build the Mosque Settings page in the Admin Panel: a form where the Admin can set the Mosque name, geographic coordinates (latitude/longitude), timezone, and prayer calculation method. Uses React Hook Form + Zod for validation.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/mosques/page.tsx` (Server Component — loads initial data)
    *   `apps/admin/app/(dashboard)/mosques/MosqueSettingsForm.tsx` (Client Component — form logic)
*   **Form Fields:**
    *   `name` — Text input (required).
    *   `latitude` — Number input (required, range -90 to 90).
    *   `longitude` — Number input (required, range -180 to 180).
    *   `timezone` — Select dropdown (IANA timezones, pre-populated list).
    *   `calculation_method` — Select dropdown (KEMENAG, MWL, ISNA, EGYPT).
*   **Libraries:**
    *   `react-hook-form` + `@hookform/resolvers` + `zod`.
    *   Shadcn/ui: `Form`, `Input`, `Select`, `Button`, `Toast`.
*   **On Submit:** Calls `upsertMosque()` Server Action from `JADZ-008`.
*   **On Load:** `page.tsx` fetches current mosque data and passes as `defaultValues` to form.

## Acceptance Criteria (Technical)
*   [ ] Form renders pre-populated with existing mosque data (if it exists).
*   [ ] Submitting with empty `name` shows "Name is required" validation error inline.
*   [ ] `latitude` outside `-90..90` shows "Invalid latitude" error.
*   [ ] On successful save: shows a Shadcn `Toast` — "Mosque settings saved ✓".
*   [ ] On server error: shows error toast with message.
*   [ ] Submit button shows loading state while action is in-flight.
*   [ ] Form is fully keyboard-navigable (accessibility).

## Business Rules & Logic
*   If no mosque exists for the current admin, the form is blank (create mode).
*   If a mosque already exists, the form is pre-filled (edit mode). There is only ever 1 mosque per admin account in MVP.

## Dependencies
*   Depends on: JADZ-005 (Shell Layout), JADZ-008 (Server Actions)

## Definition of Done
*   [ ] Form renders, validates, and submits correctly.
*   [ ] Success and error states handled.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

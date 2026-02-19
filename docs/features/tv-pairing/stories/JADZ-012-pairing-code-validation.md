# JADZ-012: Pairing Code Validation Server Action

**Epic:** CORE - TV Pairing Flow
**Layer:** L3-backend
**Role:** Backend
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Implement the server-side logic that validates a 6-digit pairing code entered by the Admin and links the corresponding `screens` row to the Admin's `mosque_id`, changing its status to `ACTIVE`.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/screens/actions.ts`
*   **Functions:**
    *   `validatePairCode(pairingCode: string, screenName: string): Promise<{ success: boolean; screenId?: string; error?: string }>`
        1.  Validates session (get `mosqueId` from session).
        2.  Queries: `SELECT id FROM screens WHERE pairing_code = :code AND status = 'PENDING'`.
        3.  If not found → return `{ success: false, error: 'Invalid or expired code' }`.
        4.  Updates: `UPDATE screens SET mosque_id = :mosqueId, name = :screenName, status = 'ACTIVE', pairing_code = NULL`.
        5.  Returns `{ success: true, screenId }`.
    *   `getScreens(): Promise<Screen[]>` — Lists all screens belonging to the Admin's mosque.
    *   `deleteScreen(screenId: string): Promise<void>` — Removes a screen.
*   **Validation:** `pairingCode` must be exactly 6 alphanumeric characters (Zod: `z.string().length(6).regex(/^[A-Z0-9]+$/)`).

## Acceptance Criteria (Technical)
*   [ ] Valid code → screen updated in DB, `status = 'ACTIVE'`, `pairing_code = NULL`, returns `{ success: true }`.
*   [ ] Invalid code → returns `{ success: false, error: 'Invalid or expired code' }` (no DB mutation).
*   [ ] Already-used code (`status = 'ACTIVE'`) → returns error (idempotency check).
*   [ ] Admin cannot pair a screen belonging to another mosque (RLS enforced).
*   [ ] `pairing_code` is cleared after pairing (security).

## Business Rules & Logic
*   After pairing, `pairing_code` is set to `NULL` to prevent reuse.
*   Only `PENDING` screens can be paired — `ACTIVE` screens return an error.
*   Admin can only link screens to their own mosque.

## Dependencies
*   Depends on: JADZ-001, JADZ-004

## Definition of Done
*   [ ] Server Action implemented and type-safe.
*   [ ] Zod validation in place.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

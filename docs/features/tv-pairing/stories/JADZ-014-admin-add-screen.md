# JADZ-014: Admin — Add Screen Page (Code Entry Form)

**Epic:** CORE - TV Pairing Flow
**Layer:** L4-feature-ui
**Role:** Frontend (Admin)
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Build the Admin Panel's "Screens" management page, including an "Add Screen" form where the Admin enters the TV's 6-digit pairing code and a display name to activate the screen. Also renders a list of already-paired screens for the Mosque.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/screens/page.tsx` (Server Component — loads screen list)
    *   `apps/admin/app/(dashboard)/screens/AddScreenForm.tsx` (Client Component — pairing form)
    *   `apps/admin/app/(dashboard)/screens/ScreenList.tsx` (Client Component — list of paired screens)
*   **`AddScreenForm` Fields:**
    *   `pairingCode` — Text input, maxLength=6, uppercase transform, label "Pairing Code".
    *   `screenName` — Text input, label "Screen Name" (e.g., "Main Hall").
    *   Submit Button: "Activate Screen".
*   **On Submit:** Calls `validatePairCode()` from `JADZ-012`.
*   **`ScreenList` columns:** Name, Status (badge), Last Seen, Delete (icon button).
*   **Libraries:** `react-hook-form` + `zod`, Shadcn/ui `Form`, `Input`, `Badge`, `Table`, `Button`, `Toast`.

## Acceptance Criteria (Technical)
*   [ ] Pairing code input auto-uppercases typed characters.
*   [ ] Submitting invalid code (wrong format) shows inline validation error before hitting server.
*   [ ] Submitting valid code → success toast "Screen activated ✓" + new screen appears in list.
*   [ ] Submitting invalid/expired code → error toast with server error message.
*   [ ] Screen list shows `status` badge (green ACTIVE, grey OFFLINE).
*   [ ] Delete button removes screen from list (calls `deleteScreen()` from JADZ-012).
*   [ ] If mosque has not been configured yet (no `mosqueId`), redirect to `/dashboard/mosques` with toast "Please set up your Mosque first".

## Business Rules & Logic
*   `pairingCode` input should reject lowercase and special chars via `onChange` handler (transform to uppercase).
*   Admin must have a configured Mosque before pairing screens.
*   Up to 10 screens per Mosque in MVP [ASSUMPTION].

## Dependencies
*   Depends on: JADZ-005 (Admin Shell), JADZ-008 (Mosque CRUD — to verify mosque exists), JADZ-012 (Server Actions)

## Definition of Done
*   [ ] Add Screen form validates, submits, and shows success/error state.
*   [ ] Screen list renders correctly.
*   [ ] Delete works correctly.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

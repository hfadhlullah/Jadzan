# JADZ-023: Admin — Announcements Manager Page

**Epic:** CORE - Content Manager
**Layer:** L4-feature-ui
**Role:** Frontend (Admin)
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Build the Announcements Manager page in the Admin Panel: a simple form to add new ticker text and a list of existing announcements with toggle/delete controls.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/announcements/page.tsx` (Server Component — loads list)
    *   `apps/admin/app/(dashboard)/announcements/AddAnnouncementForm.tsx` (Client Component)
    *   `apps/admin/app/(dashboard)/announcements/AnnouncementList.tsx` (Client Component)
*   **`AddAnnouncementForm` fields:**
    *   `text` — Textarea, maxLength=500, placeholder "e.g. Pengajian malam Jumat jam 20:00".
    *   Submit Button: "Add Announcement".
*   **`AnnouncementList` columns:**
    *   Text (truncated, full on hover).
    *   Active toggle switch.
    *   Delete button (with confirm dialog).
    *   Created at date.
*   **Libraries:** `react-hook-form` + `zod`, Shadcn/ui `Textarea`, `Switch`, `Table`, `Button`, `Dialog`.

## Acceptance Criteria (Technical)
*   [ ] Submitting valid text → announcement added to list, form clears.
*   [ ] Submitting empty text → inline Zod validation error.
*   [ ] Toggle switch calls `toggleAnnouncement()` and reflects state change immediately.
*   [ ] Delete calls `deleteAnnouncement()` — confirm dialog shown first.
*   [ ] Character count shown below textarea (e.g., "32 / 500").
*   [ ] Empty state: "No announcements yet. Add your first one above."

## Business Rules & Logic
*   Newly created announcements default to `is_active = true`.
*   Deactivated announcements stay in the list (soft disable — not deleted).

## Dependencies
*   Depends on: JADZ-005 (Admin Shell), JADZ-021 (Server Actions)

## Definition of Done
*   [ ] Add, toggle, delete all functional.
*   [ ] Empty state shown correctly.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

# JADZ-021: Announcements (Ticker) CRUD Server Actions

**Epic:** CORE - Content Manager
**Layer:** L3-backend
**Role:** Backend
**Estimation:** 1 Point
**Priority:** Must

---

## Objective
Implement server actions for managing ticker `announcements` records — create, list, toggle active state, delete.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/announcements/actions.ts`
*   **Functions:**
    *   `createAnnouncement(text: string): Promise<Announcement>` — Inserts new announcement, `is_active = true` by default.
    *   `getAnnouncements(): Promise<Announcement[]>` — Lists all announcements for the mosque.
    *   `toggleAnnouncement(id: string, isActive: boolean): Promise<void>` — Activates/deactivates.
    *   `deleteAnnouncement(id: string): Promise<void>` — Hard deletes.
    *   `reorderAnnouncements(ids: string[]): Promise<void>` — [ASSUMPTION] Updates display order if needed. Skip in MVP if not required.
*   **Validation (Zod):**
    *   `text`: required string, min 3 chars, max 500 chars.

## Acceptance Criteria (Technical)
*   [ ] `createAnnouncement("Pengajian jam 20:00")` → row inserted with `is_active = true`.
*   [ ] `toggleAnnouncement(id, false)` → `is_active = false`, not deleted.
*   [ ] `deleteAnnouncement(id)` → row removed from DB.
*   [ ] `getAnnouncements()` only returns announcements for the current Admin's mosque (RLS).
*   [ ] Empty `text` → Zod validation error returned.

## Business Rules & Logic
*   Only `is_active = true` announcements are fetched by the TV.
*   Max 20 active announcements per mosque in MVP [ASSUMPTION].

## Dependencies
*   Depends on: JADZ-001, JADZ-004

## Definition of Done
*   [ ] All server actions implemented and type-safe.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

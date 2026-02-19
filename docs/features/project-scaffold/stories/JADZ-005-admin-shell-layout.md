# JADZ-005: Admin Shell Layout (Sidebar + Header)

**Epic:** FOUNDATION - Project Scaffold
**Layer:** L4-feature-ui
**Role:** Frontend
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Build the persistent Admin Panel shell: a collapsible sidebar for navigation and a top header bar with user info and sign-out. This layout wraps all authenticated dashboard pages.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/layout.tsx` (Authenticated layout wrapper)
    *   `apps/admin/components/layout/Sidebar.tsx`
    *   `apps/admin/components/layout/Header.tsx`
*   **Sidebar Navigation Links:**
    *   `/dashboard` — Dashboard
    *   `/dashboard/mosques` — Mosque Settings
    *   `/dashboard/screens` — Screens
    *   `/dashboard/media` — Content Manager
    *   `/dashboard/announcements` — Announcements
*   **Header Content:**
    *   User email (from Supabase session).
    *   Sign-out button (calls Server Action from JADZ-004).
*   **Icons:** `lucide-react`.

## Acceptance Criteria (Technical)
*   [ ] Sidebar renders all navigation links with active state highlighting.
*   [ ] Sidebar collapses to icon-only mode on smaller viewports (responsive).
*   [ ] Header shows authenticated user's email correctly.
*   [ ] Sign-out button triggers sign-out and redirects to `/login`.
*   [ ] Layout wraps all pages under `app/(dashboard)/`.

## Business Rules & Logic
*   Active nav link must be visually distinct (using `--color-primary` border or background).
*   Layout must be server-rendered (no hydration flash).

## Dependencies
*   Depends on: JADZ-002, JADZ-004

## Definition of Done
*   [ ] Sidebar + Header render without errors.
*   [ ] All nav links point to correct routes.
*   [ ] Lint/Type check clear.

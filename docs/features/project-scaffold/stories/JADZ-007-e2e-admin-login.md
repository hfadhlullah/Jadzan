# JADZ-007: E2E — Admin Login + Dashboard Visible

**Epic:** FOUNDATION - Project Scaffold
**Layer:** L5-integration
**Role:** Fullstack
**Estimation:** 1 Point
**Priority:** Must

---

## Objective
Validate the end-to-end integration of the Admin authentication flow: a user can load the app, log in with a seeded test admin account, and see the authenticated dashboard shell (Sidebar + Header).

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/page.tsx` (Minimal dashboard landing page with "Welcome" message)
    *   `supabase/seed.sql` (Insert test admin user via `auth.users` or use Supabase Dashboard)
*   **Test Account:** `admin@jadzan.test` / `password123` (for development only)

## Acceptance Criteria (Technical)
*   [ ] Browser loads `http://localhost:3000` → redirects to `/login`.
*   [ ] Entering correct credentials → redirects to `/dashboard`.
*   [ ] Dashboard shows Sidebar with all nav links and Header with the user's email.
*   [ ] Refreshing the page at `/dashboard` does NOT log the user out (session persists).
*   [ ] Clicking Sign Out → redirects to `/login` and cannot access `/dashboard` again without logging in.

## Business Rules & Logic
*   This story is a manual smoke test / integration verification. No automated test framework required at this stage.
*   If the test fails, the blocker is reported back to JADZ-002, JADZ-003, or JADZ-004 as appropriate.

## Dependencies
*   Depends on: JADZ-001, JADZ-002, JADZ-004, JADZ-005

## Definition of Done
*   [ ] Manual smoke test of the E2E login flow passes.
*   [ ] `/dashboard` route renders Admin Shell without console errors.
*   [ ] Lint/Type check clear.

# JADZ-004: Supabase Auth (Admin Login/Session)

**Epic:** FOUNDATION - Project Scaffold
**Layer:** L3-backend
**Role:** Fullstack
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Implement Email/Password authentication for the Admin Panel using Supabase Auth with Next.js Server Actions and middleware-based route protection.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(auth)/login/page.tsx` (Login page UI)
    *   `apps/admin/app/(auth)/login/actions.ts` (Server Action: signIn, signOut)
    *   `apps/admin/lib/supabase/server.ts` (Supabase server client factory)
    *   `apps/admin/lib/supabase/client.ts` (Supabase browser client factory)
    *   `apps/admin/middleware.ts` (Protects `/dashboard` routes, redirects to `/login`)
*   **Supabase Packages:**
    *   `@supabase/ssr` (Next.js App Router compatible)
    *   `@supabase/supabase-js`
*   **Routes Protected by Middleware:**
    *   `/dashboard` and all sub-routes.

## Acceptance Criteria (Technical)
*   [ ] `POST /login` with valid email/password sets a session cookie and redirects to `/dashboard`.
*   [ ] `POST /login` with invalid credentials shows an error message (no redirect).
*   [ ] Accessing `/dashboard` without a session redirects to `/login`.
*   [ ] Sign-out clears the session cookie and redirects to `/login`.
*   [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are loaded from `.env.local`.

## Business Rules & Logic
*   Session cookies must be HTTP-only and Secure in production.
*   No "remember me" — session duration is managed by Supabase defaults.

## Dependencies
*   Depends on: JADZ-001, JADZ-002

## Definition of Done
*   [ ] Login flow works end-to-end.
*   [ ] Protected routes redirect correctly.
*   [ ] Lint/Type check clear.

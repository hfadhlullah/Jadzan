# JADZ-002: Init Next.js Admin App + Design Tokens

**Epic:** FOUNDATION - Project Scaffold
**Layer:** L2-ui-foundation
**Role:** Frontend
**Estimation:** 3 Points
**Priority:** Must

---

## Objective
Bootstrap the Next.js 14 (App Router) Admin Panel project with correct folder structure, Tailwind CSS configuration, Shadcn/ui setup, design tokens (colors, fonts), and base layouts matching the approved Design System.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/` (root of Next.js project)
    *   `apps/admin/app/layout.tsx` (root layout with font loading)
    *   `apps/admin/app/globals.css` (Tailwind base + CSS variables for tokens)
    *   `apps/admin/tailwind.config.ts` (extend with Jadzan brand colors)
    *   `apps/admin/components/ui/` (Shadcn/ui installed components)
    *   `apps/admin/lib/utils.ts` (cn() utility)
*   **Fonts:** Load `Inter` from `next/font/google`.
*   **Design Tokens (CSS Variables):**
    *   `--color-primary: #059669` (Emerald Green)
    *   `--color-accent: #D97706` (Gold)
    *   `--color-background: #0F172A`
    *   `--color-surface: #1E293B`
    *   `--color-text-primary: #F8FAFC`
    *   `--color-text-secondary: #94A3B8`
    *   `--color-border: #334155`

## Acceptance Criteria (Technical)
*   [ ] `bun run dev` runs without errors on `localhost:3000`.
*   [ ] `bun run build` completes successfully.
*   [ ] Design tokens visible as CSS variables in the browser DevTools.
*   [ ] Shadcn/ui `Button` component renders correctly in a test page.
*   [ ] TypeScript strict mode is enabled (`"strict": true` in `tsconfig.json`).
*   [ ] ESLint + Prettier configured and passing.

## Business Rules & Logic
*   Dark mode is the default; do not implement a light/dark toggle at this stage.
*   The app must be deployed to Vercel (ensure no hardcoded localhost references).

## Dependencies
*   Depends on: JADZ-001 (for Supabase types)

## Definition of Done
*   [ ] Project structure committed.
*   [ ] `bun run lint` passes.
*   [ ] `bun run build` passes.
*   [ ] Design tokens documented in `docs/design-system.md` are reflected in code.

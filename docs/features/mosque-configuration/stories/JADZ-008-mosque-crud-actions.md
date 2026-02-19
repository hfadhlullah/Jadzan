# JADZ-008: Mosque CRUD Server Actions

**Epic:** CORE - Mosque Configuration
**Layer:** L3-backend
**Role:** Backend
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Implement type-safe Supabase Server Actions for creating, reading, and updating a Mosque's profile and configuration data. These actions are consumed by the Admin Panel UI pages.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/admin/app/(dashboard)/mosques/actions.ts`
*   **Functions:**
    *   `getMosque(mosqueId: string): Promise<Mosque>` — Fetches the current Admin's mosque.
    *   `upsertMosque(data: UpsertMosqueInput): Promise<void>` — Creates or updates mosque profile.
    *   `updateIqomahDelays(mosqueId: string, delays: IqomahDelays): Promise<void>` — Updates the `iqomah_delays` JSON field.
*   **Types (from `types/supabase.ts`):**
    ```ts
    type IqomahDelays = {
        fajr: number; dhuhr: number; asr: number; maghrib: number; isha: number;
    };
    type UpsertMosqueInput = {
        name: string; latitude: number; longitude: number;
        timezone: string; calculation_method: string; iqomah_delays: IqomahDelays;
    };
    ```
*   **Auth:** All actions use `createServerClient()` and validate the session before any DB operation.

## Acceptance Criteria (Technical)
*   [ ] `upsertMosque()` with valid data returns no error and row is present in DB.
*   [ ] `upsertMosque()` called without a session throws an `Unauthorized` error.
*   [ ] `updateIqomahDelays()` correctly writes nested JSON to `iqomah_delays` column.
*   [ ] All inputs are validated with **Zod** before hitting Supabase.
*   [ ] TypeScript: no `any` types used.

## Business Rules & Logic
*   An Admin can only upsert their own Mosque (enforced by Supabase RLS + validated in action).
*   `calculation_method` must be one of: `KEMENAG`, `MWL`, `ISNA`, `EGYPT`.
*   All 5 prayer delays must be provided in `updateIqomahDelays` — no partial updates.

## Dependencies
*   Depends on: JADZ-001, JADZ-004

## Definition of Done
*   [ ] Server Actions implemented and type-safe.
*   [ ] Zod validation schemas written.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.

# JADZ-001: Supabase Schema Initialization

**Epic:** FOUNDATION - Project Scaffold
**Layer:** L1-data
**Role:** Backend
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Create the initial Supabase database schema including all core tables, enums, relationships, foreign keys, and Row Level Security (RLS) policies for the Jadzan system.

## Technical Specifications
*   **Proposed Files:**
    *   `supabase/migrations/001_initial_schema.sql`
    *   `supabase/seed.sql` (seed calculation method enum values)
*   **Tables:**
    *   `users` (managed by Supabase Auth, extend `auth.users`)
    *   `mosques` (`id`, `name`, `latitude`, `longitude`, `timezone`, `calculation_method`, `iqomah_delays` JSON, `created_at`)
    *   `screens` (`id`, `mosque_id FK`, `name`, `pairing_code`, `status`, `orientation`, `last_seen`, `created_at`)
    *   `media_content` (`id`, `mosque_id FK`, `type`, `url`, `label`, `duration`, `is_active`, `created_at`)
    *   `targeted_media` (`media_id FK`, `screen_id FK` — junction table)
    *   `announcements` (`id`, `mosque_id FK`, `text`, `is_active`, `created_at`)
*   **Enums:** `screen_status` (ACTIVE, OFFLINE, PENDING), `media_type` (IMAGE, VIDEO), `orientation` (LANDSCAPE, PORTRAIT)

## Acceptance Criteria (Technical)
*   [ ] Migration runs cleanly via `supabase db push` with zero errors.
*   [ ] All FK constraints are valid.
*   [ ] RLS is enabled on all tables.
*   [ ] RLS Policy: Admins can only CRUD rows belonging to their `mosque_id`.
*   [ ] RLS Policy: Screens (device token) can only READ rows belonging to their `mosque_id`.
*   [ ] `iqomah_delays` column accepts valid JSON (e.g., `{"fajr":20,"dhuhr":10,"asr":10,"maghrib":10,"isha":10}`).
*   [ ] TypeScript types are auto-generated via `supabase gen types typescript`.

## Business Rules & Logic
*   `pairing_code` must be unique across all records in the `screens` table at time of generation.
*   `iqomah_delays` defaults to `{"fajr":20,"dhuhr":10,"asr":10,"maghrib":10,"isha":10}`.
*   `media_content.duration` defaults to `10` (seconds).

## Dependencies
*   Depends on: None (Foundation)

## Definition of Done
*   [ ] Migration file committed.
*   [ ] Types generated and exported to `types/supabase.ts`.
*   [ ] Lint/Type check clear.

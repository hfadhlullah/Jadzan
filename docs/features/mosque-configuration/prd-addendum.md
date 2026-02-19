# PRD Addendum — Mosque Configuration

| Metadata | Details |
| :--- | :--- |
| **Feature** | Mosque Configuration |
| **Parent Epic** | FOUNDATION - Project Scaffold |
| **Status** | Ready for Development |
| **Stories** | JADZ-008, JADZ-009, JADZ-010, JADZ-011 |

---

## 1. Feature Overview

The Mosque Configuration feature allows a Mosque Admin to set up and manage their Mosque's core identity and prayer calculation settings via the Admin Panel. This data is the foundation for all prayer time calculations on the TV display.

---

## 2. User Stories

| ID | Story | Acceptance Criteria (Given-When-Then) |
| :--- | :--- | :--- |
| US-01 | As a Mosque Admin, I can create/update my Mosque profile (name, latitude, longitude, timezone) so that the system can calculate accurate prayer times. | **Given** I am logged in, **When** I submit the Mosque Settings form with valid coords, **Then** the `mosques` table is upserted and a success toast is shown. |
| US-02 | As a Mosque Admin, I can select a prayer Calculation Method (Kemenag, MWL, ISNA) so that times match my local jurisprudence. | **Given** I am on the Settings page, **When** I select "Kemenag" and save, **Then** `calculation_method` is updated and reflected in the TV's prayer engine. |
| US-03 | As a Mosque Admin, I can set Iqomah delay durations per prayer so that the countdown timer is accurate for my congregation. | **Given** I am on the Settings page, **When** I set Fajr Iqomah to 20 mins and save, **Then** `iqomah_delays.fajr` = 20 is persisted in the DB. |

---

## 3. ERD Delta

None. This feature uses the existing `mosques` table defined in `JADZ-001`.

---

## 4. API Contract

None. This feature uses the Supabase client SDK directly with RLS-enforced access:
- `supabase.from('mosques').upsert(...)` — Admin write.
- `supabase.from('mosques').select('*').eq('id', mosqueId)` — Admin read.

---

## 5. Integration Notes

*   **Realtime Propagation**: When a Mosque Admin saves config changes, the TV app must receive the update within < 1 minute. This is achieved via the Supabase Realtime subscription on the `mosques` table (subscribed in `JADZ-006` shell).
*   **No Breaking Changes**: All fields have defaults. Updating one field does not invalidate others.

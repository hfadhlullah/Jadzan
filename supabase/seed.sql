-- ============================================================
-- Jadzan — Seed File
-- JADZ-001 / JADZ-007: Test Admin Account
-- ============================================================

-- Note: Admin users are created via Supabase Auth Dashboard or
-- via the Supabase CLI: `supabase auth create --email admin@jadzan.test --password password123`
--
-- This seed inserts a sample mosque row AFTER the user is created.
-- Replace the UUID below with the actual user ID from auth.users.

-- INSERT INTO mosques (user_id, name, latitude, longitude, timezone, calculation_method)
-- VALUES (
--   '<auth-user-uuid-here>',
--   'Masjid Al-Falah (Dev)',
--   -6.2088,
--   106.8456,
--   'Asia/Jakarta',
--   'KEMENAG'
-- );

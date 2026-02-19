-- ============================================================
-- Jadzan — Migration 005
-- JADZ-035: Add background and address to mosques
-- ============================================================

ALTER TABLE mosques ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE mosques ADD COLUMN IF NOT EXISTS background_url TEXT;
ALTER TABLE mosques ADD COLUMN IF NOT EXISTS arabesque_opacity DOUBLE PRECISION DEFAULT 0.05;

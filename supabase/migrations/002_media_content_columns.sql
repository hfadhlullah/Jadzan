-- ============================================================
-- Jadzan — Migration 002
-- JADZ-020: Add title and storage_key columns to media_content
-- ============================================================

-- Add title column (alias for label, will replace it)
ALTER TABLE media_content ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';

-- Add storage_key column for Supabase Storage path
ALTER TABLE media_content ADD COLUMN IF NOT EXISTS storage_key TEXT;

-- Backfill title from existing label data
UPDATE media_content SET title = label WHERE title = '' AND label != '';

-- Make duration nullable (allows null for images without an explicit duration)
ALTER TABLE media_content ALTER COLUMN duration DROP NOT NULL;
ALTER TABLE media_content ALTER COLUMN duration SET DEFAULT NULL;

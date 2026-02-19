-- ============================================================
-- Jadzan — Allow TV to read Mosque Config
-- JADZ-034: Fix RLS for Display screen
-- ============================================================

-- Allow the TV app (anon) to read mosque configuration (latitude, longitude, etc.)
-- This is required to start the prayer engine calculation.
CREATE POLICY "mosques: device read access"
  ON mosques FOR SELECT
  TO anon
  USING (true);

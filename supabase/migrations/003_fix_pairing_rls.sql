-- ============================================================
-- Jadzan — Fix Pairing RLS
-- JADZ-033: Update screens RLS to allow pairing flow
-- ============================================================

-- Allow authenticated admins to find PENDING screens that don't belong to anyone yet.
-- This is required for the pairScreen server action to find the screen by its code.
CREATE POLICY "screens: admin can select pending screens"
  ON screens FOR SELECT
  TO authenticated
  USING (status = 'PENDING' AND mosque_id IS NULL);

-- Allow authenticated admins to update PENDING screens to ACTIVE and set their mosque_id.
CREATE POLICY "screens: admin can update pending screens"
  ON screens FOR UPDATE
  TO authenticated
  USING (status = 'PENDING' AND mosque_id IS NULL)
  WITH CHECK (
    status = 'ACTIVE' AND 
    mosque_id IN (SELECT id FROM mosques WHERE user_id = auth.uid())
  );

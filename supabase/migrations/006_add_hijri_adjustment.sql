-- Add hijri_adjustment column to mosques table
ALTER TABLE mosques 
ADD COLUMN hijri_adjustment integer DEFAULT 0;

COMMENT ON COLUMN mosques.hijri_adjustment IS 'Manual adjustment for Hijri date in days (-2, -1, 0, 1, 2)';

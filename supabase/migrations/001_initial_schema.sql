-- ============================================================
-- Jadzan — Initial Schema Migration
-- JADZ-001: Supabase Schema Initialization
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────
CREATE TYPE screen_status AS ENUM ('PENDING', 'ACTIVE', 'OFFLINE');
CREATE TYPE media_type    AS ENUM ('IMAGE', 'VIDEO');
CREATE TYPE orientation   AS ENUM ('LANDSCAPE', 'PORTRAIT');

-- ─────────────────────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────────────────────

-- mosques
-- One mosque per admin account in MVP.
CREATE TABLE mosques (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  latitude           DOUBLE PRECISION NOT NULL DEFAULT 0,
  longitude          DOUBLE PRECISION NOT NULL DEFAULT 0,
  timezone           TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  calculation_method TEXT NOT NULL DEFAULT 'KEMENAG',
  iqomah_delays      JSONB NOT NULL DEFAULT '{"fajr":20,"dhuhr":10,"asr":10,"maghrib":10,"isha":10}'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- screens
-- Physical TV devices linked to a mosque.
CREATE TABLE screens (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_id    UUID REFERENCES mosques(id) ON DELETE CASCADE,
  name         TEXT,
  pairing_code TEXT UNIQUE,
  status       screen_status NOT NULL DEFAULT 'PENDING',
  orientation  orientation NOT NULL DEFAULT 'LANDSCAPE',
  last_seen    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- media_content
-- Images and videos uploaded by admins.
CREATE TABLE media_content (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_id  UUID NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
  type       media_type NOT NULL DEFAULT 'IMAGE',
  url        TEXT NOT NULL,
  label      TEXT NOT NULL DEFAULT '',
  duration   INTEGER NOT NULL DEFAULT 10,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- targeted_media
-- Junction table: assigns specific media to specific screens.
-- If no row exists for a media_id, it broadcasts to ALL screens.
CREATE TABLE targeted_media (
  media_id  UUID NOT NULL REFERENCES media_content(id) ON DELETE CASCADE,
  screen_id UUID NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  PRIMARY KEY (media_id, screen_id)
);

-- announcements
-- Ticker text entries for the TV bottom bar.
CREATE TABLE announcements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_id  UUID NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_mosques_user_id         ON mosques(user_id);
CREATE INDEX idx_screens_mosque_id        ON screens(mosque_id);
CREATE INDEX idx_screens_pairing_code     ON screens(pairing_code) WHERE pairing_code IS NOT NULL;
CREATE INDEX idx_media_content_mosque_id  ON media_content(mosque_id);
CREATE INDEX idx_announcements_mosque_id  ON announcements(mosque_id);

-- ─────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mosques_updated_at
  BEFORE UPDATE ON mosques
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
ALTER TABLE mosques         ENABLE ROW LEVEL SECURITY;
ALTER TABLE screens         ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_content   ENABLE ROW LEVEL SECURITY;
ALTER TABLE targeted_media  ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements   ENABLE ROW LEVEL SECURITY;

-- ── mosques ──────────────────────────────────────────────────
-- Admins can only see/edit their own mosque.
CREATE POLICY "mosques: admin full access"
  ON mosques FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── screens ──────────────────────────────────────────────────
-- Admin can manage screens belonging to their mosque.
CREATE POLICY "screens: admin full access"
  ON screens FOR ALL
  USING (
    mosque_id IN (SELECT id FROM mosques WHERE user_id = auth.uid())
  )
  WITH CHECK (
    mosque_id IN (SELECT id FROM mosques WHERE user_id = auth.uid())
  );

-- Unauthenticated (TV device) can INSERT a PENDING screen to self-register.
CREATE POLICY "screens: device self-register"
  ON screens FOR INSERT
  TO anon
  WITH CHECK (status = 'PENDING' AND mosque_id IS NULL);

-- TV device can read its own screen row by pairing code (for polling).
CREATE POLICY "screens: device read by pairing code"
  ON screens FOR SELECT
  TO anon
  USING (true); -- filtered in app by pairing_code / id

-- ── media_content ────────────────────────────────────────────
CREATE POLICY "media: admin full access"
  ON media_content FOR ALL
  USING (
    mosque_id IN (SELECT id FROM mosques WHERE user_id = auth.uid())
  )
  WITH CHECK (
    mosque_id IN (SELECT id FROM mosques WHERE user_id = auth.uid())
  );

-- TV app (anon) can read active media for its mosque.
CREATE POLICY "media: device read active"
  ON media_content FOR SELECT
  TO anon
  USING (is_active = true);

-- ── targeted_media ───────────────────────────────────────────
CREATE POLICY "targeted_media: admin full access"
  ON targeted_media FOR ALL
  USING (
    media_id IN (
      SELECT id FROM media_content
      WHERE mosque_id IN (SELECT id FROM mosques WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "targeted_media: device read"
  ON targeted_media FOR SELECT
  TO anon
  USING (true);

-- ── announcements ────────────────────────────────────────────
CREATE POLICY "announcements: admin full access"
  ON announcements FOR ALL
  USING (
    mosque_id IN (SELECT id FROM mosques WHERE user_id = auth.uid())
  )
  WITH CHECK (
    mosque_id IN (SELECT id FROM mosques WHERE user_id = auth.uid())
  );

CREATE POLICY "announcements: device read active"
  ON announcements FOR SELECT
  TO anon
  USING (is_active = true);

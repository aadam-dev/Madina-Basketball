-- First-party visit tracking for the admin portal.
-- Run in the Madina Supabase SQL editor (project nzquaqajqyhmlbfjivow).
-- Service role writes only. RLS on, no public policies.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL,
  referrer TEXT,
  ip TEXT,
  user_agent TEXT,
  browser TEXT,
  os TEXT,
  device TEXT,
  language TEXT,
  screen TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_visits_created ON site_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_path ON site_visits(path, created_at DESC);

ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
-- No public policies. The service role bypasses RLS.

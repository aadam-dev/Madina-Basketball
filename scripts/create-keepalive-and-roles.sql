-- Keepalive + role applications (volunteer, coach, management).
-- Run in the Supabase SQL editor after create-operations-tables.sql.
-- Service role only. RLS on, no public policies.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Real Postgres write activity so free-tier projects stay awake.
CREATE TABLE IF NOT EXISTS keepalive (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  last_ping TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT
);

INSERT INTO keepalive (id, note)
VALUES (1, 'Madina Basketball keepalive')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS role_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL CHECK (role IN ('volunteer', 'coach', 'management')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_conversation', 'accepted', 'declined', 'inactive')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  area TEXT,
  area_other TEXT,
  -- Volunteer
  volunteer_help TEXT[] NOT NULL DEFAULT '{}',
  volunteer_availability TEXT,
  -- Coach / trainer
  coaching_experience TEXT,
  sessions_available TEXT,
  reference_name TEXT,
  reference_phone TEXT,
  -- Management
  management_areas TEXT[] NOT NULL DEFAULT '{}',
  weekly_commitment TEXT,
  -- Shared
  message TEXT,
  consents JSONB NOT NULL DEFAULT '[]'::jsonb,
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_role_applications_role_status
  ON role_applications(role, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_role_applications_phone
  ON role_applications(phone);

ALTER TABLE keepalive ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_applications ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_notifications DROP CONSTRAINT IF EXISTS admin_notifications_type_check;
ALTER TABLE admin_notifications
  ADD CONSTRAINT admin_notifications_type_check
  CHECK (type IN (
    'booking',
    'teamsheet',
    'registration',
    'contact',
    'support',
    'join',
    'general'
  ));

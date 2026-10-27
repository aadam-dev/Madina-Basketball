-- Madina Basketball — paste into SQL editor for project nzquaqajqyhmlbfjivow
-- https://supabase.com/dashboard/project/nzquaqajqyhmlbfjivow/sql/new
-- (Open that URL in the browser profile that owns Madina Basketball.)

-- ===== operations =====
-- Operations intake: registrations, bookings, messages, support offers.
-- Run this in the Supabase SQL editor.
-- Service role writes only. RLS is on and there are no public policies,
-- so the anon key cannot read phones, guardians, or medical notes.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS player_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'waitlist', 'inactive')),
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  area TEXT NOT NULL,
  area_other TEXT,
  skill_level TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  heard_from TEXT,
  emergency_name TEXT NOT NULL,
  emergency_relationship TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  guardian_name TEXT,
  guardian_relationship TEXT,
  guardian_phone TEXT,
  guardian_consent BOOLEAN NOT NULL DEFAULT FALSE,
  medical_notes TEXT,
  photo_consent BOOLEAN NOT NULL DEFAULT FALSE,
  consents JSONB NOT NULL DEFAULT '[]'::jsonb,
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_player_registrations_status ON player_registrations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_player_registrations_phone ON player_registrations(phone);

CREATE TABLE IF NOT EXISTS court_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'declined', 'cancelled')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  organisation TEXT,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  duration TEXT NOT NULL,
  purpose TEXT NOT NULL,
  participants INTEGER NOT NULL,
  details TEXT,
  consents JSONB NOT NULL DEFAULT '[]'::jsonb,
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_court_bookings_status ON court_bookings(status, booking_date);
CREATE INDEX IF NOT EXISTS idx_court_bookings_slot ON court_bookings(booking_date, time_slot);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_method TEXT NOT NULL,
  volunteer_help TEXT[] NOT NULL DEFAULT '{}',
  volunteer_availability TEXT,
  consents JSONB NOT NULL DEFAULT '[]'::jsonb,
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status, created_at DESC);

CREATE TABLE IF NOT EXISTS support_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_conversation', 'pledged', 'received', 'declined')),
  name TEXT NOT NULL,
  organisation TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  preferred_contact TEXT NOT NULL,
  kinds TEXT[] NOT NULL DEFAULT '{}',
  intent TEXT NOT NULL,
  lighting_note TEXT,
  item_description TEXT,
  quantity INTEGER,
  cash_amount NUMERIC(12, 2),
  message TEXT,
  recognize_publicly BOOLEAN NOT NULL DEFAULT FALSE,
  consents JSONB NOT NULL DEFAULT '[]'::jsonb,
  received_on DATE,
  received_summary TEXT,
  cash_received NUMERIC(12, 2),
  in_kind_description TEXT,
  quantity_received INTEGER,
  estimated_value NUMERIC(12, 2),
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_offers_status ON support_offers(status, created_at DESC);

CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  summary TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE player_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- No public policies. The service role bypasses RLS.

ALTER TABLE admin_notifications DROP CONSTRAINT IF EXISTS admin_notifications_type_check;
ALTER TABLE admin_notifications
  ADD CONSTRAINT admin_notifications_type_check
  CHECK (type IN ('booking', 'teamsheet', 'registration', 'contact', 'support', 'join', 'general'));

-- ===== keepalive + roles =====
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

-- ===== site visits =====
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

-- =====================================================
-- MISSING TABLES SETUP
-- =====================================================
-- Run this AFTER running COMPLETE_DATABASE_SETUP.sql
-- This script creates tables that are missing from the main setup
-- =====================================================

-- =====================================================
-- 1. EVENTS TABLE
-- =====================================================
-- For managing events (games, tournaments, training sessions, etc.)

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Event Information
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL, -- Event date (YYYY-MM-DD)
  time TEXT, -- Event time (HH:MM format)
  location TEXT,
  
  -- Event Classification
  type TEXT NOT NULL CHECK (type IN ('game', 'tournament', 'training', 'event', 'other')),
  teams TEXT, -- Teams involved (e.g., "Team A vs Team B")
  
  -- Media & Links
  image_url TEXT, -- Event image URL
  registration_link TEXT, -- Registration form link
  
  -- Status & Features
  status TEXT CHECK (status IN ('upcoming', 'completed', 'cancelled')) DEFAULT 'upcoming',
  featured BOOLEAN DEFAULT FALSE, -- Feature on homepage
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for events table
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- =====================================================
-- 2. TEAM_MEMBERS TABLE
-- =====================================================
-- For managing leadership/executive team members
-- Note: This is different from the 'staff' table
-- Used for the /team page (executive, coach, maintenance, stakeholder, media sections)

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Member Information
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- e.g., "Executive Lead", "Head Coach", "Maintenance Lead"
  section TEXT NOT NULL CHECK (section IN ('executive', 'coach', 'maintenance', 'stakeholder', 'media')),
  
  -- Media & Bio
  image_url TEXT,
  bio TEXT,
  
  -- Social Links (stored as JSON)
  social_links JSONB, -- Array of {platform: string, url: string}
  
  -- Display Order
  order_index INTEGER DEFAULT 0, -- For sorting within section
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for team_members table
CREATE INDEX IF NOT EXISTS idx_team_members_section ON team_members(section);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_team_members_created_at ON team_members(created_at DESC);

-- =====================================================
-- 3. CONTENT_SECTIONS TABLE
-- =====================================================
-- CMS for managing page content dynamically
-- Used by /admin/content page

CREATE TABLE IF NOT EXISTS content_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content Identification
  page TEXT NOT NULL, -- Page identifier (e.g., 'home', 'about', 'journey')
  section_key TEXT NOT NULL, -- Section identifier (e.g., 'hero_title', 'mission_text')
  
  -- Content Data
  content TEXT, -- Can store text, HTML, or JSON depending on section type
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one section per page
  UNIQUE(page, section_key)
);

-- Indexes for content_sections table
CREATE INDEX IF NOT EXISTS idx_content_sections_page ON content_sections(page);
CREATE INDEX IF NOT EXISTS idx_content_sections_key ON content_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_content_sections_updated ON content_sections(updated_at DESC);

-- =====================================================
-- 4. ADMIN_NOTIFICATIONS TABLE
-- =====================================================
-- Notification system for admin dashboard

CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Notification Details
  type TEXT NOT NULL CHECK (type IN ('booking', 'teamsheet', 'registration', 'contact', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Additional Data
  data JSONB, -- Optional: structured data for the notification
  link TEXT, -- Optional: link to related page/resource
  
  -- Status
  read BOOLEAN DEFAULT FALSE, -- Whether notification has been read
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for admin_notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_read ON admin_notifications(read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON admin_notifications(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- EVENTS TABLE POLICIES
-- =====================================================

-- Public can view events
CREATE POLICY IF NOT EXISTS "Anyone can view events" ON events
  FOR SELECT USING (true);

-- Service role can manage events
CREATE POLICY IF NOT EXISTS "Service role can insert events" ON events
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can update events" ON events
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can delete events" ON events
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- TEAM_MEMBERS TABLE POLICIES
-- =====================================================

-- Public can view team members
CREATE POLICY IF NOT EXISTS "Anyone can view team members" ON team_members
  FOR SELECT USING (true);

-- Service role can manage team members
CREATE POLICY IF NOT EXISTS "Service role can insert team members" ON team_members
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can update team members" ON team_members
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can delete team members" ON team_members
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- CONTENT_SECTIONS TABLE POLICIES
-- =====================================================

-- Public can view content sections
CREATE POLICY IF NOT EXISTS "Anyone can view content sections" ON content_sections
  FOR SELECT USING (true);

-- Service role can manage content sections
CREATE POLICY IF NOT EXISTS "Service role can insert content sections" ON content_sections
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can update content sections" ON content_sections
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can delete content sections" ON content_sections
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- ADMIN_NOTIFICATIONS TABLE POLICIES
-- =====================================================

-- Authenticated users (admins) can view notifications
CREATE POLICY IF NOT EXISTS "Authenticated users can view notifications" ON admin_notifications
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Service role can insert notifications
CREATE POLICY IF NOT EXISTS "Service role can insert notifications" ON admin_notifications
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Authenticated users can update (mark as read)
CREATE POLICY IF NOT EXISTS "Authenticated users can update notifications" ON admin_notifications
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Service role can delete notifications
CREATE POLICY IF NOT EXISTS "Service role can delete notifications" ON admin_notifications
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'games', 'game_events', 'quarter_scores', 
  'basketball_teams', 'players', 'staff',
  'events', 'team_members', 'content_sections', 'admin_notifications'
)
ORDER BY table_name;

-- Verify RLS is enabled on all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'games', 'game_events', 'quarter_scores', 
  'basketball_teams', 'players', 'staff',
  'events', 'team_members', 'content_sections', 'admin_notifications'
)
ORDER BY tablename;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================


-- =====================================================
-- MADINA BASKETBALL: COMPLETE DATABASE SETUP
-- =====================================================
-- This script creates ALL required tables for the Madina Basketball website
-- Run this script ONCE in your Supabase SQL Editor
-- 
-- Last Updated: December 2025
-- =====================================================

-- =====================================================
-- SECTION 1: GAME MANAGEMENT TABLES
-- =====================================================

-- 1.1 Games Table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Team Information
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  
  -- Score Tracking
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  
  -- Game Progress
  quarter INTEGER DEFAULT 1,
  overtime INTEGER DEFAULT 0,
  
  -- Game Mode & Status
  game_mode TEXT CHECK (game_mode IN ('basic', 'stats', 'full')) DEFAULT 'basic',
  status TEXT CHECK (status IN ('upcoming', 'live', 'final', 'cancelled')) DEFAULT 'upcoming',
  
  -- Game Details
  game_date TIMESTAMPTZ,
  location TEXT DEFAULT 'Madina Basketball Court',
  notes TEXT,
  
  -- Metadata
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Game Events Table
CREATE TABLE IF NOT EXISTS game_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  
  -- Player Information
  player_id UUID,
  player_name TEXT NOT NULL,
  player_jersey TEXT,
  team TEXT NOT NULL CHECK (team IN ('home', 'away')),
  
  -- Event Details
  event_type TEXT NOT NULL CHECK (event_type IN ('basket', 'free_throw', 'rebound', 'assist', 'steal', 'block', 'foul', 'timeout', 'substitution', 'turnover')),
  points INTEGER DEFAULT 0,
  quarter INTEGER NOT NULL,
  game_time TEXT,
  
  -- Additional Context
  details JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Quarter Scores Table
CREATE TABLE IF NOT EXISTS quarter_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  quarter INTEGER NOT NULL,
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, quarter)
);

-- =====================================================
-- SECTION 2: BASKETBALL TEAMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS basketball_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  short_name TEXT,
  league TEXT DEFAULT 'Accra Basketball League',
  category TEXT CHECK (category IN ('madina', 'accra', 'other')) DEFAULT 'other',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Basketball Teams
INSERT INTO basketball_teams (name, short_name, league, category, display_order, is_active) VALUES
  -- Madina Teams
  ('Zurak', 'Zurak', 'Madina Basketball', 'madina', 1, true),
  ('Madina Old Gees', 'Old Gees', 'Madina Basketball', 'madina', 2, true),
  
  -- Accra Basketball League Teams
  ('Oyibi Eagles', 'Oyibi Eagles', 'Accra Basketball League', 'accra', 10, true),
  ('Kawukudi', 'Kawukudi', 'Accra Basketball League', 'accra', 11, true),
  ('Reformers of Prisons', 'Reformers', 'Accra Basketball League', 'accra', 12, true),
  ('Fire Service Basketball', 'Fire Service', 'Accra Basketball League', 'accra', 13, true),
  ('Navy Basketball', 'Navy', 'Accra Basketball League', 'accra', 14, true),
  ('Air Force Basketball', 'Air Force', 'Accra Basketball League', 'accra', 15, true),
  ('Police Basketball', 'Police', 'Accra Basketball League', 'accra', 16, true),
  ('Tema Youth', 'Tema Youth', 'Accra Basketball League', 'accra', 17, true),
  ('Tudu Mighty Royals', 'Tudu', 'Accra Basketball League', 'accra', 18, true),
  ('Adenta Leopards', 'Adenta', 'Accra Basketball League', 'accra', 19, true),
  ('Echoing Hills', 'Echoing Hills', 'Accra Basketball League', 'accra', 20, true),
  ('Braves of Customs', 'Customs', 'Accra Basketball League', 'accra', 21, true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SECTION 3: PLAYERS & STAFF TABLES
-- =====================================================

-- 3.1 Players Table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  jersey_number TEXT,
  position TEXT,
  team TEXT,
  bio TEXT,
  image_url TEXT,
  height TEXT,
  date_of_birth DATE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Staff Table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('management', 'coach', 'volunteer', 'stakeholder', 'media')),
  title TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 4: INDEXES FOR PERFORMANCE
-- =====================================================

-- Game Management Indexes
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date DESC);
CREATE INDEX IF NOT EXISTS idx_games_mode ON games(game_mode);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_game_events_game_id ON game_events(game_id);
CREATE INDEX IF NOT EXISTS idx_game_events_type ON game_events(event_type);
CREATE INDEX IF NOT EXISTS idx_game_events_player ON game_events(player_name);
CREATE INDEX IF NOT EXISTS idx_game_events_quarter ON game_events(quarter);

CREATE INDEX IF NOT EXISTS idx_quarter_scores_game_id ON quarter_scores(game_id);

-- Basketball Teams Indexes
CREATE INDEX IF NOT EXISTS idx_basketball_teams_category ON basketball_teams(category);
CREATE INDEX IF NOT EXISTS idx_basketball_teams_active ON basketball_teams(is_active);
CREATE INDEX IF NOT EXISTS idx_basketball_teams_order ON basketball_teams(display_order);

-- Players & Staff Indexes
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team);
CREATE INDEX IF NOT EXISTS idx_players_featured ON players(is_featured);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_featured ON staff(is_featured);

-- =====================================================
-- SECTION 5: ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarter_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE basketball_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Games Table Policies
-- =====================================================

-- Public read access
CREATE POLICY IF NOT EXISTS "Anyone can view games" ON games
  FOR SELECT USING (true);

-- Admin write access (service_role)
CREATE POLICY IF NOT EXISTS "Service role can insert games" ON games
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can update games" ON games
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can delete games" ON games
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- Game Events Table Policies
-- =====================================================

CREATE POLICY IF NOT EXISTS "Anyone can view game events" ON game_events
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Service role can insert game events" ON game_events
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can update game events" ON game_events
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can delete game events" ON game_events
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- Quarter Scores Table Policies
-- =====================================================

CREATE POLICY IF NOT EXISTS "Anyone can view quarter scores" ON quarter_scores
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Service role can insert quarter scores" ON quarter_scores
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can update quarter scores" ON quarter_scores
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can delete quarter scores" ON quarter_scores
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- Basketball Teams Table Policies
-- =====================================================

CREATE POLICY IF NOT EXISTS "Anyone can view basketball teams" ON basketball_teams
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Service role can manage basketball teams" ON basketball_teams
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- Players Table Policies
-- =====================================================

CREATE POLICY IF NOT EXISTS "Anyone can view players" ON players
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Service role can manage players" ON players
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- Staff Table Policies
-- =====================================================

CREATE POLICY IF NOT EXISTS "Anyone can view staff" ON staff
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Service role can manage staff" ON staff
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- SECTION 6: VERIFICATION QUERIES
-- =====================================================

-- Uncomment these to verify your setup after running the script

-- Check all tables exist
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('games', 'game_events', 'quarter_scores', 'basketball_teams', 'players', 'staff')
-- ORDER BY table_name;

-- Verify basketball teams were seeded
-- SELECT COUNT(*) as team_count, category
-- FROM basketball_teams
-- GROUP BY category
-- ORDER BY category;

-- Check RLS is enabled
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public'
-- AND tablename IN ('games', 'game_events', 'quarter_scores', 'basketball_teams', 'players', 'staff');

-- Verify indexes
-- SELECT tablename, indexname 
-- FROM pg_indexes 
-- WHERE schemaname = 'public'
-- AND tablename IN ('games', 'game_events', 'quarter_scores', 'basketball_teams', 'players', 'staff')
-- ORDER BY tablename, indexname;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- 
-- Next Steps:
-- 1. Verify all tables were created successfully
-- 2. Check that basketball teams were seeded (should have 14 teams)
-- 3. Verify RLS is enabled on all tables
-- 4. Test creating a game from the admin portal
-- 5. Test team dropdown shows all teams
--
-- If you need to add more teams later, use:
-- INSERT INTO basketball_teams (name, short_name, league, category, display_order) 
-- VALUES ('Team Name', 'Short Name', 'League Name', 'accra', 100);
--
-- =====================================================


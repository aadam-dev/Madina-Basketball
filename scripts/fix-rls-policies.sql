-- =====================================================
-- FIX ROW LEVEL SECURITY POLICIES
-- =====================================================
-- Some tables are missing RLS policies
-- Run this script to enable RLS and create policies for all tables
-- =====================================================

-- Enable RLS on tables that don't have it enabled
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarter_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE basketball_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- GAMES TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view games" ON games;
DROP POLICY IF EXISTS "Service role can insert games" ON games;
DROP POLICY IF EXISTS "Service role can update games" ON games;
DROP POLICY IF EXISTS "Service role can delete games" ON games;

-- Create policies
CREATE POLICY "Anyone can view games" ON games
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert games" ON games
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update games" ON games
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete games" ON games
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- GAME_EVENTS TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view game events" ON game_events;
DROP POLICY IF EXISTS "Service role can insert game events" ON game_events;
DROP POLICY IF EXISTS "Service role can update game events" ON game_events;
DROP POLICY IF EXISTS "Service role can delete game events" ON game_events;

CREATE POLICY "Anyone can view game events" ON game_events
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert game events" ON game_events
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update game events" ON game_events
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete game events" ON game_events
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- QUARTER_SCORES TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view quarter scores" ON quarter_scores;
DROP POLICY IF EXISTS "Service role can insert quarter scores" ON quarter_scores;
DROP POLICY IF EXISTS "Service role can update quarter scores" ON quarter_scores;
DROP POLICY IF EXISTS "Service role can delete quarter scores" ON quarter_scores;

CREATE POLICY "Anyone can view quarter scores" ON quarter_scores
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert quarter scores" ON quarter_scores
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update quarter scores" ON quarter_scores
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete quarter scores" ON quarter_scores
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- BASKETBALL_TEAMS TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view basketball teams" ON basketball_teams;
DROP POLICY IF EXISTS "Service role can manage basketball teams" ON basketball_teams;

CREATE POLICY "Anyone can view basketball teams" ON basketball_teams
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage basketball teams" ON basketball_teams
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- PLAYERS TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view players" ON players;
DROP POLICY IF EXISTS "Service role can manage players" ON players;

CREATE POLICY "Anyone can view players" ON players
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage players" ON players
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- STAFF TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view staff" ON staff;
DROP POLICY IF EXISTS "Service role can manage staff" ON staff;

CREATE POLICY "Anyone can view staff" ON staff
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage staff" ON staff
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify RLS is now enabled on all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'games', 'game_events', 'quarter_scores', 
  'basketball_teams', 'players', 'staff',
  'events', 'team_members', 'content_sections', 'admin_notifications'
)
ORDER BY tablename;

-- Expected result: All tables should have rowsecurity = true


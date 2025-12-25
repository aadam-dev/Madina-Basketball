-- =====================================================
-- Madina Basketball: Game Management Database Schema
-- =====================================================
-- This script creates tables for live game tracking and management
-- with support for basic scoreboard, player stats, and full game management
--
-- Run this in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- GAMES TABLE
-- =====================================================
-- Main table for tracking games (past, live, and upcoming)

CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Team Information
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  
  -- Score Tracking
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  
  -- Game Progress
  quarter INTEGER DEFAULT 1, -- Current quarter (1-4)
  overtime INTEGER DEFAULT 0, -- Number of overtime periods
  
  -- Game Mode & Status
  game_mode TEXT CHECK (game_mode IN ('basic', 'stats', 'full')) DEFAULT 'basic',
  status TEXT CHECK (status IN ('upcoming', 'live', 'final', 'cancelled')) DEFAULT 'upcoming',
  
  -- Game Details
  game_date TIMESTAMPTZ,
  location TEXT DEFAULT 'Madina Basketball Court',
  notes TEXT,
  
  -- Metadata
  created_by TEXT, -- Admin who created the game
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- GAME EVENTS TABLE
-- =====================================================
-- Track detailed game events (for stats and full modes)

CREATE TABLE IF NOT EXISTS game_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  
  -- Player Information
  player_id UUID, -- Optional: can link to players table later
  player_name TEXT NOT NULL,
  player_jersey TEXT, -- Jersey number
  team TEXT NOT NULL, -- 'home' or 'away'
  
  -- Event Details
  event_type TEXT NOT NULL, 
    -- Types: 'basket', 'free_throw', 'rebound', 'assist', 'steal', 'block', 
    --        'foul', 'timeout', 'substitution', 'turnover'
  points INTEGER DEFAULT 0, -- 1, 2, or 3 for baskets; 1 for free throws
  quarter INTEGER NOT NULL,
  game_time TEXT, -- Optional: game clock time (e.g., "5:23")
  
  -- Additional Context
  details JSONB, -- For storing extra data like assist provider, foul type, etc.
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- QUARTER SCORES TABLE (Optional but recommended)
-- =====================================================
-- Track scores by quarter for detailed game summaries

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
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Games table indexes
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date DESC);
CREATE INDEX IF NOT EXISTS idx_games_mode ON games(game_mode);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);

-- Game events table indexes
CREATE INDEX IF NOT EXISTS idx_game_events_game_id ON game_events(game_id);
CREATE INDEX IF NOT EXISTS idx_game_events_type ON game_events(event_type);
CREATE INDEX IF NOT EXISTS idx_game_events_player ON game_events(player_name);
CREATE INDEX IF NOT EXISTS idx_game_events_quarter ON game_events(quarter);

-- Quarter scores table indexes
CREATE INDEX IF NOT EXISTS idx_quarter_scores_game_id ON quarter_scores(game_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarter_scores ENABLE ROW LEVEL SECURITY;

-- Games table policies
-- Public can view all games
CREATE POLICY "Anyone can view games" ON games
  FOR SELECT USING (true);

-- Only service role can create/update/delete games (admin portal only)
CREATE POLICY "Service role can insert games" ON games
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update games" ON games
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete games" ON games
  FOR DELETE USING (auth.role() = 'service_role');

-- Game events table policies
-- Public can view all game events
CREATE POLICY "Anyone can view game events" ON game_events
  FOR SELECT USING (true);

-- Only service role can create/update/delete game events
CREATE POLICY "Service role can insert game events" ON game_events
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update game events" ON game_events
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete game events" ON game_events
  FOR DELETE USING (auth.role() = 'service_role');

-- Quarter scores table policies
-- Public can view quarter scores
CREATE POLICY "Anyone can view quarter scores" ON quarter_scores
  FOR SELECT USING (true);

-- Only service role can manage quarter scores
CREATE POLICY "Service role can insert quarter scores" ON quarter_scores
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update quarter scores" ON quarter_scores
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete quarter scores" ON quarter_scores
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the tables were created correctly

-- Check games table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'games'
-- ORDER BY ordinal_position;

-- Check game_events table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'game_events'
-- ORDER BY ordinal_position;

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('games', 'game_events', 'quarter_scores');

-- Verify indexes
-- SELECT tablename, indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename IN ('games', 'game_events', 'quarter_scores')
-- ORDER BY tablename, indexname;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

/*
-- Sample game
INSERT INTO games (home_team, away_team, game_date, status, game_mode)
VALUES ('Madina Old Gees', 'Oyibi Eagles', NOW() + INTERVAL '1 day', 'upcoming', 'basic');

-- Sample live game
INSERT INTO games (home_team, away_team, home_score, away_score, quarter, game_date, status, game_mode)
VALUES ('Zurak Basketball', 'Kawukudi', 45, 42, 3, NOW(), 'live', 'stats');
*/

-- =====================================================
-- NOTES
-- =====================================================
-- 1. After running this script, create API routes: /api/games and /api/games/[id]
-- 2. The 'details' JSONB field in game_events allows flexible storage of event metadata
-- 3. Quarter scores are automatically calculated but can also be manually adjusted
-- 4. Use 'service_role' key in API routes for all write operations
-- 5. Public site uses 'anon' key for read-only access to completed games
-- 6. Consider adding indexes for player_id once players table integration is complete
-- =====================================================


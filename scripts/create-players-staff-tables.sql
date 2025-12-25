-- =====================================================
-- Madina Basketball: Players & Staff Database Schema
-- =====================================================
-- This script creates separate tables for players and staff
-- with proper Row Level Security (RLS) policies
--
-- Run this in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PLAYERS TABLE
-- =====================================================
-- For managing team roster (Zurak Basketball, Madina Old Gees, etc.)

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  jersey_number TEXT,
  position TEXT, -- PG, SG, SF, PF, C, G, F, Utility
  team TEXT, -- e.g., "Zurak Basketball", "Madina Old Gees"
  bio TEXT,
  image_url TEXT,
  height TEXT, -- e.g., "6'2\"", "188cm"
  date_of_birth DATE,
  email TEXT,
  phone TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team);
CREATE INDEX IF NOT EXISTS idx_players_featured ON players(is_featured);
CREATE INDEX IF NOT EXISTS idx_players_order ON players(display_order);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Public can view players
CREATE POLICY "Anyone can view players" ON players
  FOR SELECT USING (true);

-- Only authenticated users (service role) can insert/update/delete
CREATE POLICY "Service role can insert players" ON players
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update players" ON players
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete players" ON players
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- STAFF TABLE
-- =====================================================
-- For managing staff, coaches, leadership, and volunteers

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('management', 'coach', 'volunteer', 'maintenance', 'stakeholder', 'media')),
  title TEXT NOT NULL, -- e.g., "Head Coach", "Program Director", "Executive Lead"
  bio TEXT,
  image_url TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  section TEXT, -- Maps to public site sections: "executive", "coach", "maintenance", "stakeholder", "media"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_section ON staff(section);
CREATE INDEX IF NOT EXISTS idx_staff_featured ON staff(is_featured);
CREATE INDEX IF NOT EXISTS idx_staff_order ON staff(display_order);

-- Enable RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Public can view staff
CREATE POLICY "Anyone can view staff" ON staff
  FOR SELECT USING (true);

-- Only authenticated users (service role) can insert/update/delete
CREATE POLICY "Service role can insert staff" ON staff
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update staff" ON staff
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete staff" ON staff
  FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- MIGRATION HELPER (OPTIONAL)
-- =====================================================
-- If you want to migrate existing team_members data to the new tables,
-- uncomment and run the following section AFTER creating the tables above.
-- Review the section mapping logic and adjust as needed for your data.

/*
-- Migrate staff members (executive, coach, maintenance, stakeholder, media)
INSERT INTO staff (name, role, title, bio, image_url, section, display_order, created_at, updated_at)
SELECT 
  name,
  CASE section
    WHEN 'executive' THEN 'management'
    WHEN 'coach' THEN 'coach'
    WHEN 'maintenance' THEN 'maintenance'
    WHEN 'stakeholder' THEN 'stakeholder'
    WHEN 'media' THEN 'media'
    ELSE 'volunteer'
  END as role,
  role as title, -- The 'role' column in team_members becomes 'title' in staff
  description as bio,
  image_url,
  section,
  order_index as display_order,
  created_at,
  updated_at
FROM team_members
WHERE section IN ('executive', 'coach', 'maintenance', 'stakeholder', 'media');

-- Migrate players (any team_members not in staff sections)
-- Adjust this query based on how you've been storing players
INSERT INTO players (name, bio, image_url, display_order, created_at, updated_at)
SELECT 
  name,
  description as bio,
  image_url,
  order_index as display_order,
  created_at,
  updated_at
FROM team_members
WHERE section NOT IN ('executive', 'coach', 'maintenance', 'stakeholder', 'media')
OR section IS NULL;
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the tables were created correctly

-- Check players table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'players'
-- ORDER BY ordinal_position;

-- Check staff table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'staff'
-- ORDER BY ordinal_position;

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('players', 'staff');

-- =====================================================
-- NOTES
-- =====================================================
-- 1. After running this script, update your API routes to use the new tables
-- 2. Create new API endpoints: /api/players and /api/staff
-- 3. Update the admin portal to use these endpoints
-- 4. The team_members table can be kept for backward compatibility or dropped
-- 5. Remember to update Supabase Storage bucket policies if needed
-- =====================================================


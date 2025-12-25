-- Admin Notifications System
-- Run this in Supabase SQL Editor

-- Create admin notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('booking', 'teamsheet', 'registration', 'contact', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_read ON admin_notifications(is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON admin_notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users (admins) to read all notifications
CREATE POLICY "Authenticated users can view notifications" ON admin_notifications
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow service role to insert notifications
CREATE POLICY "Service role can insert notifications" ON admin_notifications
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Create policy to allow authenticated users to update (mark as read)
CREATE POLICY "Authenticated users can update notifications" ON admin_notifications
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Track team sheet generations (for notifications)
CREATE TABLE IF NOT EXISTS teamsheet_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_name TEXT NOT NULL,
  player_count INTEGER,
  generated_by TEXT, -- IP or identifier
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teamsheet_created ON teamsheet_generations(created_at DESC);

-- Enable RLS on teamsheet_generations
ALTER TABLE teamsheet_generations ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert
CREATE POLICY "Service role can insert teamsheet generations" ON teamsheet_generations
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Allow authenticated users to view
CREATE POLICY "Authenticated users can view teamsheet generations" ON teamsheet_generations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create a function to automatically create notifications
-- This can be triggered manually or via application code

COMMENT ON TABLE admin_notifications IS 'Stores admin notifications for bookings, forms, and activities';
COMMENT ON TABLE teamsheet_generations IS 'Tracks team sheet generations for admin notifications';


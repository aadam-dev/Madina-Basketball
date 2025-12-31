-- =====================================================
-- Announcements Table
-- =====================================================
-- Quick updates and notices for the community
-- Displayed on homepage and can be managed via admin portal

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Type determines styling/icon
  type TEXT CHECK (type IN ('info', 'warning', 'success', 'event')) DEFAULT 'info',
  
  -- Status
  status TEXT CHECK (status IN ('active', 'archived')) DEFAULT 'active',
  
  -- Optional expiry date (null = no expiry)
  expires_at TIMESTAMPTZ,
  
  -- Metadata
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX idx_announcements_expires_at ON announcements(expires_at);

-- RLS: Public read, admin write (handled by service role)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements are viewable by everyone" ON announcements
  FOR SELECT USING (
    status = 'active' AND 
    (expires_at IS NULL OR expires_at > NOW())
  );

-- Comments
COMMENT ON TABLE announcements IS 'Quick updates and community notices';
COMMENT ON COLUMN announcements.type IS 'Display style: info (blue), warning (yellow), success (green), event (orange)';
COMMENT ON COLUMN announcements.expires_at IS 'Auto-hide after this date. NULL = no expiry';


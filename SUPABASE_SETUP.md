# Supabase Setup Guide

This guide will help you set up Supabase for the Madina Basketball admin CMS system.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `madinabasketball` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `West US` or `Europe West`)
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be created

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL**: Copy this (e.g., `https://xxxxx.supabase.co`)
   - **anon public key**: Copy this (starts with `eyJ...`)
   - **service_role key**: Copy this (starts with `eyJ...`) - **Keep this secret!**

## Step 3: Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run these SQL commands one by one:

### 1. Events Table

```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  type TEXT NOT NULL CHECK (type IN ('game', 'event', 'training')),
  teams TEXT,
  image_url TEXT,
  registration_link TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_featured ON events(featured);
```

### 2. Content Sections Table

```sql
CREATE TABLE content_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page, section_key)
);

-- Create index for faster queries
CREATE INDEX idx_content_sections_page ON content_sections(page);
```

### 3. Team Members Table

```sql
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  section TEXT NOT NULL CHECK (section IN ('executive', 'coach', 'maintenance', 'stakeholder', 'media')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_team_members_section ON team_members(section);
CREATE INDEX idx_team_members_order ON team_members(section, order_index);
```

### 4. Enable Row Level Security (RLS)

For security, we'll enable RLS but allow public read access:

```sql
-- Events: Public read, admin write
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

-- Content sections: Public read, admin write
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Content sections are viewable by everyone" ON content_sections
  FOR SELECT USING (true);

-- Team members: Public read, admin write
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are viewable by everyone" ON team_members
  FOR SELECT USING (true);
```

**Note:** Write operations (INSERT, UPDATE, DELETE) will be handled by API routes using the service role key, which bypasses RLS.

## Step 4: Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Click "Create a new bucket"
3. Create two buckets:

   **Bucket 1: `events`**
   - Name: `events`
   - Public: ✅ Yes (so images can be accessed publicly)
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

   **Bucket 2: `team`**
   - Name: `team`
   - Public: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

4. For each bucket, set up storage policies:
   
   **Important:** Supabase Storage uses Row Level Security (RLS) policies. You need to create policies for both reading (SELECT) and uploading (INSERT).
   
   Go to **Storage** → Click on your bucket (e.g., `events`) → **Policies** tab
   
   Click **"New Policy"** and create policies using the SQL Editor:
   
   **For the `events` bucket:**
   
   a. **Public Read Policy** (allows anyone to view images):
   - Policy name: `Public can view events images`
   - Allowed operation: `SELECT`
   - Policy definition:
     ```sql
     (bucket_id = 'events')
     ```
   
   b. **Authenticated Upload Policy** (allows authenticated users to upload):
   - Policy name: `Authenticated users can upload to events`
   - Allowed operation: `INSERT`
   - Policy definition:
     ```sql
     (bucket_id = 'events' AND auth.role() = 'authenticated')
     ```
   
   **For the `team` bucket:**
   
   a. **Public Read Policy**:
   - Policy name: `Public can view team images`
   - Allowed operation: `SELECT`
   - Policy definition:
     ```sql
     (bucket_id = 'team')
     ```
   
   b. **Authenticated Upload Policy**:
   - Policy name: `Authenticated users can upload to team`
   - Allowed operation: `INSERT`
   - Policy definition:
     ```sql
     (bucket_id = 'team' AND auth.role() = 'authenticated')
     ```
   
   **Alternative (Simpler) Approach:**
   
   If the above doesn't work, you can use the SQL Editor directly:
   
   1. Go to **SQL Editor** in Supabase dashboard
   2. Run this SQL for both buckets:
   
   ```sql
   -- For events bucket
   CREATE POLICY "Public can view events images" ON storage.objects
       FOR SELECT USING (bucket_id = 'events');
   
   CREATE POLICY "Authenticated can upload to events" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'events' AND auth.role() = 'authenticated');
   
   -- For team bucket
   CREATE POLICY "Public can view team images" ON storage.objects
     FOR SELECT USING (bucket_id = 'team');
   
   CREATE POLICY "Authenticated can upload to team" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'team' AND auth.role() = 'authenticated');
   ```
   
   **Note:** Since your upload API uses the service role key (which bypasses RLS), the INSERT policies are technically not required, but they're good practice. The SELECT policies are essential for public image access.

## Step 5: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL from Step 2
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon key from Step 2
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key from Step 2
   - `ADMIN_EMAIL_1` and `ADMIN_PASSWORD_1`: First admin credentials
   - `ADMIN_EMAIL_2` and `ADMIN_PASSWORD_2`: Second admin credentials

3. **Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

## Step 6: Test the Connection

Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000/admin/login` and try logging in with your admin credentials.

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has all required variables
- Restart your dev server after adding environment variables

### "Unauthorized" errors
- Check that your service role key is correct
- Make sure RLS policies are set up correctly

### Images not uploading
- Verify storage buckets are created and public
- Check bucket policies allow uploads
- Verify file size is under 5 MB

## Next Steps

Once Supabase is set up:
1. Deploy to Vercel (see `DEPLOYMENT.md`)
2. Add the same environment variables in Vercel dashboard
3. Test the admin portal at `https://your-domain.com/admin/login`

## Security Notes

- **Never expose your service role key** in client-side code
- The service role key bypasses all security policies - keep it secret!
- Only use the service role key in API routes (server-side)
- The anon key is safe to use in client-side code (it's public)


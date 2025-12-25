# Deployment Guide - Madina Basketball Website

This guide will walk you through deploying the Madina Basketball website to Vercel and setting up Supabase.

## Prerequisites

- A GitHub account
- A Vercel account (free tier works)
- A Supabase account (free tier works)
- Your code pushed to a GitHub repository

---

## Part 1: Set Up Supabase

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `madinabasketball` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

### Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - **Keep this secret!**

### Step 3: Create Database Tables

1. Go to **SQL Editor** in Supabase
2. Run each SQL script from `SUPABASE_SETUP.md` one by one:
   - Events table
   - Content sections table
   - Team members table
   - Row Level Security policies

### Step 4: Set Up Storage Buckets

1. Go to **Storage** in Supabase
2. Create two buckets:
   - **Name**: `events` (Public: Yes)
   - **Name**: `team` (Public: Yes)
3. Set up public access policies (see `SUPABASE_SETUP.md`)

---

## Part 2: Push Code to GitHub

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"New repository"**
3. Name it: `madinabasketball` (or your preferred name)
4. Make it **Public** or **Private** (your choice)
5. **Don't** initialize with README (if you already have code)
6. Click **"Create repository"**

### Step 2: Push Your Code

In your terminal, run:

```bash
# If you haven't initialized git yet
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Madina Basketball website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/madinabasketball.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Part 3: Deploy to Vercel

### Step 1: Import Project

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (use GitHub to sign in for easier setup)
3. Click **"Add New..."** → **"Project"**
4. Find and select your `madinabasketball` repository
5. Click **"Import"**

### Step 2: Configure Project

Vercel will auto-detect Next.js. You should see:
- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)

**Don't change these** - they're correct for Next.js.

### Step 3: Add Environment Variables

Before deploying, add your environment variables:

1. In the Vercel project setup, scroll to **"Environment Variables"**
2. Add each variable one by one:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL_1=admin1@example.com
ADMIN_PASSWORD_1=your_secure_password_1
ADMIN_EMAIL_2=admin2@example.com
ADMIN_PASSWORD_2=your_secure_password_2
```

**Important:**
- Replace `your_supabase_project_url` with your actual Supabase URL
- Replace `your_supabase_anon_key` with your actual anon key
- Replace `your_supabase_service_role_key` with your actual service role key
- Set your admin emails and passwords

3. Click **"Deploy"**

### Step 4: Wait for Deployment

- Vercel will build and deploy your site
- This takes 2-5 minutes
- You'll see build logs in real-time
- When done, you'll get a URL like: `https://madinabasketball.vercel.app`

---

## Part 4: Post-Deployment Checklist

### 1. Test the Website

- Visit your Vercel URL
- Check all pages load correctly
- Test navigation

### 2. Test Admin Portal

- Go to `https://your-domain.com/admin/login`
- Log in with your admin credentials
- Test creating an event
- Test uploading an image
- Test editing content

### 3. Test Events on Homepage

- Create a test event in the admin portal
- Mark it as "upcoming"
- Check if it appears on the homepage

### 4. Verify Environment Variables

If something doesn't work:
- Go to Vercel dashboard → Your Project → **Settings** → **Environment Variables**
- Verify all variables are set correctly
- **Redeploy** if you made changes (Settings → Deployments → Redeploy)

---

## Part 5: Custom Domain (Optional)

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Enter your domain (e.g., `madinabasketball.com`)
4. Follow Vercel's instructions to configure DNS

### Step 2: Update DNS Records

Add these DNS records at your domain provider:
- **Type**: `CNAME`
- **Name**: `@` or `www`
- **Value**: `cname.vercel-dns.com`

---

## Troubleshooting

### "Missing Supabase environment variables"

**Solution:**
- Go to Vercel → Settings → Environment Variables
- Make sure all Supabase variables are set
- Redeploy the site

### "Unauthorized" when logging into admin

**Solution:**
- Check that `ADMIN_EMAIL_1`, `ADMIN_PASSWORD_1`, etc. are set in Vercel
- Make sure passwords match exactly (no extra spaces)
- Redeploy after adding variables

### Events not showing on homepage

**Solution:**
- Check Supabase: Go to Table Editor → `events` table
- Make sure you have events with `status = 'upcoming'`
- Check browser console for errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Images not uploading

**Solution:**
- Check Supabase Storage buckets exist (`events` and `team`)
- Verify buckets are set to **Public**
- Check storage policies allow uploads
- Check file size is under 5MB

### Build fails on Vercel

**Solution:**
- Check build logs in Vercel dashboard
- Common issues:
  - Missing environment variables
  - TypeScript errors
  - Missing dependencies
- Fix errors and push to GitHub (auto-redeploys)

---

## Updating the Website

### Method 1: Automatic (Recommended)

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update website"
   git push
   ```
3. Vercel automatically detects changes and redeploys

### Method 2: Manual Redeploy

1. Go to Vercel dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click **"..."** on latest deployment → **"Redeploy"**

---

## Environment Variables Reference

| Variable | Description | Where to Get It |
|----------|-------------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Supabase Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (secret!) | Supabase Settings → API |
| `ADMIN_EMAIL_1` | First admin email | You choose |
| `ADMIN_PASSWORD_1` | First admin password | You choose |
| `ADMIN_EMAIL_2` | Second admin email | You choose |
| `ADMIN_PASSWORD_2` | Second admin password | You choose |

---

## Security Best Practices

1. **Never commit `.env.local`** to GitHub (it's in `.gitignore`)
2. **Keep service role key secret** - only use in server-side code
3. **Use strong admin passwords**
4. **Regularly update dependencies**: `npm audit fix`
5. **Monitor Vercel logs** for errors

---

## Support Resources

- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build locally
npm run build

# Start production server locally
npm start

# Check for security issues
npm audit

# Update dependencies
npm update
```

---

## Success!

Once deployed, your website will be live at:
- **Vercel URL**: `https://your-project.vercel.app`
- **Admin Portal**: `https://your-project.vercel.app/admin/login`

You can now:
- ✅ Update events through the admin portal
- ✅ Edit content without touching code
- ✅ Manage team members
- ✅ Upload images
- ✅ All changes are saved to Supabase

**Congratulations! Your website is live! 🎉**


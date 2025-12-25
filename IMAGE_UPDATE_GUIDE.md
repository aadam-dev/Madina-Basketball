# Image Update Guide - How to Update All Images on the Site

This guide explains how to provide images and have them updated across the entire website.

## Quick Answer

**Yes, I can update all image sections on the site!** Here's the best way to provide images:

## Method 1: Provide Image Paths (Recommended)

If you already have images organized in folders, just tell me:
- The folder structure
- Which images go where
- I'll update all the code references

**Example:**
```
"I have images in these folders:
- /Users/aadam/Desktop/Images/madinabasketball/court/hero.jpg
- /Users/aadam/Desktop/Images/madinabasketball/team/adam.jpg
- /Users/aadam/Desktop/Images/madinabasketball/events/opening-game.jpg"
```

## Method 2: Upload to Project Directory

1. **Create the folder structure** in your project:
   ```
   public/
   ├── images/
   │   ├── court/
   │   │   ├── hero.jpg
   │   │   ├── before.jpg
   │   │   └── after.jpg
   │   ├── team/
   │   │   ├── adam.jpg
   │   │   ├── shafic.jpg
   │   │   ├── jamal.jpg
   │   │   └── mcdwin.jpg
   │   ├── events/
   │   │   ├── opening-game.jpg
   │   │   └── old-gees-night.jpg
   │   └── journey/
   │       ├── before-renovation.jpg
   │       └── after-renovation.jpg
   ```

2. **Place your images** in the appropriate folders

3. **Tell me which images you've added**, and I'll update all references

## Method 3: Describe What You Have

Just describe what images you have, and I'll:
- Create the folder structure
- Update all code references
- Tell you exactly where to place each image

**Example:**
```
"I have:
- Court hero image
- Before/after renovation photos
- Team photos for Adam, Shafic, Jamal, Mcdwin
- Opening game photos
- Old Gees Night photos"
```

## Image Locations on the Site

Here's where images are used across the website:

### Homepage (`app/page.tsx`)
- **Hero background**: Court image (large, landscape)
- **Mission section**: Court image (optional)

### Journey Page (`app/journey/page.tsx`)
- **Before renovation**: Old court photo
- **After renovation**: New court photo
- **Timeline images**: Various renovation progress photos
- **Opening game**: Madina vs Kawukudi photos/videos

### Team Page (`app/team/page.tsx`)
- **Executive Body**: Shafic, Adam, Mustafa, Hisham, Kwame Focus, Titus
- **Coaches**: Hisham, Mustafa, Peter
- **Maintenance**: Kwame Focus, Baba, Moh, Adam
- **Stakeholders**: Assemblyman, Thuram
- **Media Team**: Adam, Jamal, Mcdwin

### Court Page (`app/court/page.tsx`)
- **Current court photos**: Multiple angles
- **Court features**: Close-ups of equipment

### Media/Gallery Page (`app/media/page.tsx`)
- **Launch game photos**: Opening ceremony
- **Event photos**: Various games and events
- **Training photos**: Practice sessions

### Events (Dynamic from Admin)
- **Event images**: Uploaded through admin portal
- Stored in Supabase Storage bucket `events`

## Image Requirements

### Recommended Sizes
- **Hero images**: 1920x1080px (16:9 aspect ratio)
- **Team photos**: 400x400px (square, 1:1)
- **Event cards**: 800x600px (4:3 aspect ratio)
- **Gallery images**: 1200x800px (3:2 aspect ratio)

### File Formats
- **JPEG** (.jpg) - Best for photos
- **PNG** (.png) - Best for graphics with transparency
- **WebP** (.webp) - Best for web (smaller file size)

### File Size
- Keep images under **500KB** for fast loading
- Use image compression tools if needed
- Next.js automatically optimizes images

## Step-by-Step: Updating Images

### Option A: I Update Everything (Easiest)

1. **You provide images** (any method above)
2. **I update all code references** across the site
3. **You place images** in the folders I specify
4. **Done!** All images are live

### Option B: You Update Manually

1. **Place images** in `public/images/` following the structure
2. **Update file references** in code (I can guide you)
3. **Test locally** before deploying

## Current Image Structure

```
public/
└── images/
    ├── court/
    │   ├── hero.jpg (placeholder - needs actual image)
    │   ├── before.jpg (placeholder)
    │   └── after.jpg (placeholder)
    ├── team/
    │   ├── adam.jpg (placeholder)
    │   ├── shafic.jpg (placeholder)
    │   ├── mustafa.jpg (placeholder)
    │   ├── hisham.jpg (placeholder)
    │   ├── kwame-focus.jpg (placeholder)
    │   ├── titus.jpg (placeholder)
    │   ├── peter.jpg (placeholder)
    │   ├── baba.jpg (placeholder)
    │   ├── moh.jpg (placeholder)
    │   ├── assemblyman.jpg (placeholder)
    │   ├── thuram.jpg (placeholder)
    │   ├── jamal.jpg (placeholder - NEW)
    │   └── mcdwin.jpg (placeholder - NEW)
    ├── events/
    │   ├── opening-game.jpg (placeholder)
    │   └── old-gees-night.jpg (placeholder)
    └── journey/
        ├── before-renovation.jpg (placeholder)
        └── after-renovation.jpg (placeholder)
```

## Best Practice Workflow

1. **Gather all images** in one folder on your computer
2. **Tell me what you have**: "I have images for X, Y, Z"
3. **I'll create the structure** and update all references
4. **You copy images** to the specified locations
5. **Test locally**: `npm run dev` to see changes
6. **Deploy**: Push to GitHub (Vercel auto-deploys)

## Using Admin Portal for Dynamic Images

For **events and team members** added through the admin portal:
- Images are uploaded directly via the admin interface
- Stored in Supabase Storage
- No code changes needed
- Just upload through the portal!

## Quick Commands

```bash
# Create image directories
mkdir -p public/images/{court,team,events,journey}

# Check if images exist
ls -la public/images/team/

# Test locally
npm run dev
# Visit http://localhost:3000 to see images
```

## Need Help?

Just tell me:
1. **What images you have**
2. **Where they are** (or describe them)
3. **I'll handle the rest!**

I can update:
- ✅ All image references in code
- ✅ Create proper folder structure
- ✅ Update Next.js Image components
- ✅ Add alt text for accessibility
- ✅ Optimize image loading

---

## Example Request

**You say:**
> "I have photos of the court, team members (Adam, Shafic, Jamal, Mcdwin), and the opening game. They're in a folder called 'Madina Photos' on my Desktop."

**I'll:**
1. Ask you to confirm the exact file names
2. Update all code references
3. Tell you exactly where to place each image
4. Test that everything works

**You:**
1. Copy images to the specified locations
2. Run `npm run dev` to see changes
3. Done!

---

**Ready to update images? Just tell me what you have!** 🖼️


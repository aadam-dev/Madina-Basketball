# Photo & Video Management Guide

Quick reference guide for adding, updating, and managing photos and videos on the Madina Basketball website.

---

## 🚀 Quick Start: Two Ways to Manage Media

### Option 1: Admin Portal (Easiest - Recommended)
**Best for:** Non-technical users, quick updates, managing multiple media locations

1. Go to `/admin/login` and log in
2. Navigate to **Media** page (`/admin/media`)
3. Select a media location from the dropdown
4. Upload image/video or add YouTube link
5. Save - changes appear immediately

**Available Media Locations:**
- Hero Background (Homepage)
- Journey: Before Renovation (1-3)
- Journey: After Renovation (1-3)
- Journey: CapCut Before/After Edit
- Journey: Fundraising Info Sheet
- Event Posters
- And more...

### Option 2: Direct File Upload (For Developers)
**Best for:** Bulk uploads, specific file paths, code changes

1. Add files to `public/` folder (see structure below)
2. Update code references if needed
3. Restart dev server if needed

---

## 📁 File Structure

All media files go in the `public/` folder. Here's the current structure:

```
public/
├── images/
│   ├── journey/
│   │   ├── before/          # Before renovation photos
│   │   │   ├── before-1.jpg
│   │   │   ├── before-2.jpg
│   │   │   └── before-3.jpg
│   │   ├── after/           # After renovation photos
│   │   │   ├── after-1.jpg
│   │   │   ├── after-2.jpg
│   │   │   ├── after-3.jpg
│   │   │   └── hero-page.jpg # Homepage hero image
│   │   ├── dashboard.jpg
│   │   ├── fundraising-info-sheet.jpg
│   │   ├── fundraising-info-sheet-1.jpg
│   │   ├── fundraising-info-sheet-2.jpg
│   │   ├── proforma-invoice.jpg
│   │   └── project-leads-announcement.jpg
│   ├── events/
│   │   └── posters/         # Event poster images
│   ├── court/                # Court-specific images
│   ├── team/                 # Team photos
│   └── logo/                 # Logo files
└── videos/
    ├── compressed/           # Compressed videos (for web)
    │   ├── hero-section-video.MOV
    │   ├── b4launch.MOV
    │   └── ...
    └── [full videos]         # Original videos (if needed)
```

---

## 🖼️ Common Photo Updates

### Homepage Hero Image/Video

**Location:** `public/images/journey/after/hero-page.jpg` (image)  
**Video:** `public/videos/compressed/hero-section-video.MOV`

**To Update:**
- **Via Admin:** `/admin/media` → Select "Hero Background"
- **Manual:** Replace file and restart dev server

**Component:** `components/HeroBackground.tsx`  
**Code Reference:** Video plays if available, falls back to image

---

### Journey Page - Before/After Photos

**Before Photos:** `public/images/journey/before/`
- `before-1.jpg`, `before-2.jpg`, `before-3.jpg`

**After Photos:** `public/images/journey/after/`
- `after-1.jpg`, `after-2.jpg`, `after-3.jpg`
- Also includes video: `b4launch.MOV` (shown as "After #1")

**To Update:**
- **Via Admin:** `/admin/media` → Select "Journey: Before/After Renovation #X"
- **Manual:** Replace files in respective folders

**Component:** `app/journey/page.tsx` (lines ~100-200)

---

### Media Gallery Page

**Location:** `app/media/page.tsx`

**Current Setup:**
- Launch Day photos: Placeholder grid (lines 32-42)
- Journey photos: Placeholder cards (lines 58-102)
- Videos: Uses `lib/videos.ts` for YouTube embeds

**To Add Photos:**
1. Add photos to `public/images/events/` or appropriate folder
2. Update the array in `app/media/page.tsx`:
   ```tsx
   {[
     '/images/events/launch-1.jpg',
     '/images/events/launch-2.jpg',
     // Add more paths here
   ].map((src, i) => (
     <Image src={src} alt={`Launch photo ${i + 1}`} ... />
   ))}
   ```

---

## 🎬 Video Management

### YouTube Videos (Recommended)

**Best for:** Large files, easy sharing, automatic optimization

1. Upload to YouTube
2. Get video ID from URL: `youtube.com/watch?v=VIDEO_ID`
3. **Via Admin:** `/admin/media` → Select location → Add YouTube link
4. **Manual:** Update `lib/videos.ts`:
   ```typescript
   {
     key: 'launch-day-1',
     title: 'Launch Day Highlights',
     videoId: 'YOUR_VIDEO_ID',
     category: 'launch-day',
   }
   ```

**Component:** `components/YouTubeEmbed.tsx` handles embedding

---

### Direct Video Files

**Best for:** Short clips, local hosting, no YouTube dependency

**Location:** `public/videos/compressed/`

**Important:**
- Compress videos before uploading (use `scripts/compress-videos.sh`)
- Keep file sizes under 10MB for web performance
- Use `.mp4` or `.MOV` format

**To Add:**
1. Compress video: `./scripts/compress-videos.sh input.MOV`
2. Place in `public/videos/compressed/`
3. Reference in code: `/videos/compressed/filename.MOV`

**Example Usage:**
```tsx
<video 
  src="/videos/compressed/b4launch.MOV"
  controls
  className="w-full h-full object-contain"
/>
```

---

## 🔧 Quick Reference: Code Locations

| Media Type | File Location | Component/Page |
|------------|---------------|----------------|
| Hero Background | `/images/journey/after/hero-page.jpg` | `components/HeroBackground.tsx` |
| Hero Video | `/videos/compressed/hero-section-video.MOV` | `components/HeroBackground.tsx` |
| Journey Before | `/images/journey/before/` | `app/journey/page.tsx` |
| Journey After | `/images/journey/after/` | `app/journey/page.tsx` |
| Journey Video | `/videos/compressed/b4launch.MOV` | `app/journey/page.tsx` |
| Media Gallery | `/images/events/` | `app/media/page.tsx` |
| YouTube Videos | `lib/videos.ts` | `app/media/page.tsx` |
| Event Posters | `/images/events/posters/` | Admin portal |

---

## 📝 Step-by-Step: Adding a New Photo

### Method 1: Admin Portal (Easiest)

1. Log in at `/admin/login`
2. Go to `/admin/media`
3. Select media location from dropdown
4. Click "Upload Image" or "Add YouTube Video"
5. Select file or paste YouTube URL
6. Click "Save"
7. Done! Photo appears on site immediately

### Method 2: Manual Upload

1. **Prepare photo:**
   - Resize if needed (aim for < 2MB)
   - Name clearly: `event-name-1.jpg` (lowercase, no spaces)

2. **Place file:**
   - Put in appropriate `public/images/` subfolder
   - Example: `public/images/events/opening-game-1.jpg`

3. **Update code** (if needed):
   - Find where photo should appear
   - Update `src` path: `src="/images/events/opening-game-1.jpg"`
   - Add `alt` text for accessibility

4. **Test:**
   - Save file
   - Refresh browser
   - Check photo appears correctly

---

## 🎥 Step-by-Step: Adding a Video

### YouTube Video (Recommended)

1. Upload video to YouTube
2. Copy video ID from URL
3. **Via Admin:** `/admin/media` → Select location → Paste YouTube URL
4. **Manual:** Add to `lib/videos.ts`:
   ```typescript
   export const videos: VideoConfig[] = [
     // ... existing videos
     {
       key: 'new-video-key',
       title: 'Video Title',
       videoId: 'YOUR_VIDEO_ID',
       category: 'launch-day', // or other category
     },
   ];
   ```

### Direct Video File

1. **Compress video:**
   ```bash
   ./scripts/compress-videos.sh path/to/video.MOV
   ```

2. **Move to public folder:**
   ```bash
   mv compressed-video.MOV public/videos/compressed/
   ```

3. **Reference in code:**
   ```tsx
   <video src="/videos/compressed/filename.MOV" controls />
   ```

---

## 🔄 Updating Existing Photos/Videos

### Replace a Photo

1. **Keep same filename:** Just replace the file in `public/`
2. **Change filename:** Update code reference to new path
3. **Via Admin:** Upload new file to same location (replaces old)

### Update Video

1. **YouTube:** Update video ID in `lib/videos.ts` or admin portal
2. **Direct file:** Replace file in `public/videos/compressed/`
3. Clear browser cache if changes don't appear

---

## 🛠️ Tools & Scripts

### Video Compression Script

**Location:** `scripts/compress-videos.sh`

**Usage:**
```bash
# Compress a single video
./scripts/compress-videos.sh path/to/video.MOV

# Compress all videos in a folder
./scripts/compress-videos.sh madpics/
```

**Output:** Compressed videos saved to `public/videos/compressed/`

### Media Organization Script

**Location:** `scripts/organize-media.js`

**Usage:**
```bash
node scripts/organize-media.js
```

**Purpose:** Analyzes and organizes media files from source folders

---

## ✅ Best Practices

1. **File Naming:**
   - ✅ Use lowercase: `court-hero.jpg`
   - ✅ Use hyphens: `opening-game-1.jpg`
   - ❌ Avoid spaces: `Court Hero.jpg`
   - ❌ Avoid capitals: `Court-Hero.jpg`

2. **File Sizes:**
   - Images: Keep under 2MB
   - Videos: Compress before uploading (use script)
   - Use compression tools: TinyPNG, Squoosh

3. **Organization:**
   - Use appropriate subfolders (`events/`, `journey/`, etc.)
   - Keep related files together
   - Document file purposes in filenames

4. **Accessibility:**
   - Always add descriptive `alt` text for images
   - Provide captions for videos when possible
   - Ensure images have proper contrast

5. **Performance:**
   - Use Next.js `Image` component (automatic optimization)
   - Compress videos before uploading
   - Use YouTube for large videos (better performance)

---

## 🆘 Troubleshooting

### Photo Not Showing?

1. **Check file path:**
   - Paths start with `/` (e.g., `/images/...`)
   - Case-sensitive! `Court.jpg` ≠ `court.jpg`
   - File exists in `public/` folder

2. **Check code:**
   - Imported `Image` from `next/image`?
   - `src` path matches file location?
   - File extension matches (`.jpg` vs `.jpeg`)

3. **Clear cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Clear browser cache
   - Restart dev server

### Video Not Playing?

1. **YouTube videos:**
   - Check video ID is correct
   - Video is public/unlisted (not private)
   - Check `lib/videos.ts` has correct entry

2. **Direct video files:**
   - File is in `public/videos/compressed/`
   - File format is supported (`.mp4`, `.MOV`)
   - File size is reasonable (< 10MB recommended)

### Changes Not Appearing?

1. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check browser cache:**
   - Hard refresh page
   - Try incognito/private window

---

## 📚 Additional Resources

- **Admin Portal:** `/admin/media` - Visual media management
- **Video Config:** `lib/videos.ts` - YouTube video configuration
- **Components:**
  - `components/YouTubeEmbed.tsx` - YouTube video embed
  - `components/HeroBackground.tsx` - Hero section background
  - `components/SafeImage.tsx` - Safe image component with fallback

---

## 🎯 Quick Checklist

When adding/updating media:

- [ ] File is properly named (lowercase, no spaces)
- [ ] File is in correct `public/` subfolder
- [ ] File size is reasonable (< 2MB for images, compressed for videos)
- [ ] Code reference matches file path
- [ ] `alt` text added for images
- [ ] Tested in browser
- [ ] Works on mobile (responsive)
- [ ] Cleared cache if needed

---

**Need help?** Check the admin portal at `/admin/media` for the easiest way to manage media, or refer to the code locations table above for manual updates.

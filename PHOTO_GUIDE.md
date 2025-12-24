# Beginner's Guide: Adding Photos to Your Website

This guide will walk you through adding photos to the Madina Basketball website step by step. Don't worry if you're new to this - we'll make it simple!

---

## 📁 Step 1: Understanding Where Photos Go

All photos for the website go in a folder called `public`. This folder is already in your project.

**Location:** `/Users/aadam/Desktop/Projects/madinabasketball/public/`

You can create subfolders inside `public` to organize your photos:
- `public/images/` - for general images
- `public/images/court/` - for court photos
- `public/images/events/` - for event photos
- `public/images/teams/` - for team photos

---

## 📸 Step 2: Preparing Your Photos

### Before Adding Photos:

1. **Resize large photos** (optional but recommended):
   - Large photos (over 2MB) can slow down the website
   - Use a free tool like:
     - **Online:** [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
     - **Mac:** Preview app (Tools > Adjust Size)
   - Aim for photos around 1-2MB or less

2. **Name your photos clearly:**
   - Use descriptive names like: `court-hero.jpg`, `opening-game-1.jpg`
   - Use lowercase letters and hyphens (no spaces)
   - Examples:
     - ✅ `court-before.jpg`
     - ✅ `opening-ceremony.jpg`
     - ❌ `Court Before.jpg` (has spaces and capitals)

---

## 🖼️ Step 3: Adding Photos to Specific Pages

### A. Homepage Hero Image

**File to edit:** `app/page.tsx`

**Current code (around line 10-15):**
```tsx
<section className="relative min-h-[90vh] flex items-center overflow-hidden">
  {/* Background Image - Replace with actual court image */}
  <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-primary">
    <div className="absolute inset-0 bg-black/40"></div>
  </div>
```

**Replace with:**
```tsx
<section className="relative min-h-[90vh] flex items-center overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src="/images/court/court-hero.jpg"
      alt="Madina Basketball Court"
      fill
      className="object-cover"
      priority
    />
    <div className="absolute inset-0 bg-black/40"></div>
  </div>
```

**Don't forget to add the import at the top of the file:**
```tsx
import Image from "next/image";
```

**Steps:**
1. Put your hero image in: `public/images/court/court-hero.jpg`
2. Update the code as shown above
3. Replace `court-hero.jpg` with your actual filename

---

### B. Journey Page - Before/After Photos

**File to edit:** `app/journey/page.tsx`

**Find this section (around line 50-70):**
```tsx
<div className="aspect-video bg-gray-200 flex items-center justify-center p-8">
  <div className="text-center text-gray-400">
    <Users className="w-16 h-16 mx-auto mb-4" />
    <p className="text-sm">Before renovation photo</p>
  </div>
</div>
```

**Replace with:**
```tsx
<div className="aspect-video relative overflow-hidden rounded-lg">
  <Image
    src="/images/court/court-before.jpg"
    alt="Court before renovation"
    fill
    className="object-cover"
  />
</div>
```

**Do the same for the "After" section:**
```tsx
<div className="aspect-video relative overflow-hidden rounded-lg">
  <Image
    src="/images/court/court-after.jpg"
    alt="Court after renovation"
    fill
    className="object-cover"
  />
</div>
```

**Steps:**
1. Put your before photo in: `public/images/court/court-before.jpg`
2. Put your after photo in: `public/images/court/court-after.jpg`
3. Update both sections in the code

---

### C. Opening Ceremony Game Photos

**File to edit:** `app/journey/page.tsx` or `app/teams/page.tsx`

**Find this section:**
```tsx
<div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
  <div className="text-center text-gray-400">
    <Trophy className="w-16 h-16 mx-auto mb-4" />
    <p className="text-sm">Opening Game Photos</p>
  </div>
</div>
```

**Replace with:**
```tsx
<div className="aspect-video relative overflow-hidden rounded-lg">
  <Image
    src="/images/events/opening-game-1.jpg"
    alt="Opening ceremony game - Madina vs Kawukudi"
    fill
    className="object-cover"
  />
</div>
```

**Steps:**
1. Put your opening game photos in: `public/images/events/`
2. Name them: `opening-game-1.jpg`, `opening-game-2.jpg`, etc.
3. Update the code with your first photo

---

### D. Media Gallery Page

**File to edit:** `app/media/page.tsx`

**For multiple photos, you can create a gallery:**

**Find this section (around line 30-50):**
```tsx
{[1, 2, 3, 4, 5, 6].map((i) => (
  <div key={i} className="bg-muted rounded-xl overflow-hidden aspect-square">
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center p-8">
        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Launch Photo {i}</p>
      </div>
    </div>
  </div>
))}
```

**Replace with:**
```tsx
{[
  '/images/events/launch-1.jpg',
  '/images/events/launch-2.jpg',
  '/images/events/launch-3.jpg',
  '/images/events/launch-4.jpg',
  '/images/events/launch-5.jpg',
  '/images/events/launch-6.jpg',
].map((src, i) => (
  <div key={i} className="bg-muted rounded-xl overflow-hidden aspect-square relative">
    <Image
      src={src}
      alt={`Launch event photo ${i + 1}`}
      fill
      className="object-cover"
    />
  </div>
))}
```

**Steps:**
1. Put all your launch photos in: `public/images/events/`
2. Name them: `launch-1.jpg`, `launch-2.jpg`, etc.
3. Update the array in the code with your actual photo paths

---

## 🎬 Step 4: Adding Videos (Optional)

For videos, you have two options:

### Option 1: YouTube/Vimeo Embed (Recommended)

1. Upload your video to YouTube or Vimeo
2. Get the embed code
3. In your code, replace the placeholder with:

```tsx
<div className="aspect-video relative">
  <iframe
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    title="Opening Ceremony Game"
    className="w-full h-full rounded-lg"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>
```

### Option 2: Direct Video File

1. Put video in: `public/videos/opening-game.mp4`
2. Use this code:

```tsx
<div className="aspect-video relative">
  <video
    src="/videos/opening-game.mp4"
    controls
    className="w-full h-full rounded-lg"
  >
    Your browser does not support the video tag.
  </video>
</div>
```

---

## ✅ Step 5: Testing Your Photos

After adding photos:

1. **Save all your files**
2. **Check the terminal** - if there are errors, they'll show here
3. **Refresh your browser** at `http://localhost:3000`
4. **Check each page** where you added photos

**Common Issues:**
- ❌ Photo not showing? Check the file path matches exactly
- ❌ Photo looks stretched? Make sure you're using `object-cover` in the className
- ❌ Error message? Make sure you imported `Image` from `next/image`

---

## 📝 Quick Reference: File Structure

After adding photos, your `public` folder should look like:

```
public/
├── images/
│   ├── court/
│   │   ├── court-hero.jpg
│   │   ├── court-before.jpg
│   │   └── court-after.jpg
│   └── events/
│       ├── opening-game-1.jpg
│       ├── opening-game-2.jpg
│       ├── launch-1.jpg
│       └── launch-2.jpg
└── videos/
    └── opening-game.mp4
```

---

## 🎯 Step-by-Step Checklist

For each photo you want to add:

- [ ] Resize/optimize the photo (optional)
- [ ] Name the photo clearly (lowercase, no spaces)
- [ ] Put it in the correct `public/images/` folder
- [ ] Find the placeholder in the code
- [ ] Replace with `<Image>` component
- [ ] Add the correct `src` path
- [ ] Add descriptive `alt` text
- [ ] Save the file
- [ ] Check in browser

---

## 💡 Pro Tips

1. **Use Next.js Image component** - It automatically optimizes images for faster loading
2. **Add descriptive alt text** - Helps with accessibility and SEO
3. **Keep file sizes reasonable** - Under 2MB is ideal
4. **Use consistent naming** - Makes it easier to find photos later
5. **Test on mobile** - Make sure photos look good on phones too

---

## 🆘 Need Help?

If you get stuck:
1. Check the error message in the terminal
2. Make sure the file path is correct (case-sensitive!)
3. Verify the photo file exists in the `public` folder
4. Check that you imported `Image` from `next/image`

---

## 📚 Example: Complete Photo Addition

Let's say you want to add a hero image:

1. **Photo file:** `my-court-photo.jpg` (on your computer)

2. **Move it to:** `public/images/court/court-hero.jpg`

3. **Update code in `app/page.tsx`:**
   ```tsx
   // Add import at top
   import Image from "next/image";
   
   // Replace the background div with:
   <div className="absolute inset-0">
     <Image
       src="/images/court/court-hero.jpg"
       alt="Madina Basketball Court"
       fill
       className="object-cover"
       priority
     />
     <div className="absolute inset-0 bg-black/40"></div>
   </div>
   ```

4. **Save and refresh!** 🎉

---

That's it! You're ready to add photos to your website. Start with one photo, test it, then add more. Good luck! 🏀


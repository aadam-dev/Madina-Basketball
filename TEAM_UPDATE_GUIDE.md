# Easy Guide: Updating Team Members

This guide shows you exactly how to add team member names, roles, descriptions, and photos to the Team page.

---

## 📍 Where to Edit

**File:** `app/team/page.tsx`

The file is organized with separate arrays for each team section at the top. Just find the section you want to update and add/edit the information.

---

## 🎯 Step-by-Step: Adding a Team Member

### Example: Adding a Coach

1. **Find the coaches array** (around line 30-40)
2. **Add a new object** like this:

```javascript
const coaches = [
  {
    name: "Coach Name Here",           // ← Change this
    role: "Head Coach",                 // ← Change this
    description: "Your description",   // ← Change this
    image: "/images/team/coach-1.jpg", // ← Change this to your image path
  },
  // Add more coaches by copying the object above:
  {
    name: "Assistant Coach Name",
    role: "Assistant Coach",
    description: "Supporting training sessions.",
    image: "/images/team/coach-2.jpg",
  },
];
```

---

## 📸 Adding Photos

### Step 1: Put the Photo in the Right Folder

1. Create folder: `public/images/team/`
2. Put your photo there (e.g., `shafic.jpg`, `coach-1.jpg`)
3. Use lowercase, no spaces in filename

### Step 2: Update the Image Path

In the team member object, change:
```javascript
image: "/images/team/shafic.jpg"  // ← Use your actual filename
```

**Important:** The path starts with `/images/team/` because photos go in the `public` folder.

---

## 📝 All Team Sections

### 1. Renovation Leads
```javascript
const renovationLeads = [
  {
    name: "Shafic",
    role: "Renovation Lead",
    description: "Your description here",
    image: "/images/team/shafic.jpg",
  },
  {
    name: "Adam",
    role: "Renovation Lead",
    description: "Your description here",
    image: "/images/team/adam.jpg",
  },
];
```

### 2. Media Team
```javascript
const mediaTeam = [
  {
    name: "Media Person Name",
    role: "Photographer/Videographer",
    description: "What they do",
    image: "/images/team/media-1.jpg",
  },
];
```

### 3. Coaches
```javascript
const coaches = [
  {
    name: "Coach Name",
    role: "Head Coach",
    description: "What they do",
    image: "/images/team/coach-1.jpg",
  },
];
```

### 4. Court Maintenance Team
```javascript
const maintenanceTeam = [
  {
    name: "Maintenance Person Name",
    role: "Court Maintenance",
    description: "What they do",
    image: "/images/team/maintenance-1.jpg",
  },
];
```

---

## ✅ Quick Checklist

For each team member you add:

- [ ] Name is correct
- [ ] Role is correct
- [ ] Description explains what they do
- [ ] Image path points to actual photo file
- [ ] Photo file exists in `public/images/team/` folder

---

## 🖼️ Photo Tips

- **Size:** Photos should be square (or close to it) for best results
- **Format:** JPG or PNG
- **File size:** Under 1MB is best
- **Naming:** Use lowercase, no spaces (e.g., `shafic.jpg`, not `Shafic Photo.jpg`)

---

## 🔄 Removing Team Members

Just delete the entire object `{ ... }` from the array. For example:

**Before:**
```javascript
const coaches = [
  { name: "Coach 1", ... },
  { name: "Coach 2", ... },  // ← Delete this entire block
  { name: "Coach 3", ... },
];
```

**After:**
```javascript
const coaches = [
  { name: "Coach 1", ... },
  { name: "Coach 3", ... },
];
```

---

## 💡 Example: Complete Update

Let's say you want to add a new coach named "Kwame Mensah":

1. **Add photo:** Put `kwame-mensah.jpg` in `public/images/team/`

2. **Update the coaches array:**
```javascript
const coaches = [
  {
    name: "Kwame Mensah",
    role: "Head Coach",
    description: "Leading training sessions and developing players' skills and character.",
    image: "/images/team/kwame-mensah.jpg",
  },
];
```

3. **Save the file** - Done! ✅

---

## 🆘 Troubleshooting

**Photo not showing?**
- Check the file path matches exactly (case-sensitive!)
- Make sure the file is in `public/images/team/`
- Check the filename has no spaces

**Getting an error?**
- Make sure you have a comma `,` after each object except the last one
- Make sure all quotes `"` are closed
- Check for typos in the code

---

That's it! The team page will automatically display all members you add to these arrays. 🎉


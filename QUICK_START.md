# Quick Start Guide

## Immediate Next Steps

### 1. Update Node.js (if needed)
```bash
# Check your Node version
node --version

# If below 20.9.0, upgrade Node.js
# Using nvm (recommended):
nvm install 20
nvm use 20
```

### 2. Install Dependencies & Run
```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### 3. Essential Customizations (Before Launch)

#### Priority 1: Contact Information
- [ ] Update WhatsApp number in:
  - `components/Footer.tsx` (line with `wa.me/233XXXXXXXXX`)
  - `app/contact/page.tsx` (multiple locations)
  - `app/book/page.tsx`
- [ ] Update email address:
  - `components/Footer.tsx`
  - `app/contact/page.tsx`
  - `app/layout.tsx` (metadata)

#### Priority 2: Forms
- [ ] Add Google Form embed for Registration (`app/register/page.tsx`)
- [ ] Add Google Form embed for Booking (`app/book/page.tsx`)
- [ ] Add Google Form embed for Contact (`app/contact/page.tsx`)

#### Priority 3: Social Media
- [ ] Update Facebook URL in:
  - `components/Footer.tsx`
  - `app/contact/page.tsx`
  - `app/media/page.tsx`
- [ ] Update Instagram URL in same files

#### Priority 4: Images
- [ ] Add hero image (Home page)
- [ ] Add court photos (Court page, Journey page)
- [ ] Add launch day photos (Media page)
- [ ] Add before/after photos (Journey page)

#### Priority 5: Maps
- [ ] Add Google Maps embed in `app/court/page.tsx`
- [ ] Add Google Maps embed in `app/contact/page.tsx`

#### Priority 6: Financial Data
- [ ] Update BOQ breakdown with actual amounts (`app/transparency/page.tsx`)
- [ ] Add contractor invoice (redacted if needed)
- [ ] Update fundraising dashboard with real data

### 4. Optional Enhancements
- [ ] Add partner logos (`app/partners/page.tsx`)
- [ ] Add actual photos to gallery (`app/media/page.tsx`)
- [ ] Add videos (YouTube/Vimeo embeds)
- [ ] Update metadata for SEO (`app/layout.tsx`)

## Testing Checklist

Before going live:
- [ ] Test all navigation links
- [ ] Test mobile responsiveness
- [ ] Verify all forms work
- [ ] Check all contact links
- [ ] Test on different browsers
- [ ] Verify images load correctly
- [ ] Check page load speeds

## Deployment

### Vercel (Easiest)
1. Push to GitHub
2. Import in Vercel
3. Deploy

### Netlify
1. Push to GitHub
2. Connect in Netlify
3. Build: `npm run build`
4. Publish: `.next`

## Need Help?

- Check `README.md` for detailed documentation
- Review Next.js docs: https://nextjs.org/docs
- Contact the development team


# Madina Basketball - Community Court Website

A modern, community-centric website for the Madina Basketball court in Libya Quarters, Madina (Accra, Ghana). Built with Next.js, TypeScript, and Tailwind CSS.

## 🎯 Project Overview

This website serves as:
- **Operational Platform**: Player registration, court bookings, event management
- **Historical Archive**: Complete documentation of the renovation journey
- **Community Hub**: Information, updates, and engagement
- **Transparency Portal**: Financial documentation and project transparency

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9.0 or higher (currently using 18.20.8 - may need upgrade)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📁 Project Structure

```
madinabasketball/
├── app/                    # Next.js App Router pages
│   ├── about/             # About the Project
│   ├── journey/           # The Journey timeline
│   ├── court/             # The Court information
│   ├── training/          # Training & Programs
│   ├── register/         # Register to Play
│   ├── book/              # Book the Court
│   ├── transparency/     # Transparency & Financials
│   ├── partners/          # Partners & Supporters
│   ├── media/             # Media & Gallery
│   └── contact/           # Contact page
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Site footer
├── public/                # Static assets
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: `#ff6b35` (Orange) - Basketball court accents
- **Secondary**: `#004e89` (Blue) - Trust and professionalism
- **Accent**: `#ffd23f` (Yellow) - Highlights
- **Muted**: `#f5f5f5` (Light gray) - Backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large, impactful
- **Body**: Clean, readable, accessible

## 📝 Customization Guide

### 1. Replace Placeholder Content

#### Google Forms
- **Registration Form** (`/app/register/page.tsx`): Replace placeholder with your Google Form embed
- **Booking Form** (`/app/book/page.tsx`): Replace placeholder with your Google Form embed
- **Contact Form** (`/app/contact/page.tsx`): Replace placeholder with your Google Form embed

To embed a Google Form:
1. Open your Google Form
2. Click "Send" → Embed icon
3. Copy the iframe code
4. Replace the placeholder div with the iframe

#### Contact Information
Update contact details in:
- `components/Footer.tsx`
- `app/contact/page.tsx`
- Replace `233XXXXXXXXX` with actual WhatsApp number
- Replace `info@madinabasketball.com` with actual email

#### Social Media Links
Update social media links in:
- `components/Footer.tsx`
- `app/contact/page.tsx`
- `app/media/page.tsx`
- Replace placeholder URLs with actual Facebook/Instagram links

### 2. Add Real Images

Replace placeholder image divs with actual photos:

#### Home Page
- Hero image of the completed court
- Stats section can use icons or small images

#### Journey Page
- Before/after photos
- Renovation progress photos
- Launch day photos

#### Court Page
- Current court photos
- Location map (Google Maps embed)

#### Media Page
- Launch game photos
- Training session photos
- Event photos
- Videos (YouTube/Vimeo embeds)

### 3. Update Financial Information

In `app/transparency/page.tsx`:
- Add actual BOQ breakdown with real amounts
- Upload contractor invoice (redacted if needed)
- Update fundraising dashboard with real data
- Add actual financial statements

### 4. Add Partner Information

In `app/partners/page.tsx`:
- Add actual supporter names/logos
- Add business partner logos
- List volunteer contributors
- Add partner testimonials if available

### 5. Configure Maps

Add Google Maps embed:
1. Go to Google Maps
2. Search for "Libya Quarters, Madina, Accra"
3. Click "Share" → "Embed a map"
4. Copy iframe code
5. Replace placeholder in:
   - `app/court/page.tsx`
   - `app/contact/page.tsx`

### 6. Update Metadata

In `app/layout.tsx`:
- Update title and description
- Add Open Graph tags for social sharing
- Add Twitter Card metadata

## 🔧 Technical Details

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel/Netlify

### Performance
- Mobile-first responsive design
- Optimized images (use Next.js Image component)
- Fast page loads
- SEO-friendly structure

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Optimization

The website is fully responsive and mobile-first:
- Hamburger menu for mobile navigation
- Touch-friendly buttons and links
- Optimized typography for small screens
- Fast loading on mobile networks

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify

1. Push code to GitHub
2. Connect repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

### Environment Variables

No environment variables required for basic setup. Add if needed for:
- Analytics (Google Analytics, etc.)
- Contact form backend
- Email service

## 📊 Future Enhancements

Consider adding:
- Blog/news section for updates
- Event calendar
- Online payment integration for bookings
- Player database/management
- Photo gallery with lightbox
- Video player integration
- Newsletter signup
- Donation system (if reopening fundraising)

## 🤝 Contributing

This is a community project. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for the Madina Basketball community.

## 📞 Support

For questions or issues:
- Check the customization guide above
- Review Next.js documentation
- Contact the development team

## 🙏 Acknowledgments

Built with transparency and community spirit for the Madina Basketball community.

---

**Note**: This website is designed to outlive social media and serve as the canonical source of truth for the Madina Basketball court project.

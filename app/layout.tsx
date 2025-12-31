/**
 * Root Layout Component
 * 
 * The root layout wraps all pages in the application.
 * It provides:
 * - Global font configuration (Poppins)
 * - SEO metadata
 * - Site wrapper (Header/Footer for public pages)
 * 
 * Admin routes are handled separately in app/admin/layout.tsx
 */

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SiteWrapper from "@/components/SiteWrapper";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

/**
 * Poppins font configuration
 * 
 * Optimized for performance:
 * - Only loads necessary font weights (400, 600, 700)
 * - display: "swap" prevents invisible text during font load
 * - preload: true for faster initial render
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Regular, Semi-bold, Bold
  variable: "--font-poppins",
  display: "swap", // Show fallback font until Poppins loads
  preload: true, // Preload font for faster rendering
});

/**
 * SEO Metadata
 * Used for search engines and social media sharing
 */
export const metadata: Metadata = {
  title: "Madina Basketball — Community-Built Court, Now Active",
  description: "A grassroots basketball initiative in Libya Quarters, Madina (Accra, Ghana). Community-renovated court, now active with training programs, pick-up games, and bookings.",
  keywords: "basketball, Madina, Accra, Ghana, community sports, youth development, Libya Quarters",
  icons: {
    icon: '/images/logo/madina-basketball-logo.png',
    shortcut: '/images/logo/madina-basketball-logo.png',
    apple: '/images/logo/madina-basketball-logo.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MBB Score',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

/**
 * Root Layout
 * 
 * Wraps all pages with:
 * - HTML structure
 * - Font variables
 * - SiteWrapper (conditionally adds Header/Footer)
 * 
 * Note: Admin routes have their own layout in app/admin/layout.tsx
 * and will not receive Header/Footer from SiteWrapper
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ServiceWorkerRegistration />
        <SiteWrapper>{children}</SiteWrapper>
      </body>
    </html>
  );
}

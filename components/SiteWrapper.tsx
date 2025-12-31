/**
 * SiteWrapper Component
 * 
 * Wraps all pages with common layout elements (Header, Footer).
 * Admin routes are excluded from this wrapper as they have their own layout.
 * 
 * This component uses client-side routing to detect admin routes and conditionally
 * render the header/footer only for public pages.
 * 
 * @component
 */

"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OfflineIndicator from "@/components/OfflineIndicator";
import { useOfflineSync } from "@/lib/hooks/useGameAutoSave";

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Enable offline sync for all routes
  useOfflineSync();

  // Admin routes have their own layout - don't wrap with Header/Footer
  if (isAdminRoute) {
    return (
      <>
        {children}
        <OfflineIndicator />
      </>
    );
  }

  // Public routes - wrap with Header and Footer
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <OfflineIndicator />
    </>
  );
}


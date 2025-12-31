/**
 * Header Component
 * 
 * Main navigation header for the website.
 * Features:
 * - Responsive design (mobile hamburger menu, desktop horizontal nav)
 * - Logo with link to homepage
 * - Sticky positioning (stays at top when scrolling)
 * - Prefetching enabled on all links for faster navigation
 * 
 * @component
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Main navigation links
   * Displayed in desktop nav and mobile menu
   */
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/court", label: "The Court" },
    { href: "/team", label: "Leadership" },
    { href: "/teams", label: "Our Teams" },
    { href: "/training", label: "Training" },
    { href: "/partners", label: "Partners" },
    { href: "/tools", label: "Tools" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-14 w-auto flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo/madina-basketball-logo.png?v=3"
                alt="Madina Basketball Logo"
                width={84}
                height={56}
                className="object-contain h-14 w-auto"
                priority
                loading="eager"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg lg:text-xl text-foreground">
                Madina Basketball
              </div>
              <div className="text-xs text-gray-600">Community Court</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.slice(1, -1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors rounded-md hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              prefetch={true}
              className="ml-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-1">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-muted transition-colors rounded-md ${
                    link.href === "/contact" ? "bg-primary text-white hover:bg-primary-dark hover:text-white" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


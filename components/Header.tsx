"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/journey", label: "Journey" },
    { href: "/court", label: "The Court" },
    { href: "/training", label: "Programs" },
    { href: "/team", label: "Team" },
    { href: "/partners", label: "Partners" },
    { href: "/transparency", label: "Transparency" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl lg:text-2xl">M</span>
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
            {navLinks.slice(1, 7).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors rounded-md hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors rounded-md hover:bg-muted"
            >
              Register
            </Link>
            <Link
              href="/book"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors rounded-md hover:bg-muted"
            >
              Book Court
            </Link>
            <Link
              href="/contact"
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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-muted transition-colors rounded-md"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-muted transition-colors rounded-md"
              >
                Register
              </Link>
              <Link
                href="/book"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-muted transition-colors rounded-md"
              >
                Book Court
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/about",     label: "About" },
  { href: "/court",     label: "The Court" },
  { href: "/team",      label: "Leadership" },
  { href: "/teams",     label: "Our Teams" },
  { href: "/training",  label: "Training" },
  { href: "/media",     label: "Media" },
  { href: "/partners",  label: "Partners" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/97 backdrop-blur-md shadow-2xl shadow-black/50 border-b border-white/8"
          : "bg-[#0a0a0a] border-b border-white/6"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.5rem] lg:h-[5.5rem]">

          {/* ── Logo ───────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="h-12 w-12 flex items-center justify-center">
              <Image
                src="/images/logo/madina-basketball-logo.png?v=3"
                alt="Madina Basketball Logo"
                width={52}
                height={52}
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                priority
                loading="eager"
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-black text-white text-sm lg:text-base uppercase tracking-tight">
                Madina <span className="text-[#ff6b35]">Basketball</span>
              </div>
              <div className="text-[0.62rem] text-white/35 font-semibold tracking-widest uppercase">
                Libya Quarters · Accra
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className="px-3 py-2 text-[0.78rem] font-semibold text-white/55 hover:text-white uppercase tracking-wider transition-colors rounded-lg hover:bg-white/6"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              prefetch={true}
              className="ml-3 px-5 py-2 bg-[#ff6b35] text-white text-[0.78rem] font-bold rounded-lg hover:bg-[#e55a2b] transition-colors uppercase tracking-wider"
            >
              Contact
            </Link>
          </div>

          {/* ── Mobile Toggle ───────────────────────────────────────────── */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile Drawer ──────────────────────────────────────────────── */}
        {open && (
          <div className="lg:hidden pb-4 border-t border-white/8 pt-3">
            <div className="flex flex-col gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/6 uppercase tracking-wider transition-colors rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                prefetch={true}
                onClick={() => setOpen(false)}
                className="mt-2 mx-0 px-4 py-2.5 bg-[#ff6b35] text-white text-sm font-bold rounded-lg hover:bg-[#e55a2b] transition-colors uppercase tracking-wider text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

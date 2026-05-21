"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/about",     label: "About" },
  { href: "/court",     label: "The Court" },
  { href: "/team",      label: "Leadership" },
  { href: "/teams",     label: "Our Teams" },
  { href: "/training",  label: "Training" },
  { href: "/media",     label: "Media" },
  { href: "/partners",  label: "Partners" },
  { href: "/tools",     label: "Tools" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/97 backdrop-blur-md shadow-2xl shadow-black/50 border-b border-white/8"
            : "bg-[#0a0a0a] border-b border-white/6"
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[4.5rem] lg:h-[5.5rem]">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0" onClick={() => setOpen(false)}>
              <div className="h-12 w-12 flex items-center justify-center flex-shrink-0">
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
              <div className="leading-tight">
                <div className="font-black text-white text-sm lg:text-base uppercase tracking-tight">
                  Madina <span className="text-[#ff6b35]">Basketball</span>
                </div>
                <div className="text-[0.6rem] text-white/35 font-semibold tracking-widest uppercase hidden sm:block">
                  Libya Quarters · Accra
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
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

            {/* ── Mobile Toggle ── */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/8 active:bg-white/12"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Full-screen mobile overlay ── */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col lg:hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 h-[4.5rem] border-b border-white/8 flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
              <Image
                src="/images/logo/madina-basketball-logo.png?v=3"
                alt="Madina Basketball"
                width={44}
                height={44}
                className="object-contain"
              />
              <div className="font-black text-white text-sm uppercase tracking-tight">
                Madina <span className="text-[#ff6b35]">Basketball</span>
              </div>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/8"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 h-[52px] text-base font-bold text-white/65 hover:text-white hover:bg-white/6 uppercase tracking-wider transition-colors rounded-xl group"
                >
                  {link.label}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#ff6b35]" />
                </Link>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-6 pt-6 border-t border-white/8">
              <Link
                href="/contact"
                prefetch={true}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center h-[52px] w-full bg-[#ff6b35] text-white text-base font-bold rounded-xl hover:bg-[#e55a2b] transition-colors uppercase tracking-wider"
              >
                Contact Us
              </Link>
            </div>
          </nav>

          {/* Bottom branding */}
          <div className="px-6 pb-8 pt-4 border-t border-white/6 flex-shrink-0">
            <p className="text-white/25 text-xs uppercase tracking-widest font-bold">
              Libya Quarters · Madina · Accra, Ghana
            </p>
          </div>
        </div>
      )}
    </>
  );
}

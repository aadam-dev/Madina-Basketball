import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, ArrowUpRight } from "lucide-react";

const LINKS_COURT = [
  { href: "/about",        label: "About" },
  { href: "/court",        label: "The Court" },
  { href: "/journey",      label: "Our Journey" },
  { href: "/training",     label: "Training" },
  { href: "/teams",        label: "Our Teams" },
  { href: "/media",        label: "Media" },
];

const LINKS_GET_INVOLVED = [
  { href: "/register",     label: "Register to Play" },
  { href: "/book",         label: "Book the Court" },
  { href: "/partners",     label: "Partners & Sponsors" },
  { href: "/transparency", label: "Transparency" },
  { href: "/contact",      label: "Contact Us" },
];

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/8 text-white">

      {/* ── Main grid ── */}
      <div className="container mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 group mb-5 w-fit">
              <Image
                src="/images/logo/madina-basketball-logo.png?v=3"
                alt="Madina Basketball"
                width={44}
                height={44}
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="leading-tight">
                <div className="font-black text-white text-sm uppercase tracking-tight">
                  Madina <span className="text-[#ff6b35]">Basketball</span>
                </div>
                <div className="text-[0.6rem] text-white/30 font-semibold tracking-widest uppercase">
                  Libya Quarters · Accra
                </div>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              A community-built basketball court in Madina, Accra. Built by the people. Run by the people.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <Link
                href="https://facebook.com/madinabasketball"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 bg-white/6 border border-white/10 rounded-lg flex items-center justify-center hover:bg-[#1877f2]/20 hover:border-[#1877f2]/40 transition-colors"
              >
                <Facebook size={15} className="text-white/60" />
              </Link>
              <Link
                href="https://instagram.com/madinabasketball"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 bg-white/6 border border-white/10 rounded-lg flex items-center justify-center hover:bg-[#e1306c]/20 hover:border-[#e1306c]/40 transition-colors"
              >
                <Instagram size={15} className="text-white/60" />
              </Link>
              <Link
                href="https://wa.me/233559602056"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 bg-white/6 border border-white/10 rounded-lg flex items-center justify-center hover:bg-[#25d366]/20 hover:border-[#25d366]/40 transition-colors"
              >
                <MessageCircle size={15} className="text-white/60" />
              </Link>
            </div>
          </div>

          {/* Court */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-5">The Court</h4>
            <ul className="space-y-2.5">
              {LINKS_COURT.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch={true}
                    className="text-white/40 text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-5">Get Involved</h4>
            <ul className="space-y-2.5">
              {LINKS_GET_INVOLVED.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch={true}
                    className="text-white/40 text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-5">Find Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span className="text-white/40 leading-snug">
                  Libya Quarters, Madina<br />Accra, Ghana
                </span>
              </li>
              <li>
                <Link
                  href="https://wa.me/233559602056"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/40 hover:text-[#25d366] transition-colors group"
                >
                  <MessageCircle size={15} className="text-[#25d366] flex-shrink-0" />
                  <span>WhatsApp Us</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:themadinacourt@gmail.com"
                  className="flex items-center gap-3 text-white/40 hover:text-[#ff6b35] transition-colors group"
                >
                  <Mail size={15} className="text-[#ff6b35] flex-shrink-0" />
                  <span className="text-xs">themadinacourt@gmail.com</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>

            {/* CTA */}
            <Link
              href="/register"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-[#ff6b35] text-white text-xs font-bold rounded-xl hover:bg-[#e55a2b] transition-colors uppercase tracking-wider"
            >
              Register to Play
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/6">
        <div className="container mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Madina Basketball. Community-built and transparency-first.
          </p>
          <div className="flex items-center gap-4 text-white/25 text-xs">
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-white/50 transition-colors">Terms</Link>
            <span>
              Site by{" "}
              <a
                href="mailto:aadamsays@gmail.com"
                className="text-[#ff6b35]/60 hover:text-[#ff6b35] transition-colors font-semibold"
              >
                Adam
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

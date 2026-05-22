import { MapPin, Mail, Facebook, Instagram, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Contact() {
  const faqs = [
    {
      q: "Court Bookings",
      a: "Use our booking form or contact us via WhatsApp for immediate availability. Walk-ins welcome during non-booked hours.",
      href: "/book",
      cta: "Book the Court",
    },
    {
      q: "Player Registration",
      a: "New players can register through our registration form. All skill levels and ages welcome.",
      href: "/register",
      cta: "Register to Play",
    },
    {
      q: "Partnerships & Sponsorships",
      a: "Contact us via email or WhatsApp to discuss partnership opportunities, sponsorships, or support programmes.",
      href: null,
      cta: null,
    },
    {
      q: "Volunteer Opportunities",
      a: "We welcome volunteers for coaching, administration, and event organisation. Reach out to learn how you can contribute.",
      href: null,
      cta: null,
    },
    {
      q: "Media & Press",
      a: "Media inquiries and press requests should be directed to our email. We are happy to share our story.",
      href: null,
      cta: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden court-lines border-b border-white/6 min-h-[340px] lg:min-h-[420px]">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />

        {/* Hero photo — desktop only */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-[48%] pointer-events-none">
          <Image
            src="/images/journey/after/hero-court.jpg"
            alt="Madina Basketball Court"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/55 to-[#0a0a0a]/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          {/* Location badge */}
          <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-black/60 border border-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
            <MapPin className="w-4 h-4 text-[#ff6b35] flex-shrink-0" />
            <div>
              <div className="text-white font-bold text-xs">Libya Quarters, Madina</div>
              <div className="text-white/50 text-[0.6rem]">Accra, Ghana</div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="max-w-xl">
            <span className="pill bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/30 mb-5 inline-flex">
              Get in Touch
            </span>
            <h1
              className="font-black uppercase leading-none mb-5"
              style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.04em" }}
            >
              CONTACT<br />
              <span className="text-[#ff6b35]">US</span>
            </h1>
            <p className="text-white/55 max-w-xl text-base leading-relaxed">
              Reach out for court bookings, player registration, partnerships, or anything else.
              We are a community organisation. We actually respond.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Reach Us</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Contact Methods</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* WhatsApp */}
            <a
              href="https://wa.me/233559602056"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300 flex flex-col"
            >
              <div className="w-11 h-11 bg-green-500/15 border border-green-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-white font-black text-sm uppercase tracking-tight mb-1">WhatsApp</h3>
              <p className="text-white/40 text-sm mb-4">Quick responses for bookings and enquiries</p>
              <p className="text-green-400 font-bold text-sm mt-auto">+233 55 960 2056</p>
            </a>

            {/* Email */}
            <a
              href="mailto:themadinacourt@gmail.com"
              className="group bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-[#ff6b35]/40 transition-all duration-300 flex flex-col"
            >
              <div className="w-11 h-11 bg-[#ff6b35]/10 border border-[#ff6b35]/25 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-[#ff6b35]" />
              </div>
              <h3 className="text-white font-black text-sm uppercase tracking-tight mb-1">Email</h3>
              <p className="text-white/40 text-sm mb-4">For detailed enquiries and partnerships</p>
              <p className="text-[#ff6b35] font-bold text-sm mt-auto break-all">themadinacourt@gmail.com</p>
            </a>

            {/* Location */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 flex flex-col">
              <div className="w-11 h-11 bg-[#004e89]/15 border border-[#004e89]/30 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-[#004e89]" />
              </div>
              <h3 className="text-white font-black text-sm uppercase tracking-tight mb-1">Location</h3>
              <p className="text-white/40 text-sm mb-4">Visit us at the court</p>
              <p className="text-white/70 font-semibold text-sm mt-auto">
                Libya Quarters, Madina<br />
                Accra, Ghana
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-2xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Message</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Send Us a Message</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Have a question or want to get involved? Use the form below. We read every message.
          </p>
          <div className="bg-[#111] border border-white/8 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-[#ff6b35]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-[#ff6b35]" />
            </div>
            <a
              href="https://forms.gle/MXoQwakyH3Axozh8A"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-lg hover:bg-[#e55a2b] transition-colors uppercase tracking-wider mb-4"
            >
              Open Contact Form <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-white/30 text-xs mt-3">
              Or email directly:{" "}
              <a href="mailto:themadinacourt@gmail.com" className="text-white/50 hover:text-[#ff6b35] transition-colors">
                themadinacourt@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── Social Media ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Social</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Follow Us</h2>
          <p className="text-white/40 text-xs mb-8 italic">
            Our social media accounts are being relaunched after account loss. New links will be updated soon.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://facebook.com/madinabasketball"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-blue-500/40 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-blue-600/20 border border-blue-600/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm uppercase tracking-tight">Facebook</h3>
                <p className="text-blue-400/70 text-xs mt-0.5">@madinabasketball</p>
                <p className="text-white/30 text-xs mt-1">Updates, events, and community news</p>
              </div>
            </a>
            <a
              href="https://instagram.com/madinabasketball"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-pink-500/40 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-pink-500/25 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm uppercase tracking-tight">Instagram</h3>
                <p className="text-pink-400/70 text-xs mt-0.5">@madinabasketball</p>
                <p className="text-white/30 text-xs mt-1">Photos, videos, and stories</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Common Questions</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Common Enquiries</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a, href, cta }) => (
              <div key={q} className="bg-[#111] border border-white/8 rounded-xl px-6 py-5">
                <h3 className="text-white font-black text-sm uppercase tracking-tight mb-2">{q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {a}{" "}
                  {href && cta && (
                    <Link href={href} className="text-[#ff6b35] font-bold hover:underline">
                      {cta} →
                    </Link>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Find Us</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Location</h2>
          <div className="rounded-2xl overflow-hidden border border-white/8" style={{ minHeight: 300 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.249890652173!2d-0.18554152476553573!3d5.6769715943046135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9deb5ca772db%3A0x40b7af9f253fbc39!2sMadina%20Zongo%20Sports%20Complex!5e0!3m2!1sen!2snl!4v1766677396637!5m2!1sen!2snl"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 300 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Madina Basketball Court Location"
            />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#ff6b35] flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Libya Quarters, Madina</p>
              <p className="text-white/40 text-xs">Accra, Ghana</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

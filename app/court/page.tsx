import { MapPin, Clock, CheckCircle, Ruler, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";

export default function Court() {
  const features = [
    { icon: Ruler,       title: "Functional Court",  text: "A fully playable court with markings: three-point line, free-throw line, and key. Falls short of FIBA full-standard dimensions but is very much functional for games. Upgrading to full size is a key goal." },
    { icon: CheckCircle, title: "Quality Rims",       text: "Professional-grade basketball rims installed at regulation height on both ends." },
    { icon: CheckCircle, title: "Renovated Surface",  text: "Resurfaced and ready for play. Proper grip, bounce, and colour-coded zones." },
    { icon: CheckCircle, title: "Clear Markings",     text: "Professional court markings freshly painted after renovation." },
    { icon: Users,       title: "Open to All",        text: "Accessible to players of all ages and levels. Open to the whole neighbourhood." },
    { icon: Clock,       title: "Maintained",         text: "Regular maintenance keeps the court in excellent condition for ongoing use and events." },
  ];

  const rules = [
    "Respect the court and other players. Keep the environment positive and inclusive.",
    "Book in advance for organised games, training sessions, or events.",
    "Pick-up games are welcome during non-booked hours on a first-come, first-served basis.",
    "Keep the court clean. Dispose of trash properly and report any issues.",
    "Use appropriate footwear and equipment.",
    "Schools and teams should contact us for special booking arrangements.",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/journey/after/hero-court.jpg"
            alt="Madina Basketball Court"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-transparent to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/70 via-transparent to-transparent" />
        </div>
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />
        <div className="relative container mx-auto px-6 lg:px-8 py-16 lg:py-28">
          <span className="pill bg-green-500/20 border border-green-500/40 text-green-300 mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Court Active
          </span>
          <h1
            className="font-black uppercase leading-none mb-5"
            style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.04em" }}
          >
            THE&nbsp;<span className="text-[#ff6b35]">COURT</span>
          </h1>
          <p className="text-white/55 max-w-lg text-base leading-relaxed">
            Renovated, professionally marked, and actively used for play.
            Libya Quarters, Madina.
          </p>
        </div>
      </section>

      {/* ── Status Banner ── */}
      <section className="bg-[#0d0d0d] border-b border-white/6 py-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-3xl">
            <div className="w-12 h-12 bg-green-500/15 border border-green-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white font-black uppercase tracking-tight">Court Status: Active</p>
              <p className="text-white/50 text-sm mt-0.5">
                Fully operational and ready for play. Renovated with proper surface treatment,
                markings, rims, and all infrastructure needed for regular games and events.
              </p>
            </div>
            <Link
              href="/book"
              className="flex-shrink-0 px-5 py-2.5 bg-[#ff6b35] text-white text-sm font-bold rounded-lg hover:bg-[#e55a2b] transition-colors uppercase tracking-wider"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Court Photos ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Gallery</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">The Facility</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { src: "/images/journey/after/court-painting.jpg",    alt: "Court renovation, painting in progress" },
              { src: "/images/journey/after/completed-evening.jpg", alt: "Completed court at evening" },
              { src: "/images/journey/after/hero-court.jpg",        alt: "Court main view" },
              { src: "/images/journey/after/hero-page.jpg",         alt: "Court overview" },
            ].map((img, i) => (
              <AnimateIn key={img.src} delay={i * 60}>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image src={img.src} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Facilities</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Court Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, text }, i) => (
              <AnimateIn key={title} delay={i * 70}>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-[#ff6b35]/30 transition-colors h-full">
                  <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#ff6b35]" />
                  </div>
                  <h3 className="text-white font-black uppercase text-sm tracking-tight mb-2">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{text}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Find Us</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Location</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#111] border border-white/8 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#ff6b35]" />
                </div>
                <h3 className="text-white font-black uppercase tracking-tight">Address</h3>
              </div>
              <p className="text-white text-lg font-semibold mb-1">Libya Quarters, Madina</p>
              <p className="text-white/50 mb-6">Accra, Ghana</p>
              <p className="text-white/50 text-sm leading-relaxed">
                Located in the heart of Libya Quarters, easily accessible to the Madina community
                and surrounding areas.
              </p>
              <div className="mt-6 pt-6 border-t border-white/8 flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#ff6b35]" />
                <p className="text-white/50 text-sm">Open throughout the week. Book ahead for organised sessions.</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/8" style={{ minHeight: 280 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.249890652173!2d-0.18554152476553573!3d5.6769715943046135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9deb5ca772db%3A0x40b7af9f253fbc39!2sMadina%20Zongo%20Sports%20Complex!5e0!3m2!1sen!2snl!4v1766677396637!5m2!1sen!2snl"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 280 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Madina Basketball Court Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Rules ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Guidelines</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Court Rules</h2>
          <ul className="space-y-4">
            {rules.map((rule, i) => (
              <AnimateIn key={i} delay={i * 50}>
                <li className="flex items-start gap-4 bg-[#111] border border-white/8 rounded-xl px-5 py-4">
                  <CheckCircle className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                  <span className="text-white/65 text-sm leading-relaxed">{rule}</span>
                </li>
              </AnimateIn>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/6 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Ready to play?</h2>
          <p className="text-white/45 max-w-md mx-auto mb-8 text-sm">
            Book the court for your game, training session, or event. Walk-ins welcome for pick-up.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/book" className="px-8 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-lg hover:bg-[#e55a2b] transition-colors uppercase tracking-wider">
              Book the Court
            </Link>
            <Link href="/contact" className="px-8 py-3 bg-white/8 border border-white/15 text-white font-bold text-sm rounded-lg hover:bg-white/15 transition-colors uppercase tracking-wider">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

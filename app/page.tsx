import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Calendar, Users, Trophy, CheckCircle,
  MapPin, Clock, Info, AlertTriangle,
  CheckCircle as CheckCircleIcon, Calendar as CalendarIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";
import HeroBackground from "@/components/HeroBackground";

/* ─── Data fetchers ───────────────────────────────────────────────── */

async function getAnnouncements() {
  try {
    const { data, error } = await supabase
      .from("announcements").select("*").eq("status", "active")
      .order("created_at", { ascending: false }).limit(5);
    if (error) return [];
    const now = new Date();
    return (data || []).filter(
      (a: any) => !a.expires_at || new Date(a.expires_at) > now
    );
  } catch { return []; }
}

async function getFeaturedEvent() {
  try {
    const { data, error } = await supabase
      .from("events").select("*")
      .eq("featured", true).eq("status", "upcoming")
      .order("date", { ascending: true }).limit(1).single();
    if (error) return null;
    const dt = new Date(`${data.date}T${data.time || "00:00"}`);
    if (dt < new Date()) {
      await supabase.from("events")
        .update({ status: "completed", featured: false }).eq("id", data.id);
      return null;
    }
    return data;
  } catch { return null; }
}

async function getUpcomingEvents() {
  try {
    const { data, error } = await supabase
      .from("events").select("*")
      .eq("status", "upcoming").eq("featured", false)
      .order("date", { ascending: true }).limit(3);
    if (error) return [];
    const now = new Date();
    const valid: any[] = [];
    for (const event of data || []) {
      const dt = new Date(`${event.date}T${event.time || "00:00"}`);
      if (dt < now) {
        await supabase.from("events").update({ status: "completed" }).eq("id", event.id);
      } else { valid.push(event); }
    }
    return valid;
  } catch { return []; }
}

/* ─── Announcement helpers ────────────────────────────────────────── */
function announcementIcon(type: string) {
  const map: Record<string, any> = {
    warning: AlertTriangle, success: CheckCircleIcon, event: CalendarIcon,
  };
  return map[type] ?? Info;
}
function announcementColors(type: string) {
  const map: Record<string, string> = {
    warning: "bg-yellow-900/60 border-yellow-600/50 text-yellow-100",
    success: "bg-green-900/60 border-green-600/50 text-green-100",
    event:   "bg-orange-900/60 border-orange-500/50 text-orange-100",
  };
  return map[type] ?? "bg-blue-900/60 border-blue-600/50 text-blue-100";
}

/* ─── Highlight clips for the reel ───────────────────────────────── */
const CLIPS = [
  { src: "/videos/highlights/compressed/launch-game-highlights-compressed.mp4",    label: "Launch Game Highlights" },
  { src: "/videos/highlights/compressed/nadir-killer-3pointer-compressed.mp4",     label: "Nadir's 3-Pointer" },
  { src: "/videos/highlights/compressed/brandon-coast-to-coast3p-compressed.mp4",  label: "Brandon Coast-to-Coast" },
  { src: "/videos/highlights/compressed/hafiz-putback-compressed.mp4",             label: "Hafiz Put-Back" },
  { src: "/videos/highlights/compressed/mustafa-drive-compressed.mp4",             label: "Mustafa's Drive" },
  { src: "/videos/highlights/compressed/launch-aerial-view-compressed.mp4",        label: "Aerial View" },
];

/* ─── Page ────────────────────────────────────────────────────────── */
export default async function Home() {
  const [announcements, featuredEvent, upcomingEvents] = await Promise.all([
    getAnnouncements(), getFeaturedEvent(), getUpcomingEvents(),
  ]);

  return (
    <div className="min-h-screen">

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
        {/* Video + overlay stack */}
        <div className="absolute inset-0">
          <HeroBackground />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/65 via-transparent to-transparent" />
        </div>
        {/* Court texture */}
        <div className="absolute inset-0 court-lines opacity-50 pointer-events-none" />
        {/* Orange left-edge accent */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-28">
          <div className="max-w-5xl">
            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="pill bg-green-500/20 border border-green-500/40 text-green-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
                Court Active
              </span>
              <span className="pill bg-white/10 border border-white/20 text-white/70">Est. June 2025</span>
              <span className="pill bg-[#ff6b35]/20 border border-[#ff6b35]/40 text-[#ff6b35]">Libya Quarters, Madina</span>
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(3.5rem,11vw,9rem)] font-black text-white uppercase tracking-[-0.04em] leading-[0.9] mb-6">
              MADINA<br />
              <span className="text-[#ff6b35]">BASKET</span>BALL
            </h1>

            <p className="text-lg sm:text-xl text-white/65 max-w-xl mb-10 font-medium leading-relaxed">
              Community-built. Community-run. Libya Quarters&apos; premier basketball court — home to pick-up games, training, and tournament rivalries.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#ff6b35] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-[#e55a2b] transition-all hover:scale-105 shadow-xl shadow-[#ff6b35]/25"
              >
                Register to Play <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/journey"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-white/20 transition-all"
              >
                Our Journey
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-10 text-white/35 text-sm">
              <MapPin className="w-4 h-4" />
              Libya Quarters, Madina, Accra, Ghana
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-35">
          <span className="text-white text-[0.55rem] font-bold tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/50" />
        </div>
      </section>

      {/* ══ ANNOUNCEMENTS ═════════════════════════════════════════════ */}
      {announcements.length > 0 && (
        <section className="py-8 bg-[#0d0d0d] border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-3">
              {announcements.map((a: any) => {
                const Icon = announcementIcon(a.type);
                return (
                  <div key={a.id} className={`flex items-start gap-3 p-4 rounded-xl border ${announcementColors(a.type)}`}>
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      {a.title && <p className="font-bold text-sm mb-0.5">{a.title}</p>}
                      <p className="text-sm opacity-90">{a.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ STATS BAR ════════════════════════════════════════════════ */}
      <section className="bg-[#111] border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { value: "150+",      label: "Active Players",  sub: "and growing" },
              { value: "GHS 44.7K", label: "Community Raised", sub: "100% transparent" },
              { value: "12+",       label: "Events Hosted",   sub: "since June 2025" },
            ].map(({ value, label, sub }) => (
              <div key={label} className="py-10 px-4 text-center group cursor-default">
                <div className="stat-number text-white group-hover:text-[#ff6b35] transition-colors duration-300">{value}</div>
                <div className="text-white/50 font-bold uppercase text-[0.62rem] tracking-widest mt-2">{label}</div>
                <div className="text-white/25 text-xs mt-1">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HIGHLIGHTS REEL ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#0d0d0d] court-lines relative overflow-hidden">
        <span className="watermark text-white bottom-0 right-0">HOOPS</span>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-2">On the Court</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white uppercase">Highlights Reel</h2>
            </div>
            <Link
              href="/media"
              className="inline-flex items-center gap-2 text-white/45 hover:text-[#ff6b35] text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 6-clip responsive grid — first clip is taller on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {CLIPS.map(({ src, label }, i) => (
              <div
                key={src}
                className={`video-card rounded-xl relative overflow-hidden ${i === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}
                style={{ aspectRatio: i === 0 ? "4/5" : "16/9" }}
              >
                <video
                  autoPlay loop muted playsInline preload="none"
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={src} type="video/mp4" />
                </video>
                <div className="video-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED EVENT (conditional) ═════════════════════════════ */}
      {featuredEvent && (
        <section className="py-20 bg-gradient-to-br from-[#004e89] to-[#003060] text-white relative overflow-hidden">
          <div className="absolute inset-0 court-lines opacity-40" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#ffd23f]" />
                </div>
                <div>
                  <p className="text-[#ffd23f] font-bold text-xs uppercase tracking-widest">Featured Event</p>
                  <h2 className="text-3xl font-black uppercase">Don&apos;t Miss It</h2>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/15">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {featuredEvent.image_url && (
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <Image src={featuredEvent.image_url} alt={featuredEvent.title} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="pill bg-white/20 text-white border border-white/20">{featuredEvent.type}</span>
                      <span className="pill bg-green-500 text-white">Upcoming</span>
                    </div>
                    <h3 className="text-3xl font-black mb-4">{featuredEvent.title}</h3>
                    {featuredEvent.description && (
                      <p className="text-white/75 mb-5 leading-relaxed">{featuredEvent.description}</p>
                    )}
                    <div className="space-y-2.5 text-sm text-white/75">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-[#ffd23f]" />
                        {new Date(featuredEvent.date).toLocaleDateString("en-GB", {
                          weekday: "long", day: "numeric", month: "long", year: "numeric",
                        })}
                      </div>
                      {featuredEvent.time && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-[#ffd23f]" /> {featuredEvent.time}
                        </div>
                      )}
                      {featuredEvent.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-[#ffd23f]" /> {featuredEvent.location}
                        </div>
                      )}
                      {featuredEvent.teams && (
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-[#ffd23f]" />
                          <span className="font-semibold">{featuredEvent.teams}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ UPCOMING EVENTS (conditional) ════════════════════════════ */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-[#f5f5f5]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                  <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-2">Mark Your Calendar</p>
                  <h2 className="text-4xl font-black text-gray-900 uppercase">Upcoming Events</h2>
                </div>
                <div className="w-10 h-10 bg-[#ff6b35] rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event: any) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ COURT STORY ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-white relative overflow-hidden">
        <span className="watermark text-gray-900 -bottom-8 -left-8">COURT</span>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Our Mission</p>
              <h2 className="text-5xl sm:text-6xl font-black text-gray-900 uppercase mb-5">
                Basketball<br />for Everyone
              </h2>
              <div className="w-12 h-1 bg-[#ff6b35] rounded-full mb-7" />
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                The Madina Basketball court is a thriving hub for players of all levels — from daily pick-up games and youth training sessions to competitive inter-community tournaments.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Home to Zurak Basketball and Madina Old Gees, built by 18 community donors and managed with full financial transparency.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {[
                  { icon: Users,       label: "150+ Registered Players" },
                  { icon: Trophy,      label: "2 Active Competing Teams" },
                  { icon: CheckCircle, label: "100% Community-Built & Funded" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-gray-700 text-sm font-semibold">
                    <div className="w-8 h-8 bg-[#ff6b35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#ff6b35]" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 text-[#ff6b35] font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
              >
                Read Our Full Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/journey/after/hero-court.jpg"
                  alt="Madina Basketball Court" fill
                  className="object-cover" unoptimized
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-[#ff6b35] text-white rounded-2xl p-5 shadow-xl">
                <div className="text-3xl font-black">2025</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Active &amp; Growing</div>
              </div>
              <div className="absolute -top-5 -right-5 w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl hidden sm:block">
                <Image
                  src="/images/events/launch-day/courtsidemadinafans.jpg"
                  alt="Fans courtside" fill className="object-cover" unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ GET INVOLVED ══════════════════════════════════════════════ */}
      <section className="py-20 bg-[#0d0d0d] court-lines">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-2">Join Us</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white uppercase">Get Involved</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Users,    title: "Register to Play",
                  desc: "Join 150+ players. Sign up for pick-up games, training sessions, and community tournaments.",
                  href: "/register", cta: "Register Now",
                  from: "from-[#ff6b35]/10", border: "border-[#ff6b35]/20",
                },
                {
                  icon: Calendar, title: "Book the Court",
                  desc: "Reserve the court for your team, school, or event during operating hours.",
                  href: "/book", cta: "Book Now",
                  from: "from-[#004e89]/10", border: "border-[#004e89]/30",
                },
                {
                  icon: Trophy,   title: "Our Story",
                  desc: "See how 18 donors raised GHS 44,750 to build this court from the ground up.",
                  href: "/journey", cta: "Read Journey",
                  from: "from-[#ffd23f]/10", border: "border-[#ffd23f]/20",
                },
              ].map(({ icon: Icon, title, desc, href, cta, from, border }) => (
                <div
                  key={title}
                  className={`group relative bg-gradient-to-br ${from} to-transparent border ${border} rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="w-12 h-12 bg-white/8 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#ff6b35]/20 transition-colors">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase mb-3">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">{desc}</p>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest hover:text-[#ff6b35] transition-colors"
                  >
                    {cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════════ */}
      <section className="relative py-28 bg-[#ff6b35] overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/journey/after/hero-court-daytime-aerial.jpg"
            alt="" fill className="object-cover" unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b35]/50 to-[#ff6b35]" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-7xl font-black text-white uppercase leading-none mb-6">
            Ready to Ball?
          </h2>
          <p className="text-xl text-white/80 max-w-xl mx-auto mb-10 font-medium">
            The court is open. The community is here. Come be part of something real.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/court"
              className="px-8 py-4 bg-white text-[#ff6b35] font-black text-sm uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl"
            >
              Visit the Court
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0a0a0a] text-white font-black text-sm uppercase tracking-wider rounded-xl hover:bg-black transition-all hover:scale-105 shadow-2xl"
            >
              Join Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

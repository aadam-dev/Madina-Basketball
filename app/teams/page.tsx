import { Users, Trophy, Calendar, Target, ArrowRight, Video, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Teams() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden court-lines border-b border-white/6 min-h-[340px] lg:min-h-[420px]">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />

        {/* Hero photo — desktop only */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-[48%] pointer-events-none">
          <Image
            src="/images/events/launch-day/courtsidemadinafans.jpg"
            alt="Fans courtside at Madina Basketball"
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/55 to-[#0a0a0a]/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          {/* Floating stat */}
          <div className="absolute bottom-8 right-8 bg-black/60 border border-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-right">
            <div className="text-white font-black text-xl">200+</div>
            <div className="text-white/50 text-[0.6rem] uppercase tracking-widest font-bold">Courtside Spectators</div>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="max-w-xl">
            <span className="pill bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/30 mb-5 inline-flex">
              Our Teams
            </span>
            <h1
              className="font-black uppercase leading-none mb-5"
              style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.04em" }}
            >
              TEAMS &amp;<br />
              <span className="text-[#ff6b35]">COMMUNITY</span>
            </h1>
            <p className="text-white/55 max-w-xl text-base leading-relaxed">
              Building a basketball community through teams, programmes, and social impact.
              Libya Quarters, Madina — Accra, Ghana.
            </p>
          </div>
        </div>
      </section>

      {/* ── Madina Basketball Hub ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Community Hub</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-6 orange-rule">Madina Basketball</h2>
          <p className="text-white/60 leading-relaxed mb-6">
            Madina Basketball serves as the umbrella for all basketball and social/impact-related
            initiatives in Madina, coordinating and supporting every team, programme, and event
            on the court.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Basketball teams and programmes (Zurak, Old Gees, and future teams)",
              "Youth development and training initiatives",
              "Community events and tournaments",
              "Social impact programmes and community engagement",
              "Court management and maintenance",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#111] border border-white/8 rounded-xl px-4 py-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] mt-2 flex-shrink-0" />
                <span className="text-white/65 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Saturday Rivalry ── */}
      <section className="py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="relative bg-[#111] border border-white/8 rounded-3xl p-8 md:p-12 overflow-hidden max-w-5xl mx-auto">
            {/* Decorative glows */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#ff6b35]/8 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#004e89]/8 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

            <div className="relative">
              <span className="pill bg-white/6 border border-white/10 text-white/50 text-[0.65rem] mb-6 mx-auto inline-flex">
                Every Saturday Tradition
              </span>

              <div className="text-center mb-10">
                <h2
                  className="font-black uppercase leading-none mb-4"
                  style={{ fontSize: "clamp(2.2rem,7vw,5rem)", letterSpacing: "-0.04em" }}
                >
                  <span className="text-[#ff6b35]">OLD GEES</span>
                  <span className="text-white/20 mx-3 text-3xl align-middle">VS</span>
                  <span className="text-[#004e89]">YOUNGINS</span>
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto text-base leading-relaxed">
                  Experience meets energy. Wisdom meets speed. The most anticipated recurring matchup at Madina Basketball.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { value: "8+",    label: "Games Played",    color: "#ff6b35" },
                  { value: "EVEN",  label: "Win Record",      color: "white" },
                  { value: "200+",  label: "Spectators",      color: "#004e89" },
                ].map(({ value, label, color }) => (
                  <div key={label} className="bg-[#0a0a0a]/80 border border-white/8 rounded-2xl py-6 text-center">
                    <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
                    <div className="text-white/35 text-[0.6rem] font-bold uppercase tracking-widest">{label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: Target, title: "Competitive Fire", text: "Every possession matters. Community pride is on the line." },
                  { icon: Users,  title: "Community Spirit", text: "Brings generations together in a shared celebration of hoops." },
                  { icon: Trophy, title: "Pure Basketball",  text: "No frills, just great energy and unforgettable moments." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex flex-col items-center text-center">
                    <div className="w-11 h-11 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-[#ff6b35]" />
                    </div>
                    <h4 className="text-white font-black text-sm uppercase tracking-tight mb-1">{title}</h4>
                    <p className="text-white/45 text-sm">{text}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/media"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-xl hover:bg-[#e55a2b] transition-colors uppercase tracking-wider"
                >
                  <Video className="w-4 h-4" />
                  Watch Rivalry Highlights
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Teams ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Meet the Rivals</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">The Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">

            {/* Zurak — The Youngins */}
            <div className="group bg-[#111] border border-white/8 rounded-2xl p-8 hover:border-[#004e89]/50 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#004e89]/15 border border-[#004e89]/25 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-[#004e89]" />
              </div>
              <div className="text-[#004e89] font-black text-xs uppercase tracking-widest mb-2">The Youngins</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Zurak Basketball</h3>
              <p className="text-white/50 leading-relaxed text-sm mb-5">
                The next generation of Madina Basketball. Bringing relentless energy,
                athleticism, and creativity to the court every Saturday.
              </p>
              <p className="text-[#004e89] font-bold text-xs italic">"Speed and fire define our game."</p>
            </div>

            {/* Madina Old Gees */}
            <div className="group bg-[#111] border border-white/8 rounded-2xl p-8 hover:border-[#ff6b35]/50 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#ff6b35]/10 border border-[#ff6b35]/25 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <div className="text-[#ff6b35] font-black text-xs uppercase tracking-widest mb-2">The Old Gees</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Madina Old Gees</h3>
              <p className="text-white/50 leading-relaxed text-sm mb-5">
                The backbone of the court, bringing decades of experience and wisdom.
                Proving that strategy often trumps raw speed.
              </p>
              <p className="text-[#ff6b35] font-bold text-xs italic">"Experience is our greatest asset."</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Events ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Calendar</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Key Events</h2>
          <div className="space-y-4">

            {/* Night of Legends */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-[#ff6b35]/30 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.2em] mb-1.5">December 27, 2025</div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Night of Legends</h3>
                  <p className="text-white/40 text-sm mt-0.5">Madina Old Gees vs Oyibi Eagles</p>
                </div>
                <span className="flex-shrink-0 px-3 py-1 bg-white/8 border border-white/10 text-white/40 text-xs font-bold rounded-full uppercase tracking-wide">
                  Completed
                </span>
              </div>
              <p className="text-white/55 text-sm leading-relaxed mb-4">
                The Night of Legends showcased community basketball at its finest, bringing
                together players and fans from across the region in an annual celebration of the game.
              </p>
              <Link
                href="/media"
                className="inline-flex items-center gap-1.5 text-[#ff6b35] text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all"
              >
                Watch Highlights <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Eid Ball */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-[#ffd23f]/30 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-[#ffd23f] font-bold text-xs uppercase tracking-[0.2em] mb-1.5">Planning Phase</div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Eid Ball</h3>
                  <p className="text-white/40 text-sm mt-0.5">Annual tournament during Eid celebrations</p>
                </div>
                <span className="flex-shrink-0 px-3 py-1 bg-[#ffd23f]/10 border border-[#ffd23f]/30 text-[#ffd23f] text-xs font-bold rounded-full uppercase tracking-wide">
                  Planning
                </span>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">
                The Eid Ball combines basketball competition with cultural celebration —
                a highlight of the community calendar bringing together players from across Madina.
                Details for the upcoming edition will be announced as planning progresses.
              </p>
            </div>

            {/* Opening Game */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-[#004e89]/30 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-[#004e89] font-bold text-xs uppercase tracking-[0.2em] mb-1.5">June 22, 2025</div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Opening Ceremony Game</h3>
                  <p className="text-white/40 text-sm mt-0.5">Madina vs Kawukudi</p>
                </div>
                <span className="flex-shrink-0 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded-full uppercase tracking-wide">
                  Historic
                </span>
              </div>
              <p className="text-white/55 text-sm leading-relaxed mb-4">
                The official opening of the renovated court marked a new era for basketball in Madina.
                This historic match brought the community together to celebrate what they built.
              </p>
              <Link
                href="/media"
                className="inline-flex items-center gap-1.5 text-[#004e89] text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all"
              >
                View Photos &amp; Videos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/6 py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Join a Team</h2>
          <p className="text-white/45 max-w-md mx-auto mb-8 text-sm">
            Interested in joining one of our teams or starting a new one? Register to play or get in touch.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-lg hover:bg-[#e55a2b] transition-colors uppercase tracking-wider"
            >
              Register to Play
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-white/8 border border-white/15 text-white font-bold text-sm rounded-lg hover:bg-white/15 transition-colors uppercase tracking-wider"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

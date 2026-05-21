import { Target, Heart, Users, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden court-lines border-b border-white/6">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <span className="pill bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/30 mb-5 inline-flex">
            About Us
          </span>
          <h1
            className="font-black uppercase leading-none mb-5"
            style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.04em" }}
          >
            MORE THAN<br />
            <span className="text-[#ff6b35]">A COURT</span>
          </h1>
          <p className="text-white/55 max-w-xl text-base leading-relaxed">
            A community-driven basketball hub serving Libya Quarters, Madina — and beyond.
          </p>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">What We Do</p>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 orange-rule">
                Community on the hardwood
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  The Madina Basketball court is more than just a place to play — it is a thriving
                  community hub where players of all ages and skill levels come together. We host
                  daily pick-up games, structured training sessions, competitive tournaments, and
                  community events that bring the neighbourhood together.
                </p>
                <p>
                  Home to teams like Zurak Basketball and Madina Old Gees, the court serves as the
                  foundation for youth development, competitive play, and community building. Our
                  training programmes are active and growing — developing skills, character, and
                  community bonds every week.
                </p>
                <p>
                  Madina Basketball continues to expand this work, combining basketball with broader
                  social impact initiatives across Madina. Every commitment we made has been fulfilled.
                </p>
              </div>
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 mt-8 text-[#ff6b35] font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
              >
                Read the full story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/journey/after/hero-court.jpg"
                alt="Madina Basketball Court"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/60 to-transparent" />
              <div className="absolute bottom-4 left-4 pill bg-[#ff6b35] text-white text-[0.6rem]">
                Libya Quarters · Accra
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Started ── */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden order-2 lg:order-1">
              <Image
                src="/images/journey/before/abandoned-court.jpg"
                alt="Before — abandoned court"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 pill bg-black/60 text-white/70 border border-white/15 text-[0.6rem] backdrop-blur-sm">
                Before — 2024
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Origin Story</p>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 orange-rule">
                How it started
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Madina has always had a passionate basketball community, but lacked proper
                  infrastructure. When community leaders <strong className="text-white">Shafic and Adam</strong> saw
                  the deteriorating Libya Quarters court, they mobilised the community to transform it.
                </p>
                <p>
                  Through transparent fundraising — <strong className="text-white">GHS 44,750 from 18 donors</strong> —
                  professional planning, and community oversight, the court was renovated and officially
                  launched in June 2025. This grassroots effort proved what is possible when a community
                  unites around a shared vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Basketball Matters ── */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Impact</p>
            <h2 className="text-3xl font-black uppercase tracking-tight">Why Basketball Matters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Users, label: "Youth Development",
                text: "Basketball teaches discipline, teamwork, and resilience. It provides a positive outlet for energy and a pathway to personal growth.",
              },
              {
                icon: Heart, label: "Inclusion",
                text: "The court welcomes everyone — girls, boys, beginners, and experienced players. Basketball is a sport for all.",
              },
              {
                icon: Target, label: "Community Cohesion",
                text: "The court brings people together. It is a place where neighbours meet, friendships form, and community bonds strengthen.",
              },
              {
                icon: Shield, label: "Safe Space",
                text: "A well-maintained court provides a safe, structured environment for youth to play, learn, and grow.",
              },
            ].map(({ icon: Icon, label, text }) => (
              <div key={label} className="bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-[#ff6b35]/30 transition-colors">
                <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#ff6b35]" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-tight mb-2">{label}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 border-t border-white/6">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Foundation</p>
            <h2 className="text-3xl font-black uppercase tracking-tight">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: "🔍", title: "Transparency", text: "Every step, every decision, every cedi is documented and shared. Trust is built through openness." },
              { emoji: "👥", title: "Ownership",    text: "This is the community's court. Built by the community, maintained by the community, enjoyed by the community." },
              { emoji: "🚪", title: "Access",       text: "The court is open to all. No barriers, no exclusions. Basketball is for everyone." },
            ].map(({ emoji, title, text }) => (
              <div key={title} className="text-center bg-[#111] border border-white/8 rounded-2xl p-8">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="text-white font-black uppercase text-sm tracking-tight mb-3">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

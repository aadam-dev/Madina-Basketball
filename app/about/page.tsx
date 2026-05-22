import { Target, Heart, Users, Shield, ArrowRight, Eye, Home, Unlock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/AnimateIn";

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden court-lines border-b border-white/6 min-h-[340px] lg:min-h-[420px]">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />

        {/* Hero photo — desktop only */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-[48%] pointer-events-none">
          <Image
            src="/images/events/launch-day/launch-game-action-shot-01.jpg"
            alt="Game action at Madina Basketball"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/55 to-[#0a0a0a]/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          {/* Floating stat */}
          <div className="absolute bottom-8 right-8 bg-black/60 border border-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-right">
            <div className="text-[#ff6b35] font-black text-xl">150+</div>
            <div className="text-white/50 text-[0.6rem] uppercase tracking-widest font-bold">Players Registered</div>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="max-w-xl">
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
              A community basketball hub rooted in Libya Quarters, Madina.
            </p>
          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <AnimateIn from="left">
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">What We Do</p>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 orange-rule">
                Community on the hardwood
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Madina Basketball is a court, a programme, and a community. Players of all ages and
                  skill levels come together for daily pick-up games, structured training sessions,
                  competitive tournaments, and events that bring the neighbourhood out.
                </p>
                <p>
                  Home to Zurak Basketball and Madina Old Gees, the court is the foundation for youth
                  development, competitive play, and everything in between. Training is active and growing
                  every week.
                </p>
                <p>
                  Madina Basketball continues to expand this work. Every commitment made has been fulfilled.
                </p>
              </div>
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 mt-8 text-[#ff6b35] font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
              >
                Read the full story <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimateIn>
            <AnimateIn from="right">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/journey/after/hero-court.jpg"
                  alt="Madina Basketball Court"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/60 to-transparent" />
                <div className="absolute bottom-4 left-4 pill bg-[#ff6b35] text-white text-[0.6rem]">
                  Libya Quarters, Accra
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── How It Started ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimateIn from="left" className="relative aspect-[4/3] rounded-2xl overflow-hidden order-2 lg:order-1">
              <Image
                src="/images/journey/before/abandoned-court.jpg"
                alt="The court before renovation, 2024"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 pill bg-black/60 text-white/70 border border-white/15 text-[0.6rem] backdrop-blur-sm">
                Before, 2024
              </div>
            </AnimateIn>
            <AnimateIn from="right" className="order-1 lg:order-2">
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Origin</p>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 orange-rule">
                How it started
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Madina has always had a basketball community. What it lacked was infrastructure.
                  When <strong className="text-white">Shafic and Adam</strong> saw the state of the Libya
                  Quarters court, they mobilised the community to fix it.
                </p>
                <p>
                  Through transparent fundraising, <strong className="text-white">GHS 44,750 from 18 donors</strong>,
                  professional planning, and community oversight, the court was renovated and officially
                  launched in June 2025.
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Why Basketball Matters ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Impact</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">Why Basketball Matters</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Users, label: "Youth Development",
                text: "Basketball sharpens discipline, teamwork, and resilience. It gives young players a competitive arena to grow in.",
              },
              {
                icon: Heart, label: "Open to All",
                text: "The court is for everyone: girls, boys, beginners, veterans. No barriers, no tryouts.",
              },
              {
                icon: Target, label: "Togetherness",
                text: "The court draws people out. Neighbours meet, rivals become teammates, and the community gets stronger.",
              },
              {
                icon: Shield, label: "Structured Play",
                text: "A maintained, well-run court gives youth a structured environment to develop on and off the court.",
              },
            ].map(({ icon: Icon, label, text }, i) => (
              <AnimateIn key={label} delay={i * 80}>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-[#ff6b35]/30 transition-colors h-full">
                  <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#ff6b35]" />
                  </div>
                  <h3 className="text-white font-black uppercase text-sm tracking-tight mb-2">{label}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{text}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-12 sm:py-16 lg:py-20 border-t border-white/6">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Foundation</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">Our Values</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Eye,    title: "Transparency", text: "Every step, every decision, every cedi is documented and shared. Trust is built through openness." },
              { icon: Home,   title: "Ownership",    text: "This is the community's court. Built, maintained, and enjoyed by the people of Madina." },
              { icon: Unlock, title: "Access",       text: "No barriers, no exclusions. The court is open to all." },
            ].map(({ icon: Icon, title, text }, i) => (
              <AnimateIn key={title} delay={i * 100}>
                <div className="text-center bg-[#111] border border-white/8 rounded-2xl p-8 hover:border-[#ff6b35]/25 transition-colors h-full">
                  <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-[#ff6b35]" />
                  </div>
                  <h3 className="text-white font-black uppercase text-sm tracking-tight mb-3">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{text}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

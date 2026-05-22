import { Calendar, Users, Target, Trophy, Heart, Clock, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/AnimateIn";


export default function Training() {
  const focus = [
    { icon: Target,   title: "Youth Development",  text: "Developing young players through structured training, mentorship, and accountability." },
    { icon: Heart,    title: "Open to All",         text: "Girls, boys, beginners, experienced players. No tryouts, no barriers." },
    { icon: Users,    title: "Real Connections",    text: "Training sessions build more than skill. They build friendships that last." },
    { icon: Trophy,   title: "Skill Development",   text: "Progressive programmes moving players from fundamentals through to competitive play." },
    { icon: Star,     title: "Character",           text: "Discipline, respect, teamwork, resilience. Values that live off the court too." },
    { icon: Calendar, title: "Consistent Sessions", text: "Weekly training keeps players sharp, engaged, and improving over time." },
  ];

  const events = [
    {
      title: "Eid Games",
      icon: Trophy,
      text: "Annual tournament held during Eid celebrations. Competitive games, community gathering, and cultural celebration combined.",
      sub: "Basketball meets culture.",
    },
    {
      title: "Night of Legends",
      icon: Star,
      text: "Every December 27th, the Madina Old Gees take on a visiting community team in competitive games followed by a community feast.",
      sub: "Veterans, rivalries, community.",
    },
    {
      title: "Community Tournaments",
      icon: Calendar,
      text: "Regular tournaments giving players of all levels a structured competitive environment and something to play towards.",
      sub: "Competitive play. Community spirit.",
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
            src="/images/events/launch-day/rebound-hustle.jpg"
            alt="Training session at Madina Basketball"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/55 to-[#0a0a0a]/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          {/* Floating badge */}
          <div className="absolute top-8 right-8 flex items-center gap-2 bg-green-500/20 border border-green-500/40 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-300 text-xs font-bold uppercase tracking-wider">Weekly Sessions Active</span>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="max-w-xl">
            <span className="pill bg-green-500/20 border border-green-500/40 text-green-300 mb-5 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Training Active
            </span>
            <h1
              className="font-black uppercase leading-none mb-5"
              style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.04em" }}
            >
              TRAINING &amp;<br />
              <span className="text-[#ff6b35]">PROGRAMS</span>
            </h1>
            <p className="text-white/55 max-w-xl text-base leading-relaxed">
              Weekly sessions. All levels welcome. Building players and community on the same court.
            </p>
          </div>
        </div>
      </section>

      {/* ── Training Sessions ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <AnimateIn from="left">
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Weekly Training</p>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6 orange-rule">Sessions Now Running</h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Training is in full action. Regular weekly sessions develop skill, build character,
                and grow the Madina Basketball community. Open to all ages and levels.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#111] border border-white/8 rounded-xl p-5">
                  <Clock className="w-5 h-5 text-[#ff6b35] mb-3" />
                  <p className="text-white font-bold text-sm mb-1">Schedule</p>
                  <p className="text-white/50 text-sm">Weekly sessions on scheduled days. Check social media or contact us for the current timetable.</p>
                </div>
                <div className="bg-[#111] border border-white/8 rounded-xl p-5">
                  <Users className="w-5 h-5 text-[#ff6b35] mb-3" />
                  <p className="text-white font-bold text-sm mb-1">Who Can Join</p>
                  <p className="text-white/50 text-sm">Open to all community members. Beginners welcome. No prior experience required.</p>
                </div>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-lg hover:bg-[#e55a2b] transition-colors uppercase tracking-wider"
              >
                Register to Join <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimateIn>
            <AnimateIn from="right">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/events/launch-day/rebound-hustle.jpg"
                  alt="Training session on court"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/60 to-transparent" />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Focus Areas ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">What We Develop</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Programme Focus</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {focus.map(({ icon: Icon, title, text }, i) => (
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

      {/* ── Annual Events ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Calendar</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Annual Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map(({ title, icon: Icon, text, sub }, i) => (
              <AnimateIn key={title} delay={i * 90}>
                <div className="bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-[#ff6b35]/30 transition-colors h-full">
                  <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#ff6b35]" />
                  </div>
                  <h3 className="text-white font-black uppercase tracking-tight text-lg mb-3">{title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed mb-4">{text}</p>
                  <p className="text-[#ff6b35] text-xs font-bold uppercase tracking-wider">{sub}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coaching ── */}
      <section className="py-12 sm:py-16 lg:py-20 border-t border-white/6">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Staff</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-6 orange-rule">Coaching</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Our training programmes are run by volunteer coaches who care about basketball and the
            community. They give their time to help players improve, and it shows.
          </p>
          <p className="text-white/60 leading-relaxed mb-8">
            We are always looking for additional coaches. If you have basketball experience and want
            to give back, get in touch.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/8 border border-white/15 text-white font-bold text-sm rounded-lg hover:bg-white/15 transition-colors uppercase tracking-wider"
          >
            Enquire About Coaching <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#ff6b35] py-14">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">Join Our Programmes</h2>
          <p className="text-white/80 max-w-md mx-auto mb-8 text-sm">
            Beginner or veteran, there is a place for you in our training programmes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="px-8 py-3 bg-white text-[#ff6b35] font-bold text-sm rounded-lg hover:bg-white/90 transition-colors uppercase tracking-wider">
              Register to Play
            </Link>
            <Link href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold text-sm rounded-lg hover:bg-white/15 transition-colors uppercase tracking-wider">
              Get More Info
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

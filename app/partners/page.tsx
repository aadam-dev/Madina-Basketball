import { Heart, Handshake, Users, Trophy, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Partners() {
  const namedDonors = [
    "Abdul Ashraf", "Abena Ampomah", "Ahmed Rufahi", "Anthony", "Asante",
    "Bernice Ackah", "Borley Djenge", "Edmund Kombat", "Francis Boye",
    "Godfred Nipa", "Haruna Kofi Annan", "Idriss Abass", "Justice Kodzo",
    "Kodjokuma", "Nana Kofi Quakyi", "Rashid Musah",
  ].sort((a, b) => a.localeCompare(b));

  const donors = [...namedDonors, "Two Anonymous Donors"];

  const opportunities = [
    { icon: Trophy,     title: "Sponsorship",         text: "Sponsor tournaments, training programmes, or court maintenance. Visibility and community engagement included." },
    { icon: Handshake,  title: "Programme Partnerships", text: "Partner on youth development, coaching initiatives, or community events that drive real impact." },
    { icon: Users,      title: "Equipment & Materials", text: "Support through equipment donations, materials, or services that maintain and improve the court." },
    { icon: Heart,      title: "Volunteer Support",   text: "Organisations can contribute through volunteer programmes, coaching, or administrative assistance." },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden court-lines border-b border-white/6">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <span className="pill bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/30 mb-5 inline-flex">
            Partners &amp; Supporters
          </span>
          <h1
            className="font-black uppercase leading-none mb-5"
            style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.04em" }}
          >
            BUILT BY<br />
            <span className="text-[#ff6b35]">COMMUNITY</span>
          </h1>
          <p className="text-white/55 max-w-xl text-base leading-relaxed">
            Thank you to every donor, volunteer, and believer who made the Madina Basketball
            court a reality. This court belongs to you.
          </p>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="py-16 bg-[#0d0d0d] border-b border-white/6">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-white/60 leading-relaxed text-base mb-4">
            The renovation was funded entirely by
            <strong className="text-white"> 18 donors</strong> who raised
            <strong className="text-white"> GHS 44,750</strong>. Every contribution counted.
          </p>
          <p className="text-white/60 leading-relaxed text-base">
            This court belongs to the community. These names are on it.
          </p>
        </div>
      </section>

      {/* ── Donors ── */}
      <section id="donors" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#ff6b35]" />
            </div>
            <div>
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em]">Hall of Thanks</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">Our Donors</h2>
            </div>
          </div>

          {/* Donor grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
            {donors.map((donor, i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/8 rounded-xl px-4 py-3 text-center hover:border-[#ff6b35]/40 transition-colors"
              >
                <p className="text-white/80 text-sm font-semibold">{donor}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 bg-[#111] border border-white/8 rounded-2xl divide-x divide-white/8 overflow-hidden">
            {[
              { value: "18",          label: "Total Donors" },
              { value: "GHS 44,750",  label: "Total Raised" },
              { value: "100%",        label: "Community Funded" },
            ].map(({ value, label }) => (
              <div key={label} className="py-8 text-center">
                <div className="stat-number text-[#ff6b35]">{value}</div>
                <div className="text-white/40 font-bold uppercase text-[0.6rem] tracking-widest mt-2">{label}</div>
              </div>
            ))}
          </div>

          <p className="text-white/30 text-xs text-center mt-4">
            Donors listed alphabetically. Every contribution, regardless of amount, is equally valued.
          </p>
          <div className="text-center mt-4">
            <Link
              href="/transparency"
              className="inline-flex items-center gap-1.5 text-[#ff6b35] text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all"
            >
              View Full Transparency Report <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Volunteer Contributors ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Beyond Money</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-6 orange-rule">Volunteer Contributors</h2>
          <p className="text-white/60 leading-relaxed mb-6">
            Beyond financial contributions, many community members gave their time and expertise to make this
            project a success: engineers, organisers, volunteers, and everyone who spread the word.
          </p>
          <ul className="space-y-3">
            {[
              "Engineering professionals who provided site assessment and BOQ preparation",
              "Community organisers who coordinated fundraising and communication",
              "Volunteers who helped with project oversight and documentation",
              "Community members who spread awareness and encouraged participation",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 bg-[#111] border border-white/8 rounded-xl px-5 py-4">
                <CheckCircle className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Partnership Opportunities ── */}
      <section id="sponsors" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Get Involved</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Partnership Opportunities</h2>
          <p className="text-white/50 max-w-xl mb-10 text-sm">
            We are actively seeking sponsors and partners to support our growing programmes and community impact.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {opportunities.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-[#ff6b35]/30 transition-colors">
                <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#ff6b35]" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-tight mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Why partner */}
          <div className="bg-[#111] border border-white/8 rounded-2xl p-8">
            <h3 className="text-xl font-black uppercase tracking-tight mb-6 text-center">Why Partner With Us?</h3>
            <div className="grid grid-cols-3 divide-x divide-white/8 mb-6">
              {[
                { value: "100%", label: "Transparency",       sub: "Complete financial openness" },
                { value: "Active", label: "Programmes",       sub: "Training in full action" },
                { value: "150+",  label: "Players",           sub: "Registered community" },
              ].map(({ value, label, sub }) => (
                <div key={label} className="text-center px-4 py-4">
                  <div className="text-[#ff6b35] font-black text-2xl">{value}</div>
                  <div className="text-white/60 font-bold text-xs uppercase tracking-wider mt-1">{label}</div>
                  <div className="text-white/30 text-xs mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
            <p className="text-white/55 text-sm leading-relaxed text-center mb-6">
              We have proven our ability to deliver. The renovation was completed on time and on budget,
              and our training programmes are in full swing. Partner with a transparent, active organisation.
            </p>
            <div className="text-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-lg hover:bg-[#e55a2b] transition-colors uppercase tracking-wider"
              >
                Become a Sponsor <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Thank You ── */}
      <section className="border-t border-white/6 py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl">
          <div className="w-14 h-14 bg-[#ff6b35]/10 border border-[#ff6b35]/25 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-7 h-7 text-[#ff6b35]" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Thank You</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            To every donor, volunteer, and community member who backed this project: this court exists
            because of you. Your trust and your contributions made it real.
          </p>
          <p className="text-white/35 text-sm">
            This was not just a court renovation. It was proof of what a community can do when it moves together.
          </p>
        </div>
      </section>

    </div>
  );
}

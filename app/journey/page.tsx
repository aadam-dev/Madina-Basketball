import { Calendar, CheckCircle, DollarSign, Users, Trophy, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import GoogleSheetsEmbed from "@/components/GoogleSheetsEmbed";
import JourneyTimeline from "@/components/JourneyTimeline";
import AnimateIn from "@/components/AnimateIn";
import { getVideo } from "@/lib/videos";

const timelineEvents = [
  {
    date: "April 10, 2025",
    title: "The Plan Begins",
    description: "Shafic reaches out to Adam to start the renovation. Adam sourced contractors and tracked the project digitally; Shafic led stakeholder engagement and fundraising.",
    phase: "planning" as const,
  },
  {
    date: "April 26, 2025",
    title: "Contractor Contacted",
    description: "After consulting engineers and community members, the team identified and reached out to the contractor who would carry out the renovation.",
    phase: "planning" as const,
  },
  {
    date: "May 3, 2025",
    title: "Site Assessment",
    description: "The engineering team met on site to assess the court. Full damage assessment completed and scope of work defined.",
    phase: "planning" as const,
  },
  {
    date: "May 14–21, 2025",
    title: "BOQ Prepared",
    description: "Bill of Quantities prepared across three cost scenarios. Final BOQ: GHS 37,250. The community raised GHS 44,750 from 18 donors, exceeding the target by GHS 7,500. All costs itemised and published.",
    phase: "planning" as const,
  },
  {
    date: "June 5, 2025",
    title: "Renovation Begins",
    description: "Work started on the court. Surface repair, painting, and equipment installation commenced under community oversight.",
    phase: "renovation" as const,
  },
  {
    date: "June 12, 2025",
    title: "Renovation Complete",
    description: "Full renovation finished in one week. Standard markings, new hoops, and resurfaced playing area completed. The court is ready for play.",
    phase: "renovation" as const,
  },
  {
    date: "June 22, 2025",
    title: "Court Launch",
    description: "Official opening ceremony. First game: Madina vs Kawukudi. Community celebration documented in full.",
    phase: "active" as const,
  },
  {
    date: "July 12, 2025",
    title: "Madina Old Gees Join",
    description: "Madina Old Gees joined the court and have been a cornerstone ever since. Their presence significantly elevated the level of play and community engagement.",
    phase: "active" as const,
  },
  {
    date: "November 2025",
    title: "Zurak Basketball Launched",
    description: "Zurak Basketball officially launched, bringing the next generation of Madina players into organised competition.",
    phase: "active" as const,
  },
  {
    date: "January 2026",
    title: "Lighting System: Lessons Learned",
    description: "An attempted solar lighting installation revealed supply chain issues. Batteries sourced from China proved defective and were removed. The court returned to grid power. A proper lighting upgrade remains a priority.",
    phase: "active" as const,
  },
  {
    date: "Today",
    title: "Court Active",
    description: "Regular pick-up games, training sessions, and events ongoing. Madina Basketball continues to serve as the hub for basketball and community work in Madina.",
    phase: "active" as const,
  },
];

export default function Journey() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden court-lines border-b border-white/6 min-h-[340px] lg:min-h-[440px]">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />

        {/* Hero — split before/after on desktop */}
        <div className="hidden lg:flex absolute right-0 top-0 h-full w-[48%] pointer-events-none">
          {/* Before (left half of image strip) */}
          <div className="relative w-1/2 h-full grayscale brightness-50">
            <Image
              src="/images/journey/before/abandoned-court.jpg"
              alt="Before renovation"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          {/* After (right half) */}
          <div className="relative w-1/2 h-full">
            <Image
              src="/images/journey/after/hero-court.jpg"
              alt="After renovation"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          {/* Overlay fades */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]/5" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          {/* Before/After labels */}
          <div className="absolute top-6 left-[6%] text-[0.6rem] font-black uppercase tracking-widest text-white/40 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">Before</div>
          <div className="absolute top-6 right-6 text-[0.6rem] font-black uppercase tracking-widest text-[#ff6b35] bg-black/40 backdrop-blur-sm px-2 py-1 rounded border border-[#ff6b35]/30">After</div>
          {/* Divider line */}
          <div className="absolute top-0 left-1/2 h-full w-px bg-white/15" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="max-w-xl">
            <span className="pill bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/30 mb-5 inline-flex">
              The Journey
            </span>
            <h1
              className="font-black uppercase leading-none mb-5"
              style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.04em" }}
            >
              FROM<br />
              <span className="text-[#ff6b35]">BROKEN</span> TO BUILT
            </h1>
            <p className="text-white/55 max-w-xl text-base leading-relaxed">
              How a community transformed a neglected court into an active basketball hub.
              Every step documented, every decision public.
            </p>
          </div>
        </div>
      </section>

      {/* ── Before / After ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Visual Record</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-12">The Transformation</h2>

          {/* Before */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-[#004e89] rounded-full" />
              <h3 className="text-sm font-black uppercase tracking-tight text-white/60">Before Renovation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#111] border border-white/8">
                <Image
                  src="/images/journey/before/abandoned-court.jpg"
                  alt="Before renovation"
                  fill className="object-cover" unoptimized
                />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#111] border border-white/8">
                <video src="/videos/compressed/engineers-at-work.mp4" controls className="w-full h-full object-contain" preload="metadata" />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#111] border border-white/8">
                <video src="/videos/compressed/before-renovation-1.mp4" controls className="w-full h-full object-contain" preload="metadata" />
              </div>
            </div>
          </div>

          {/* After */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-green-500 rounded-full" />
              <h3 className="text-sm font-black uppercase tracking-tight text-white/60">After Renovation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#111] border border-white/8">
                <video src="/videos/compressed/b4launch.MOV" controls className="w-full h-full object-contain" preload="metadata" />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#111] border border-white/8">
                <Image
                  src="/images/journey/after/completed-evening.jpg"
                  alt="Completed court, evening"
                  fill className="object-cover" unoptimized
                />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#111] border border-white/8">
                <video src="/videos/compressed/afternumber3.MOV" controls className="w-full h-full object-contain" preload="metadata" />
              </div>
            </div>
          </div>

          {/* Transformation video */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-[#ff6b35] rounded-full" />
              <h3 className="text-sm font-black uppercase tracking-tight text-white/60">Full Transformation</h3>
            </div>
            <div className="max-w-4xl">
              <div className="aspect-video rounded-xl overflow-hidden bg-[#111] border border-white/8">
                {getVideo("capcut-edit")?.videoId ? (
                  <YouTubeEmbed
                    videoId={getVideo("capcut-edit")!.videoId}
                    title={getVideo("capcut-edit")!.title}
                    className="rounded-xl"
                  />
                ) : (
                  <video src="/videos/compressed/before-renovation-2.mp4" controls className="w-full h-full object-contain" preload="metadata" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Timeline ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-6">
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Milestone Log</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">The Timeline</h2>
              <p className="text-white/35 mt-3 text-sm">Filter by phase. Click any phase to focus.</p>
            </div>
          </AnimateIn>
          <JourneyTimeline events={timelineEvents} />
        </div>
      </section>

      {/* ── Launch Game ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <AnimateIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-[#111] border border-white/8 rounded-2xl p-8 md:p-10">
              <div>
                <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Launch Game</p>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Madina vs Kawukudi</h2>
                <p className="text-white/60 leading-relaxed mb-4">
                  The opening ceremony game on June 22, 2025 marked the official launch of the renovated court.
                  Madina faced Kawukudi in a match that brought the entire community out to celebrate.
                </p>
                <Link
                  href="/media"
                  className="inline-flex items-center gap-2 text-[#ff6b35] font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
                >
                  View Photos and Videos <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden group">
                <Image
                  src="/images/events/launch-day/event-poster.jpg"
                  alt="Madina vs Kawukudi launch game poster"
                  fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Link
                    href="/media"
                    className="px-5 py-2.5 bg-[#ff6b35] text-white font-bold text-sm rounded-lg hover:bg-[#e55a2b] transition-colors uppercase tracking-wider shadow-xl"
                  >
                    View Gallery
                  </Link>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Project Leads Announcement ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-[#ff6b35]" />
            </div>
            <div>
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em]">Community Update</p>
              <h2 className="text-2xl font-black uppercase tracking-tight">Project Leads Announcement</h2>
            </div>
          </div>
          <p className="text-white/50 text-sm mb-6 max-w-xl">
            Shafic&apos;s announcement closing the fundraiser, covering the revision from GHS 56k (tempered glass backboard)
            to GHS 37k (wooden backboard) along with updates on contractor payments and timeline.
          </p>
          <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden max-w-sm">
            <div className="aspect-[3/4] relative">
              <Image
                src="/images/journey/project-leads-announcement.jpg"
                alt="Project Leads Announcement"
                fill className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Fundraising Info Sheet ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#ff6b35]" />
            </div>
            <div>
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em]">Documentation</p>
              <h2 className="text-2xl font-black uppercase tracking-tight">Fundraising Information Sheet</h2>
            </div>
          </div>
          <p className="text-white/50 text-sm mb-6 max-w-xl">
            The information sheet used to communicate the renovation project and fundraising goals to the community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { src: "/images/journey/fundraising-info-sheet-1.jpg", label: "Page 1" },
              { src: "/images/journey/fundraising-info-sheet-2.jpg", label: "Page 2" },
            ].map(({ src, label }) => (
              <div key={label} className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image src={src} alt={`Fundraising Info Sheet, ${label}`} fill className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Financial Transparency ── */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#ff6b35]" />
            </div>
            <div>
              <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em]">Full Disclosure</p>
              <h2 className="text-2xl font-black uppercase tracking-tight">Financial Transparency</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h3 className="text-white font-black uppercase text-sm tracking-tight mb-2">Proforma Invoice / BOQ</h3>
              <p className="text-white/50 text-sm mb-5">
                Detailed breakdown of all materials, labour, and services. Total BOQ:{" "}
                <strong className="text-[#ff6b35]">GHS 37,250</strong>
              </p>
              <div className="bg-[#0d0d0d] rounded-xl overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image
                    src="/images/journey/proforma-invoice.jpg"
                    alt="Proforma Invoice, Bill of Quantities"
                    fill className="object-contain"
                  />
                </div>
              </div>
              <p className="text-white/20 text-xs mt-2 text-center">All amounts in GHS (Ghana Cedis).</p>
            </div>
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h3 className="text-white font-black uppercase text-sm tracking-tight mb-2">Live Fundraising Dashboard</h3>
              <p className="text-white/50 text-sm mb-5">
                Real-time tracking of all donations and fundraising progress.
              </p>
              <GoogleSheetsEmbed
                sheetUrl="https://docs.google.com/spreadsheets/d/1fyjItPyghvd5aVZSrrF__4U3gwLQcemCZHu6psPL-BA/edit?gid=609525463#gid=609525463"
                title="Fundraising Dashboard"
                height="600px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Achievements ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <AnimateIn>
            <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3 text-center">Results</p>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-10 text-center">By the Numbers</h2>
          </AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "18",        label: "Donors" },
              { value: "GHS 44.7K", label: "Raised" },
              { value: "3 Months",  label: "Plan to Play" },
              { value: "100%",      label: "Transparent" },
            ].map(({ value, label }, i) => (
              <AnimateIn key={label} delay={i * 80}>
                <div className="bg-[#111] border border-white/8 rounded-2xl py-8 px-4 text-center hover:border-[#ff6b35]/30 transition-colors">
                  <div className="w-8 h-8 bg-green-500/15 border border-green-500/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{value}</div>
                  <div className="text-white/35 text-xs uppercase tracking-wider font-bold">{label}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#ff6b35] py-16">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">See the Numbers</h2>
          <p className="text-white/80 max-w-md mx-auto mb-8 text-sm">
            Every cedi tracked. Every expense documented.
          </p>
          <Link
            href="/transparency"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#ff6b35] font-bold text-sm rounded-lg hover:bg-white/90 transition-colors uppercase tracking-wider"
          >
            View Transparency Report <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}

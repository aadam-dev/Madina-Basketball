'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Play, ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const HIGHLIGHT_CLIPS = [
  {
    src: "/videos/highlights/compressed/launch-game-highlights-compressed.mp4",
    label: "Launch Game Highlights",
    tag: "Launch Day",
    featured: true,
  },
  {
    src: "/videos/highlights/compressed/nadir-killer-3pointer-compressed.mp4",
    label: "Nadir's Killer 3-Pointer",
    tag: "Top Play",
  },
  {
    src: "/videos/highlights/compressed/brandon-coast-to-coast3p-compressed.mp4",
    label: "Brandon Coast-to-Coast",
    tag: "Top Play",
  },
  {
    src: "/videos/highlights/compressed/hafiz-putback-compressed.mp4",
    label: "Hafiz Put-Back Slam",
    tag: "Top Play",
  },
  {
    src: "/videos/highlights/compressed/mustafa-drive-compressed.mp4",
    label: "Mustafa's Drive & Finish",
    tag: "Top Play",
  },
  {
    src: "/videos/highlights/compressed/t-shoots-3-pointer-compressed.mp4",
    label: "T Shoots the 3",
    tag: "Top Play",
  },
  {
    src: "/videos/highlights/compressed/launch-aerial-view-compressed.mp4",
    label: "Court Aerial View",
    tag: "Launch Day",
  },
  {
    src: "/videos/highlights/compressed/night-of-legends-highlights-compressed.mp4",
    label: "Night of Legends — Full Highlights",
    tag: "Event",
    featured: true,
  },
  {
    src: "/videos/highlights/compressed/night-of-legends-warmup-compressed.mp4",
    label: "Night of Legends — Warmup",
    tag: "Event",
  },
  {
    src: "/videos/highlights/compressed/pickup-games-highlights-compressed.mp4",
    label: "Pickup Games Reel",
    tag: "Pickup",
  },
  {
    src: "/videos/highlights/compressed/training-sessions-highlights-compressed.mp4",
    label: "Training Sessions Reel",
    tag: "Training",
  },
];

const LAUNCH_PHOTOS = [
  { src: "/images/events/launch-day/launch-game-action-shot-01.jpg",          alt: "Launch game action",                   span: "col-span-2 row-span-2" },
  { src: "/images/events/launch-day/aziz-shooting.jpg",                       alt: "Aziz shooting",                        span: "" },
  { src: "/images/events/launch-day/kawukudi-fast-break.jpg",                 alt: "Kawukudi fast break",                  span: "" },
  { src: "/images/events/launch-day/shafic-courtside.jpg",                    alt: "Shafic courtside",                     span: "" },
  { src: "/images/events/launch-day/shafic-courtside2.jpg",                   alt: "Shafic courtside",                     span: "" },
  { src: "/images/events/launch-day/courtsidemadinafans.jpg",                 alt: "Madina fans courtside",                span: "col-span-2" },
  { src: "/images/events/launch-day/player-portrait-01.jpg",                  alt: "Player portrait",                      span: "" },
  { src: "/images/events/launch-day/launch-player-portrait-green-jersey-01.jpg", alt: "Player in green jersey",            span: "" },
  { src: "/images/events/launch-day/hakeem-with-the-ball.jpg",                alt: "Hakeem with the ball",                 span: "" },
  { src: "/images/events/launch-day/rebound-hustle.jpg",                      alt: "Rebound hustle",                       span: "col-span-2" },
  { src: "/images/events/launch-day/chris-boxes-aziz-out.jpg",                alt: "Chris boxes out Aziz",                 span: "" },
  { src: "/images/events/launch-day/mad-guard1.jpg",                          alt: "Madina guard",                         span: "" },
  { src: "/images/events/launch-day/kawukudi-player-pose1.jpg",               alt: "Kawukudi player",                      span: "" },
  { src: "/images/events/launch-day/kawukudi-get-into-pos.jpg",               alt: "Kawukudi positioning",                 span: "" },
  { src: "/images/events/launch-day/screen-set-center.jpg",                   alt: "Screen set by center",                 span: "" },
  { src: "/images/events/launch-day/game-pic11.jpg",                          alt: "Game action",                          span: "" },
  { src: "/images/events/launch-day/action-shot-01.jpg",                      alt: "Action shot",                          span: "" },
  { src: "/images/events/launch-day/mcdwin-courtside.jpg",                    alt: "Mcdwin courtside",                     span: "" },
  { src: "/images/events/launch-day/moh-courtside-supporting-madina.jpg",     alt: "Moh supporting Madina",                span: "" },
  { src: "/images/events/launch-day/yfm-announcement.png",                    alt: "YFM announcement",                     span: "col-span-2" },
  { src: "/images/events/launch-day/event-poster.jpg",                        alt: "Launch day event poster",              span: "" },
];

const EVENT_ITEMS = [
  { type: "image", src: "/images/events/posters/ogs-vs-youngings.png",           label: "Old Gees vs. Youngins",       tag: "Match" },
  { type: "image", src: "/images/events/posters/madina-vs-nima-match.png",       label: "Madina vs. Nima",             tag: "Match" },
  { type: "image", src: "/images/events/old-gees-vs-youngins/event-poster.png",  label: "OGS vs Youngins Poster",      tag: "Event Poster" },
  { type: "video", src: "/images/events/posters/official-launch-donors.mp4",     label: "Official Launch — Donors",    tag: "Launch" },
  { type: "image", src: "/images/events/posters/donor-appreciation.jpg",         label: "Donor Appreciation",          tag: "Community" },
  { type: "image", src: "/images/events/posters/lawyer-francis-appreciation.png", label: "Lawyer Francis — Thank You", tag: "Community" },
  { type: "image", src: "/images/events/posters/lawyer-richard-appreciation.png", label: "Lawyer Richard — Thank You", tag: "Community" },
];

const PICKUP_TRAINING = [
  { src: "/videos/highlights/compressed/pickup-games-highlights-compressed.mp4",   label: "Pickup Games Reel",          tag: "Pickup" },
  { src: "/videos/highlights/compressed/training-sessions-highlights-compressed.mp4", label: "Training Sessions Reel", tag: "Training" },
  { src: "/videos/compressed/engineers-at-work.mp4",                               label: "Court Build — Engineers",    tag: "Journey" },
  { src: "/videos/compressed/before-renovation-1.mp4",                             label: "Before Renovation",          tag: "Journey" },
  { src: "/videos/compressed/before-renovation-2.mp4",                             label: "Before Renovation II",       tag: "Journey" },
];

type Tab = "highlights" | "launch" | "events" | "pickup";

/* ─── Lightbox ───────────────────────────────────────────────────────────── */
function Lightbox({
  photos,
  index,
  onClose,
  onNav,
}: {
  photos: typeof LAUNCH_PHOTOS;
  index: number;
  onClose: () => void;
  onNav: (dir: -1 | 1) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(-1);
      if (e.key === "ArrowRight") onNav(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNav]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
        onClick={onClose}
      >
        <X size={28} />
      </button>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-10"
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
      >
        <ChevronLeft size={36} />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-10"
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
      >
        <ChevronRight size={36} />
      </button>

      <div
        className="relative max-w-5xl max-h-[90vh] w-full mx-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photos[index].src}
          alt={photos[index].alt}
          width={1400}
          height={900}
          className="object-contain max-h-[85vh] w-full rounded-lg"
        />
        <p className="text-white/60 text-sm text-center mt-3">
          {photos[index].alt} &nbsp;·&nbsp; {index + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}

/* ─── VideoCard ──────────────────────────────────────────────────────────── */
function VideoCard({ src, label, tag, big = false }: { src: string; label: string; tag?: string; big?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  }

  return (
    <div className={`video-card rounded-xl overflow-hidden group ${big ? "aspect-video" : "aspect-video"}`}>
      <video
        ref={ref}
        src={src}
        className="w-full h-full object-cover"
        playsInline
        loop
        onClick={toggle}
      />
      {/* overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 cursor-pointer ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100 bg-black/30"}`}
        onClick={toggle}
      >
        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <Play size={22} className="text-white ml-1" fill="white" />
        </div>
      </div>
      {tag && (
        <div className="video-label">{tag}</div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white text-sm font-semibold leading-tight">{label}</p>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function MediaPage() {
  const [tab, setTab] = useState<Tab>("highlights");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#events") setTab("events");
    if (hash === "#launch") setTab("launch");
    if (hash === "#pickup") setTab("pickup");
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "highlights", label: "Highlights" },
    { id: "launch",     label: "Launch Day" },
    { id: "events",     label: "Events" },
    { id: "pickup",     label: "Pickup & Training" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden court-lines" style={{ minHeight: "38vh" }}>
        {/* ambient video tint */}
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105"
        >
          <source src="/videos/highlights/compressed/launch-game-highlights-compressed.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]" />
        {/* left orange bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff6b35]" />

        <div className="relative z-10 container mx-auto px-6 lg:px-8 flex flex-col justify-end pb-16 pt-28">
          <span className="pill bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/30 mb-4 self-start">
            Media &amp; Gallery
          </span>
          <h1
            className="uppercase font-black leading-none tracking-tight"
            style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.04em" }}
          >
            THE COURT&nbsp;
            <span className="text-[#ff6b35]">IN MOTION</span>
          </h1>
          <p className="mt-4 text-white/60 max-w-xl text-base">
            Every clip, every photo — the raw energy of Madina Basketball captured in real time.
          </p>
        </div>
      </section>

      {/* ── Tab Bar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-16 lg:top-20 z-40 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-white/8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2 rounded-lg font-bold text-xs tracking-widest uppercase transition-all whitespace-nowrap ${
                  tab === t.id
                    ? "bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/25"
                    : "text-white/40 hover:text-white hover:bg-white/8"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="container mx-auto px-6 lg:px-8 py-14">

        {/* ── HIGHLIGHTS TAB ─────────────────────────────────────────────── */}
        {tab === "highlights" && (
          <div>
            <div className="mb-10">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Season 2025–26</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">Top Plays &amp; Reels</h2>
            </div>

            {/* Featured (first 2 big clips) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {HIGHLIGHT_CLIPS.filter(c => c.featured).map((clip, i) => (
                <VideoCard key={i} src={clip.src} label={clip.label} tag={clip.tag} big />
              ))}
            </div>

            {/* Rest in 3-col grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HIGHLIGHT_CLIPS.filter(c => !c.featured).map((clip, i) => (
                <VideoCard key={i} src={clip.src} label={clip.label} tag={clip.tag} />
              ))}
            </div>
          </div>
        )}

        {/* ── LAUNCH DAY TAB ─────────────────────────────────────────────── */}
        {tab === "launch" && (
          <div>
            <div className="mb-10">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-1">June 22, 2025</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">Launch Day — Madina vs Kawukudi</h2>
              <p className="text-white/50 mt-2 text-sm max-w-lg">
                The day Madina Zurak Court officially opened its doors. Community, competition, and joy.
              </p>
            </div>

            {/* Masonry-style grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 auto-rows-[180px]">
              {LAUNCH_PHOTOS.map((photo, i) => (
                <div
                  key={i}
                  className={`photo-card rounded-lg cursor-zoom-in ${photo.span}`}
                  onClick={() => setLightboxIndex(i)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

            <p className="text-white/30 text-xs text-center mt-6">
              {LAUNCH_PHOTOS.length} photos — click any to expand
            </p>
          </div>
        )}

        {/* ── EVENTS TAB ─────────────────────────────────────────────────── */}
        {tab === "events" && (
          <div>
            <div className="mb-10">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Madina Basketball</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">Events &amp; Announcements</h2>
              <p className="text-white/50 mt-2 text-sm max-w-lg">
                Tournaments, appreciation posts, and community milestones.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {EVENT_ITEMS.map((item, i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden bg-[#111] border border-white/8 hover:border-[#ff6b35]/40 transition-colors">
                  {item.type === "video" ? (
                    <VideoCard src={item.src} label={item.label} tag={item.tag} />
                  ) : (
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        {item.tag && (
                          <span className="pill bg-[#ff6b35]/20 text-[#ff6b35] border border-[#ff6b35]/30 text-[0.6rem] mb-2">
                            {item.tag}
                          </span>
                        )}
                        <p className="text-white font-bold text-sm leading-tight">{item.label}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PICKUP & TRAINING TAB ──────────────────────────────────────── */}
        {tab === "pickup" && (
          <div>
            <div className="mb-10">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Community Action</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">Pickup &amp; Training</h2>
              <p className="text-white/50 mt-2 text-sm max-w-lg">
                Daily runs, youth sessions, and the journey that built the court.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PICKUP_TRAINING.map((clip, i) => (
                <VideoCard key={i} src={clip.src} label={clip.label} tag={clip.tag} />
              ))}
            </div>

            {/* Court journey photos */}
            <div className="mt-16">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6 orange-rule">
                The Build — Before &amp; After
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 auto-rows-[160px]">
                {[
                  { src: "/images/journey/before/abandoned-court.jpg",        alt: "Abandoned court" },
                  { src: "/images/journey/before/brokencourtview.jpg",        alt: "Broken court" },
                  { src: "/images/journey/before/brokencourtfarview.jpg",     alt: "Court from afar before" },
                  { src: "/images/journey/before/brokencourt2.jpg",           alt: "Broken court II" },
                  { src: "/images/journey/before/brokencourt3.jpg",           alt: "Broken court III" },
                  { src: "/images/journey/during/painting-workers.jpg",       alt: "Workers painting" },
                  { src: "/images/journey/after/court-painting.jpg",          alt: "Court painting complete" },
                  { src: "/images/journey/after/hero-court.jpg",              alt: "Completed court" },
                  { src: "/images/journey/after/hero-court-daytime-aerial.jpg", alt: "Aerial daytime view" },
                  { src: "/images/journey/after/hero-court-sunset-aerial.jpg",  alt: "Aerial sunset view" },
                ].map((photo, i) => (
                  <div key={i} className="photo-card rounded-lg">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── CTA Strip ────────────────────────────────────────────────────── */}
      <section className="border-t border-white/8 bg-[#0d0d0d] py-14">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-3">Get Involved</p>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-6">
            Want to feature on this page?
          </h3>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-lg hover:bg-[#e55a2b] transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={LAUNCH_PHOTOS}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={(dir) =>
            setLightboxIndex((prev) =>
              prev === null ? 0 : (prev + dir + LAUNCH_PHOTOS.length) % LAUNCH_PHOTOS.length
            )
          }
        />
      )}
    </div>
  );
}

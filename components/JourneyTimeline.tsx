"use client";

import { useState, useEffect, useRef } from "react";

type Phase = "planning" | "renovation" | "active";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  phase: Phase;
}

interface Props {
  events: TimelineEvent[];
}

const phaseConfig: Record<Phase, {
  dot: string;
  ring: string;
  label: string;
  dateColor: string;
  filterBg: string;
}> = {
  planning:   {
    dot: "bg-[#004e89]",
    ring: "border-[#004e89]",
    label: "Planning",
    dateColor: "text-[#6aaaff]",
    filterBg: "bg-[#004e89]/15 border-[#004e89]/35 text-[#6aaaff]",
  },
  renovation: {
    dot: "bg-[#ff6b35]",
    ring: "border-[#ff6b35]",
    label: "Renovation",
    dateColor: "text-[#ff6b35]",
    filterBg: "bg-[#ff6b35]/15 border-[#ff6b35]/35 text-[#ff6b35]",
  },
  active:     {
    dot: "bg-green-500",
    ring: "border-green-500",
    label: "Active",
    dateColor: "text-green-400",
    filterBg: "bg-green-500/15 border-green-500/35 text-green-400",
  },
};

export default function JourneyTimeline({ events }: Props) {
  const [filter, setFilter] = useState<Phase | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${i % 2 === 0 ? 0 : 60}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i % 2 === 0 ? 0 : 60}ms`;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "none";
            obs.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const toggleFilter = (phase: Phase) =>
    setFilter((prev) => (prev === phase ? null : phase));

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-14 flex-wrap">
        <button
          onClick={() => setFilter(null)}
          className={`px-5 py-2 rounded-full text-[0.65rem] font-bold uppercase tracking-widest border transition-all ${
            filter === null
              ? "bg-white/12 border-white/25 text-white"
              : "border-white/10 text-white/35 hover:border-white/20 hover:text-white/60"
          }`}
        >
          All
        </button>
        {(["planning", "renovation", "active"] as Phase[]).map((phase) => {
          const cfg = phaseConfig[phase];
          const active = filter === phase;
          return (
            <button
              key={phase}
              onClick={() => toggleFilter(phase)}
              className={`px-5 py-2 rounded-full text-[0.65rem] font-bold uppercase tracking-widest border transition-all flex items-center gap-2 ${
                active
                  ? cfg.filterBg
                  : "border-white/10 text-white/35 hover:border-white/20 hover:text-white/60"
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/12 to-transparent md:-translate-x-px animate-draw-line" />

        {events.map((event, i) => {
          const isToday  = event.date === "Today";
          const cfg      = phaseConfig[event.phase];
          const dimmed   = filter !== null && filter !== event.phase;
          const isEven   = i % 2 === 0;

          return (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`relative flex items-start gap-8 mb-10 transition-opacity duration-300 ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              } ${dimmed ? "opacity-15 pointer-events-none" : "opacity-100"}`}
            >
              {/* Node */}
              <div
                className={`absolute left-4 md:left-1/2 -translate-x-2 md:-translate-x-2.5 z-10 w-5 h-5 rounded-full border-2 ${cfg.ring} bg-[#0a0a0a] flex items-center justify-center ${
                  isToday ? "animate-node-glow" : ""
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ${isToday ? "animate-pulse" : ""}`}
                />
              </div>

              {/* Card */}
              <div
                className={`ml-12 md:ml-0 md:w-[46%] bg-[#111] border border-white/8 rounded-xl p-5 hover:border-white/18 transition-colors group ${
                  isEven ? "md:mr-auto" : "md:ml-auto"
                } ${isToday ? "border-green-500/25 hover:border-green-500/40" : ""}`}
              >
                <span className={`text-[0.65rem] font-bold uppercase tracking-widest ${cfg.dateColor}`}>
                  {event.date}
                </span>

                <div className="flex items-start justify-between gap-2 mt-1 mb-2">
                  <h3 className="text-white font-black uppercase tracking-tight text-sm leading-snug">
                    {event.title}
                  </h3>
                  {isToday && (
                    <span className="pill bg-green-500/15 text-green-400 border border-green-500/25 text-[0.55rem] flex-shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Now
                    </span>
                  )}
                </div>

                <p className="text-white/45 text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

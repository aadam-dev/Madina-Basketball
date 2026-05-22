"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

interface Props {
  before: string;
  after: string;
  beforeAlt?: string;
  afterAlt?: string;
}

export default function BeforeAfterSlider({ before, after, beforeAlt = "Before", afterAlt = "After" }: Props) {
  const [position, setPosition] = useState(50); // 0–100 %
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const update = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - left) / width) * 100));
    setPosition(pct);
  }, []);

  // Mouse
  const onMouseDown = () => setDragging(true);
  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => update(e.clientX);
    const up   = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [dragging, update]);

  // Touch
  const onTouchMove = (e: React.TouchEvent) => { e.preventDefault(); update(e.touches[0].clientX); };

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-2xl bg-[#111] border border-white/8 aspect-video cursor-col-resize touch-none"
      onMouseMove={(e) => dragging && update(e.clientX)}
      onTouchMove={onTouchMove}
    >
      {/* After (full width, underneath) */}
      <Image src={after} alt={afterAlt} fill className="object-cover" unoptimized />
      <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-sm border border-[#ff6b35]/40 text-[#ff6b35] text-[0.6rem] font-black uppercase tracking-widest px-2.5 py-1 rounded">
        After
      </div>

      {/* Before (clipped left) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image src={before} alt={beforeAlt} fill className="object-cover grayscale brightness-75" unoptimized />
        <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-sm border border-white/20 text-white/60 text-[0.6rem] font-black uppercase tracking-widest px-2.5 py-1 rounded">
          Before
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute inset-y-0 -translate-x-px w-0.5 bg-white/80" />
        {/* Handle */}
        <button
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center pointer-events-auto"
          onMouseDown={onMouseDown}
          onTouchStart={() => setDragging(true)}
          onTouchEnd={() => setDragging(false)}
          aria-label="Drag to compare before and after"
        >
          <MoveHorizontal className="w-5 h-5 text-[#0a0a0a]" />
        </button>
      </div>

      {/* Hint — fades away after first drag */}
      <div
        className={`absolute inset-x-0 bottom-3 flex justify-center z-20 transition-opacity duration-500 pointer-events-none ${dragging ? "opacity-0" : "opacity-100"}`}
      >
        <span className="bg-black/60 backdrop-blur-sm text-white/50 text-[0.6rem] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
          Drag to compare
        </span>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import CourtGame from "@/components/play/CourtGame";

export const metadata: Metadata = {
  title: "Play — Madina Basketball",
  description:
    "Free throws, a shooting contest, and pickup to 5 on a Madina outdoor court. Phone-friendly, with stats saved on your device.",
};

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-[#14110e] via-[#0a0a0a] to-[#0d1a14] py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#ff6b35]">
            Madina Court · Play
          </p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Shoot on our court
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
            Drawn like the outdoor court in Libya Quarters: key, free-throw circle, three-point arc,
            orange lines. Playable and short of full FIBA size, same as the real floor. Stats stay on
            this device.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CourtGame />
        </div>
      </section>
    </div>
  );
}

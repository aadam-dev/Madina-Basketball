import type { Metadata } from "next";
import CourtGame from "@/components/play/CourtGame";

export const metadata: Metadata = {
  title: "Play — Madina Basketball",
  description:
    "Free throws, a shooting contest, and pickup to 5 on a Madina outdoor court. Phone-friendly, with stats saved on your device.",
};

export default function PlayPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0b0a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,107,53,0.14),transparent_55%),radial-gradient(ellipse_at_80%_100%,rgba(26,58,42,0.35),transparent_45%)]"
      />
      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-10 pt-8 sm:px-6 sm:pt-10">
        <header className="mb-5 text-center sm:mb-6">
          <p className="font-[family-name:var(--font-poppins)] text-2xl font-black tracking-tight text-white sm:text-3xl">
            Madina Basketball
          </p>
          <p className="mt-1.5 text-sm text-white/50">Shoot on the outdoor court. Stats stay on this device.</p>
        </header>
        <CourtGame />
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden court-lines">

      {/* Decorative number */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        aria-hidden="true"
      >
        <span
          className="font-black text-white/[0.03] leading-none"
          style={{ fontSize: "clamp(16rem, 50vw, 32rem)" }}
        >
          404
        </span>
      </div>

      {/* Orange accent line */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />

      <div className="relative z-10 text-center max-w-xl">
        {/* Ball icon */}
        <div className="w-20 h-20 rounded-full border-4 border-[#ff6b35]/40 mx-auto mb-8 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border border-[#ff6b35]/20 animate-ping" />
          <span className="text-4xl">🏀</span>
        </div>

        <span className="pill bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/30 mb-5 inline-flex">
          Out of Bounds
        </span>

        <h1
          className="font-black uppercase leading-none mb-4"
          style={{ fontSize: "clamp(2.2rem,7vw,4rem)", letterSpacing: "-0.04em" }}
        >
          PAGE NOT<br />
          <span className="text-[#ff6b35]">FOUND</span>
        </h1>

        <p className="text-white/45 text-base leading-relaxed mb-10 max-w-sm mx-auto">
          That page stepped out of bounds. Head back to the court.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-xl hover:bg-[#e55a2b] transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/media"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white/8 border border-white/15 text-white font-bold text-sm rounded-xl hover:bg-white/15 transition-colors uppercase tracking-wider"
          >
            Watch Highlights
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

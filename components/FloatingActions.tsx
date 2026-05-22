"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, MessageCircle } from "lucide-react";

export default function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col gap-3 items-center">
      {/* WhatsApp */}
      <Link
        href="https://wa.me/233559602056"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25d366] flex items-center justify-center shadow-lg shadow-[#25d366]/30 hover:scale-110 active:scale-95 transition-transform"
      >
        <MessageCircle className="w-5 h-5 text-white" fill="white" />
      </Link>

      {/* Back to top — only when scrolled */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

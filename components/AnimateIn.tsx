"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left" | "right";
}

/**
 * Scroll-triggered reveal wrapper.
 * Server renders content fully visible (no FOUC, works without JS).
 * On mount, JS sets opacity:0 and plays the reveal animation when
 * the element enters the viewport.
 */
export default function AnimateIn({
  children,
  className = "",
  delay = 0,
  from = "bottom",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user's motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const initial: Record<string, string> = {
      bottom: "translateY(22px)",
      left:   "translateX(-14px)",
      right:  "translateX(14px)",
    };

    el.style.opacity = "0";
    el.style.transform = initial[from];
    el.style.transition = [
      `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    ].join(", ");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, from]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

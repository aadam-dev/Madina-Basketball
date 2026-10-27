"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SKIP = ["/admin", "/api"];

export default function VisitBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSent = useRef("");

  useEffect(() => {
    if (!pathname || SKIP.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return;
    }

    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    if (path === lastSent.current) return;
    lastSent.current = path;

    const payload = {
      path,
      referrer: typeof document !== "undefined" ? document.referrer || "" : "",
      language: typeof navigator !== "undefined" ? navigator.language || "" : "",
      screen:
        typeof window !== "undefined"
          ? `${window.screen.width}x${window.screen.height}`
          : "",
    };

    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/visits", blob);
      return;
    }

    void fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname, searchParams]);

  return null;
}

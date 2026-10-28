"use client";

import { useEffect, useState } from "react";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";

const DEFAULT_PATH = "/register";

function resolveUrl(path: string, fallback?: string) {
  if (typeof window !== "undefined") return `${window.location.origin}${path}`;
  return fallback || path;
}

const SHARE_TEXT =
  "Register to play at Madina Basketball Court (Libya Quarters, Accra). Fill this short form:";

export function ShareSignup({
  path = DEFAULT_PATH,
  absoluteUrl,
}: {
  path?: string;
  absoluteUrl?: string;
}) {
  const [url, setUrl] = useState(absoluteUrl || path);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(resolveUrl(path, absoluteUrl));
  }, [path, absoluteUrl]);

  async function copyLink() {
    const absolute = resolveUrl(path, absoluteUrl);
    setUrl(absolute);
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this registration link:", absolute);
    }
  }

  async function nativeShare() {
    const absolute = resolveUrl(path, absoluteUrl);
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Madina Basketball — Register to Play",
          text: SHARE_TEXT,
          url: absolute,
        });
        return;
      } catch {
        /* user cancelled or unsupported — fall through */
      }
    }
    await copyLink();
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${url}`)}`;

  return (
    <div className="rounded-2xl border border-[#ff6b35]/20 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#ff6b35]">Share signup</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Send this link to players</p>
          <p className="mt-1 truncate font-mono text-xs text-slate-500" title={url}>
            {url}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyLink()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-[#ff6b35]" />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#25d366] px-4 text-sm font-semibold text-white transition hover:bg-[#1ebe57] active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" fill="currentColor" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => void nativeShare()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#ff6b35] px-4 text-sm font-bold text-white transition hover:bg-[#e55a2b] active:scale-[0.98]"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

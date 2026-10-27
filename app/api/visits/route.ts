import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/forms/rate-limit";
import { parseUserAgent } from "@/lib/visits/parse-ua";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SKIP_PREFIXES = ["/admin", "/api", "/_next", "/favicon", "/images", "/icons"];

function shouldSkip(path: string) {
  if (!path.startsWith("/")) return true;
  return SKIP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (!rateLimit(`visits:${ip}`, 60, 60_000)) {
    return NextResponse.json({ ok: true });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 500) : "";
  if (!path || shouldSkip(path)) {
    return NextResponse.json({ ok: true });
  }

  const referrer =
    typeof body.referrer === "string" && body.referrer.trim()
      ? body.referrer.slice(0, 1000)
      : null;
  const language = typeof body.language === "string" ? body.language.slice(0, 40) : null;
  const screen = typeof body.screen === "string" ? body.screen.slice(0, 40) : null;
  const userAgent = request.headers.get("user-agent");
  const parsed = parseUserAgent(userAgent);

  const { error } = await supabaseAdmin.from("site_visits").insert({
    path,
    referrer,
    ip: ip === "unknown" ? null : ip.slice(0, 80),
    user_agent: userAgent ? userAgent.slice(0, 500) : null,
    browser: parsed.browser,
    os: parsed.os,
    device: parsed.device,
    language,
    screen,
    country: request.headers.get("x-vercel-ip-country")?.slice(0, 8) || null,
    city: request.headers.get("x-vercel-ip-city")?.slice(0, 80) || null,
  });

  if (error) {
    console.error("visit insert failed", error.message);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

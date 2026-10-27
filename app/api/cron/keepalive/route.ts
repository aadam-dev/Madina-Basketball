import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Optional Vercel Cron backup for Supabase keepalive.
 * Protect with CRON_SECRET. Prefer the GitHub Action as the primary ping.
 *
 * vercel.json example:
 * { "crons": [{ "path": "/api/cron/keepalive", "schedule": "0 9 * * *" }] }
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");
  const allowed =
    (secret && auth === `Bearer ${secret}`) || (secret && querySecret === secret);

  if (!secret || !allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("keepalive")
    .update({ last_ping: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    console.error("keepalive cron failed", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}

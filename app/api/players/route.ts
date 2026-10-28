import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const team = new URL(request.url).searchParams.get("team");
    let query = supabaseAdmin.from("players").select("*").order("display_order", { ascending: true });
    if (team) query = query.eq("team", team);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from("players")
      .insert({
        name: body.name.trim(),
        jersey_number: body.jersey_number || null,
        position: body.position || null,
        team: body.team || null,
        bio: body.bio || null,
        image_url: body.image_url || null,
        height: body.height || null,
        date_of_birth: body.date_of_birth || null,
        is_featured: Boolean(body.is_featured),
        display_order: Number(body.display_order) || 0,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
  }
}

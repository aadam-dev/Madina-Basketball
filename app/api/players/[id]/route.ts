import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseAdmin.from("players").select("*").eq("id", params.id).single();
  if (error || !data) return NextResponse.json({ error: "Player not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    const body = await request.json();
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of [
      "name",
      "jersey_number",
      "position",
      "team",
      "bio",
      "image_url",
      "height",
      "date_of_birth",
      "is_featured",
      "display_order",
    ]) {
      if (body[key] !== undefined) updateData[key] = body[key] === "" ? null : body[key];
    }
    if (body.is_featured !== undefined) updateData.is_featured = Boolean(body.is_featured);
    if (body.display_order !== undefined) updateData.display_order = Number(body.display_order) || 0;

    const { data, error } = await supabaseAdmin
      .from("players")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    const { error } = await supabaseAdmin.from("players").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
  }
}

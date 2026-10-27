import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { roleReviewSchema } from "@/lib/forms/schemas";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = roleReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the review fields.", fieldErrors: parsed.error.flatten() }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("role_applications")
    .update({
      ...parsed.data,
      reviewed_at: new Date().toISOString(),
      reviewed_by: session.email,
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { fieldErrors, messageReviewSchema } from "@/lib/forms/schemas";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const parsed = messageReviewSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Check the fields.", fieldErrors: fieldErrors(parsed.error) }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from("contact_messages")
      .update({
        ...parsed.data,
        reviewed_at: new Date().toISOString(),
        reviewed_by: session.email,
      })
      .eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}

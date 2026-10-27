import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { impactToCsv, loadImpact } from "@/lib/impact";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const report = await loadImpact();
    const csv = impactToCsv(report);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=madina-impact.csv",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not build the report." }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { acceptPublicForm } from "@/lib/forms/accept";
import { stampConsents } from "@/lib/forms/policies";
import { bookingSchema } from "@/lib/forms/schemas";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  return acceptPublicForm(request, {
    route: "bookings",
    schema: bookingSchema,
    save: async (data) => {
      const { consents, ...rest } = data;
      const { data: row, error } = await supabaseAdmin
        .from("court_bookings")
        .insert({ ...rest, consents: stampConsents(consents) })
        .select("id")
        .single();
      if (error || !row) throw new Error(error?.message || "Save failed");
      return row.id as string;
    },
    alert: (data, id) => ({
      type: "booking" as const,
      title: "New court booking",
      message: `New court booking from ${data.name} for ${data.booking_date}. Open the admin portal.`,
      link: `/admin/bookings/${id}`,
    }),
  });
}

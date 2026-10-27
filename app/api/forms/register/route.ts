import { NextRequest } from "next/server";
import { acceptPublicForm } from "@/lib/forms/accept";
import { stampConsents } from "@/lib/forms/policies";
import { registerSchema } from "@/lib/forms/schemas";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  return acceptPublicForm(request, {
    route: "register",
    schema: registerSchema,
    save: async (data) => {
      const { consents, ...rest } = data;
      const { data: row, error } = await supabaseAdmin
        .from("player_registrations")
        .insert({ ...rest, consents: stampConsents(consents) })
        .select("id")
        .single();
      if (error || !row) throw new Error(error?.message || "Save failed");
      return row.id as string;
    },
    alert: (data, id) => ({
      type: "registration" as const,
      title: "New player registration",
      message: `New registration from ${data.full_name}. Open the admin portal.`,
      link: `/admin/registrations/${id}`,
    }),
  });
}

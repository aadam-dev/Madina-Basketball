import { NextRequest } from "next/server";
import { acceptPublicForm } from "@/lib/forms/accept";
import { stampConsents } from "@/lib/forms/policies";
import { roleApplicationSchema } from "@/lib/forms/schemas";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  return acceptPublicForm(request, {
    route: "join",
    schema: roleApplicationSchema,
    save: async (data) => {
      const { consents, ...rest } = data;
      const { data: row, error } = await supabaseAdmin
        .from("role_applications")
        .insert({ ...rest, consents: stampConsents(consents) })
        .select("id")
        .single();
      if (error || !row) throw new Error(error?.message || "Save failed");
      return row.id as string;
    },
    alert: (data, id) => ({
      type: "join" as const,
      title: `New ${data.role} application`,
      message: `New ${data.role} application from ${data.full_name}. Open the admin portal.`,
      link: `/admin/join/${id}`,
    }),
  });
}

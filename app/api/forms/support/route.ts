import { NextRequest } from "next/server";
import { acceptPublicForm } from "@/lib/forms/accept";
import { stampConsents } from "@/lib/forms/policies";
import { supportSchema } from "@/lib/forms/schemas";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  return acceptPublicForm(request, {
    route: "support",
    schema: supportSchema,
    save: async (data) => {
      const { consents, ...rest } = data;
      const { data: row, error } = await supabaseAdmin
        .from("support_offers")
        .insert({ ...rest, consents: stampConsents(consents) })
        .select("id")
        .single();
      if (error || !row) throw new Error(error?.message || "Save failed");
      return row.id as string;
    },
    alert: (data, id) => ({
      type: "support" as const,
      title: "New support offer",
      message: `New support offer from ${data.name} (${data.kinds.join(", ")}). Open the admin portal.`,
      link: `/admin/support/${id}`,
    }),
  });
}

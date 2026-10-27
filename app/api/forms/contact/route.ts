import { NextRequest } from "next/server";
import { acceptPublicForm } from "@/lib/forms/accept";
import { stampConsents } from "@/lib/forms/policies";
import { contactSchema } from "@/lib/forms/schemas";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  return acceptPublicForm(request, {
    route: "contact",
    schema: contactSchema,
    save: async (data) => {
      const { consents, ...rest } = data;
      const { data: row, error } = await supabaseAdmin
        .from("contact_messages")
        .insert({ ...rest, consents: stampConsents(consents) })
        .select("id")
        .single();
      if (error || !row) throw new Error(error?.message || "Save failed");
      return row.id as string;
    },
    alert: (data, id) => ({
      type: "contact" as const,
      title: "New message",
      message: `New ${data.subject.toLowerCase()} from ${data.name}. Open the admin portal.`,
      link: `/admin/messages/${id}`,
    }),
  });
}

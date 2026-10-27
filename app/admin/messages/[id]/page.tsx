import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Fact } from "@/components/admin/IntakeBits";
import { ReviewForm } from "@/components/admin/ReviewForm";

export default async function MessageDetail({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { data: row } = await supabaseAdmin.from("contact_messages").select("*").eq("id", params.id).single();
  if (!row) notFound();
  const consents = Array.isArray(row.consents) ? row.consents : [];

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/messages" className="text-sm text-primary hover:underline">Back to messages</Link>
      <h1 className="text-3xl font-bold text-gray-900">{row.name}</h1>
      <dl className="bg-white rounded-lg shadow px-6">
        <Fact label="Phone" value={row.phone} />
        <Fact label="Email" value={row.email} />
        <Fact label="Subject" value={row.subject} />
        <Fact label="Preferred reply" value={row.preferred_method} />
        <Fact label="Message" value={row.message} />
        <Fact label="Volunteer help" value={(row.volunteer_help || []).join(", ")} />
        <Fact label="Availability" value={row.volunteer_availability} />
        <Fact label="Agreements" value={consents.map((item: { key: string; accepted: boolean; policy_version?: string }) => `${item.key}: ${item.accepted ? "accepted" : "declined"} (${item.policy_version || ""})`).join("\n")} />
      </dl>
      <ReviewForm
        endpoint={`/api/admin/messages/${row.id}`}
        status={row.status}
        notes={row.admin_notes}
        options={[
          { value: "open", label: "Open" },
          { value: "in_progress", label: "In progress" },
          { value: "closed", label: "Closed" },
        ]}
      />
    </div>
  );
}

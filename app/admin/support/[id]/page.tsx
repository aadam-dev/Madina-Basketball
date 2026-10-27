import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Fact } from "@/components/admin/IntakeBits";
import { SupportReview } from "@/components/admin/SupportReview";

export default async function SupportDetail({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { data: row } = await supabaseAdmin.from("support_offers").select("*").eq("id", params.id).single();
  if (!row) notFound();
  const consents = Array.isArray(row.consents) ? row.consents : [];

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/support" className="text-sm text-primary hover:underline">Back to support</Link>
      <h1 className="text-3xl font-bold text-gray-900">{row.name}</h1>
      <dl className="bg-white rounded-lg shadow px-6">
        <Fact label="Organisation" value={row.organisation} />
        <Fact label="Phone" value={row.phone} />
        <Fact label="Email" value={row.email} />
        <Fact label="Preferred contact" value={row.preferred_contact} />
        <Fact label="Kinds" value={(row.kinds || []).join(", ")} />
        <Fact label="Intent" value={row.intent} />
        <Fact label="Lighting note" value={row.lighting_note} />
        <Fact label="Item" value={row.item_description} />
        <Fact label="Quantity offered" value={row.quantity} />
        <Fact label="Cash offered (GHS)" value={row.cash_amount} />
        <Fact label="Message" value={row.message} />
        <Fact label="Public recognition" value={row.recognize_publicly ? "They allowed a name listing after the gift is received. Do not add them to the partners page until status is received." : "Private. Do not list this name."} />
        <Fact label="Agreements" value={consents.map((item: { key: string; accepted: boolean; policy_version?: string; accepted_at?: string }) => `${item.key}: ${item.accepted ? "accepted" : "declined"} (${item.policy_version || ""} ${item.accepted_at || ""})`).join("\n")} />
      </dl>
      <SupportReview
        endpoint={`/api/admin/support/${row.id}`}
        initial={{
          status: row.status,
          admin_notes: row.admin_notes,
          received_on: row.received_on,
          received_summary: row.received_summary,
          cash_received: row.cash_received,
          in_kind_description: row.in_kind_description,
          quantity_received: row.quantity_received,
          estimated_value: row.estimated_value,
        }}
      />
    </div>
  );
}

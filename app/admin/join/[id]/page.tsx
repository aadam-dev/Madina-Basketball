import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Fact } from "@/components/admin/IntakeBits";
import { ReviewForm } from "@/components/admin/ReviewForm";

export default async function JoinDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { data: row } = await supabaseAdmin.from("role_applications").select("*").eq("id", params.id).single();
  if (!row) notFound();

  const consents = Array.isArray(row.consents) ? row.consents : [];

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/join" className="text-sm text-primary hover:underline">
        Back to join applications
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{row.full_name}</h1>
        <p className="capitalize text-gray-500">
          {row.role} · {row.status}
        </p>
      </div>
      <dl className="rounded-lg bg-white px-6 shadow">
        <Fact label="Phone" value={row.phone} />
        <Fact label="Email" value={row.email} />
        <Fact label="Area" value={row.area === "Other" ? row.area_other : row.area} />
        <Fact label="Volunteer help" value={(row.volunteer_help || []).join(", ")} />
        <Fact label="Availability" value={row.volunteer_availability} />
        <Fact label="Coaching experience" value={row.coaching_experience} />
        <Fact label="Sessions available" value={row.sessions_available} />
        <Fact
          label="Reference"
          value={
            row.reference_name
              ? `${row.reference_name}${row.reference_phone ? ` · ${row.reference_phone}` : ""}`
              : null
          }
        />
        <Fact label="Management areas" value={(row.management_areas || []).join(", ")} />
        <Fact label="Weekly commitment" value={row.weekly_commitment} />
        <Fact label="Message" value={row.message} />
        <Fact
          label="Agreements"
          value={consents
            .map(
              (item: { key: string; accepted: boolean; policy_version?: string }) =>
                `${item.key}: ${item.accepted ? "accepted" : "declined"} (${item.policy_version || ""})`
            )
            .join("\n")}
        />
      </dl>
      <ReviewForm
        endpoint={`/api/admin/join/${row.id}`}
        status={row.status}
        notes={row.admin_notes}
        options={[
          { value: "new", label: "New" },
          { value: "in_conversation", label: "In conversation" },
          { value: "accepted", label: "Accepted" },
          { value: "declined", label: "Declined" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
    </div>
  );
}

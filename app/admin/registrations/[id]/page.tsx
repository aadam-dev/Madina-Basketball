import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ageFromDob } from "@/lib/forms/phone";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Fact } from "@/components/admin/IntakeBits";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { RegistrationProfilePdf } from "@/components/admin/RegistrationProfilePdf";

export default async function RegistrationDetail({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { data: row } = await supabaseAdmin.from("player_registrations").select("*").eq("id", params.id).single();
  if (!row) notFound();

  const { count } = await supabaseAdmin
    .from("player_registrations")
    .select("id", { count: "exact", head: true })
    .eq("phone", row.phone)
    .neq("id", row.id);

  const consents = Array.isArray(row.consents) ? row.consents : [];
  const age = ageFromDob(row.date_of_birth);

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/registrations" className="text-sm text-primary hover:underline">Back to registrations</Link>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{row.full_name}</h1>
        <p className="text-gray-500">{row.status}{age !== null ? ` · age ${age}` : ""}</p>
        {(count || 0) > 0 ? (
          <p className="mt-2 text-sm text-amber-800">This phone matches another registration. A parent may have signed up more than one player.</p>
        ) : null}
      </div>
      <RegistrationProfilePdf
        profile={{
          id: row.id,
          full_name: row.full_name,
          status: row.status,
          date_of_birth: row.date_of_birth,
          age,
          gender: row.gender,
          phone: row.phone,
          email: row.email,
          area: row.area === "Other" ? row.area_other || "Other" : row.area,
          skill_level: row.skill_level,
          interests: row.interests || [],
          emergency_name: row.emergency_name,
          emergency_relationship: row.emergency_relationship,
          emergency_phone: row.emergency_phone,
          guardian_name: row.guardian_name,
          guardian_relationship: row.guardian_relationship,
          guardian_phone: row.guardian_phone,
          medical_notes: row.medical_notes,
          photo_consent: row.photo_consent,
          created_at: row.created_at,
        }}
      />
      <dl className="bg-white rounded-lg shadow px-6">
        <Fact label="Phone" value={row.phone} />
        <Fact label="Email" value={row.email} />
        <Fact label="Date of birth" value={row.date_of_birth} />
        <Fact label="Gender" value={row.gender} />
        <Fact label="Area" value={row.area === "Other" ? row.area_other : row.area} />
        <Fact label="Skill" value={row.skill_level} />
        <Fact label="Interests" value={(row.interests || []).join(", ")} />
        <Fact label="Heard from" value={row.heard_from} />
        <Fact label="Emergency contact" value={`${row.emergency_name} (${row.emergency_relationship}) ${row.emergency_phone}`} />
        <Fact label="Guardian" value={row.guardian_name ? `${row.guardian_name} (${row.guardian_relationship}) ${row.guardian_phone}` : null} />
        <Fact label="Medical note" value={row.medical_notes} />
        <Fact label="Photo consent" value={row.photo_consent ? "Yes — check this before using an image" : "No"} />
        <Fact label="Agreements" value={consents.map((item: { key: string; accepted: boolean; policy_version?: string; accepted_at?: string }) => `${item.key}: ${item.accepted ? "accepted" : "declined"} (${item.policy_version || ""})`).join("\n")} />
      </dl>
      <ReviewForm
        endpoint={`/api/admin/registrations/${row.id}`}
        status={row.status}
        notes={row.admin_notes}
        options={[
          { value: "new", label: "New" },
          { value: "confirmed", label: "Confirmed" },
          { value: "waitlist", label: "Waitlist" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
    </div>
  );
}

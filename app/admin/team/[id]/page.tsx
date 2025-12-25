import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default async function EditTeamMemberPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: member, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !member) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Team Member</h1>
        <p className="text-gray-600">Update team member information</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <TeamMemberForm memberId={params.id} initialData={member} />
      </div>
    </div>
  );
}


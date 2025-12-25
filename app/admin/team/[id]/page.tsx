import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import TeamMemberForm from "@/components/admin/TeamMemberForm";
import Link from "next/link";
import { Eye } from "lucide-react";

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Team Member</h1>
            <p className="text-gray-600">Update team member information</p>
          </div>
          <Link
            href="/team"
            target="_blank"
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            <span>View on Site</span>
          </Link>
        </div>
      </div>
      
      {/* Current Member Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4">Current Team Member Information</h2>
        <div className="flex items-start space-x-4">
          {member.image_url && (
            <img
              src={member.image_url}
              alt={member.name}
              className="w-20 h-20 object-cover rounded-full"
            />
          )}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <p className="font-medium text-gray-900">{member.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Role:</span>
              <p className="font-medium text-gray-900">{member.role}</p>
            </div>
            <div>
              <span className="text-gray-500">Section:</span>
              <p className="font-medium text-gray-900 capitalize">{member.section}</p>
            </div>
            <div>
              <span className="text-gray-500">Order:</span>
              <p className="font-medium text-gray-900">{member.order_index}</p>
            </div>
            {member.description && (
              <div className="md:col-span-2">
                <span className="text-gray-500">Description:</span>
                <p className="font-medium text-gray-900 mt-1">{member.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TeamMemberForm memberId={params.id} initialData={member} />
      </div>
    </div>
  );
}


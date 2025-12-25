import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default function NewTeamMemberPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Team Member</h1>
        <p className="text-gray-600">Add a new team member to the website</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <TeamMemberForm />
      </div>
    </div>
  );
}


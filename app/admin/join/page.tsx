import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { FilterLinks, SetupNotice } from "@/components/admin/IntakeBits";

const ROLES = [
  { value: "volunteer", label: "Volunteer" },
  { value: "coach", label: "Coach" },
  { value: "management", label: "Management" },
];

const STATUSES = [
  { value: "new", label: "New" },
  { value: "in_conversation", label: "In conversation" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
  { value: "inactive", label: "Inactive" },
];

export default async function JoinApplicationsPage({
  searchParams,
}: {
  searchParams: { role?: string; status?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let query = supabaseAdmin
    .from("role_applications")
    .select("id, role, full_name, phone, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (searchParams.role) query = query.eq("role", searchParams.role);
  if (searchParams.status) query = query.eq("status", searchParams.status);
  const { data, error } = await query;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Join applications</h1>
      <p className="mb-6 text-gray-600">Volunteers, coaches, and management. Separate from player registrations.</p>
      <div className="mb-3">
        <FilterLinks base="/admin/join" current={searchParams.role} options={ROLES} param="role" />
      </div>
      <FilterLinks
        base={searchParams.role ? `/admin/join?role=${searchParams.role}` : "/admin/join"}
        current={searchParams.status}
        options={STATUSES}
      />
      <SetupNotice message={error?.message} />
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <Link href={`/admin/join/${row.id}`} className="font-medium text-primary hover:underline">
                    {row.full_name}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize">{row.role}</td>
                <td className="px-4 py-3">{row.phone}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">{new Date(row.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-gray-500" colSpan={5}>
                  No applications yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

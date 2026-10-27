import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { EmptyRow, FilterLinks, PageHeader, SetupNotice, StatusBadge, nameLink, tableHead, tableWrap, td, th, tr } from "@/components/admin/IntakeBits";

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
      <PageHeader
        title="Join applications"
        description="Volunteers, coaches, and management. Separate from player registrations."
      />
      <FilterLinks base="/admin/join" current={searchParams.role} options={ROLES} param="role" />
      <FilterLinks
        base={searchParams.role ? `/admin/join?role=${searchParams.role}` : "/admin/join"}
        current={searchParams.status}
        options={STATUSES}
      />
      <SetupNotice message={error?.message} />
      <div className={`${tableWrap} overflow-x-auto`}>
        <table className="min-w-full text-sm">
          <thead className={tableHead}>
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Role</th>
              <th className={th}>Phone</th>
              <th className={th}>Submitted</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className={tr}>
                <td className={td}>
                  <Link href={`/admin/join/${row.id}`} className={nameLink()}>
                    {row.full_name}
                  </Link>
                </td>
                <td className={`${td} capitalize`}>{row.role}</td>
                <td className={td}>{row.phone}</td>
                <td className={`${td} whitespace-nowrap text-slate-500`}>{new Date(row.created_at).toLocaleString()}</td>
                <td className={td}><StatusBadge status={row.status} /></td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? <EmptyRow cols={5}>No applications yet.</EmptyRow> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

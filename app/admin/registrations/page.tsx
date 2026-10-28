import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { displayArea } from "@/lib/forms/location";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { EmptyRow, FilterLinks, PageHeader, SetupNotice, StatusBadge, nameLink, tableHead, tableWrap, td, th, tr } from "@/components/admin/IntakeBits";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "waitlist", label: "Waitlist" },
  { value: "inactive", label: "Inactive" },
];

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let query = supabaseAdmin
    .from("player_registrations")
    .select("id, full_name, phone, status, area, area_other, skill_level, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (searchParams.status) query = query.eq("status", searchParams.status);
  const { data, error } = await query;
  const phones = new Map<string, number>();
  for (const row of data || []) phones.set(row.phone, (phones.get(row.phone) || 0) + 1);

  return (
    <div>
      <PageHeader
        title="Registrations"
        description="Community players. Confirming someone does not publish them on the public roster."
      />
      <FilterLinks base="/admin/registrations" current={searchParams.status} options={STATUSES} />
      <SetupNotice message={error?.message} />
      <div className={`${tableWrap} overflow-x-auto`}>
        <table className="min-w-full text-sm">
          <thead className={tableHead}>
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Phone</th>
              <th className={th}>Area</th>
              <th className={th}>Skill</th>
              <th className={th}>Submitted</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className={tr}>
                <td className={td}>
                  <Link href={`/admin/registrations/${row.id}`} className={nameLink()}>{row.full_name}</Link>
                  {(phones.get(row.phone) || 0) > 1 ? (
                    <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">Same phone</span>
                  ) : null}
                </td>
                <td className={td}>{row.phone}</td>
                <td className={td}>{displayArea(row.area, row.area_other)}</td>
                <td className={`${td} capitalize`}>{row.skill_level}</td>
                <td className={`${td} whitespace-nowrap text-slate-500`}>{new Date(row.created_at).toLocaleString()}</td>
                <td className={td}><StatusBadge status={row.status} /></td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? <EmptyRow cols={6}>No registrations yet.</EmptyRow> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

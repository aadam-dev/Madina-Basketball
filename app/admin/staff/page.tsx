import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { EmptyRow, FilterLinks, PageHeader, SetupNotice, tableHead, tableWrap, td, th, tr } from "@/components/admin/IntakeBits";

const SECTIONS = [
  { value: "executive", label: "Executive" },
  { value: "coach", label: "Coaches" },
  { value: "maintenance", label: "Maintenance" },
  { value: "stakeholder", label: "Stakeholders" },
  { value: "media", label: "Media" },
];

export default async function StaffPage({ searchParams }: { searchParams: { section?: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let query = supabaseAdmin
    .from("team_members")
    .select("id, name, role, section, image_url, order_index")
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });
  if (searchParams.section) query = query.eq("section", searchParams.section);
  const { data, error } = await query;

  return (
    <div>
      <PageHeader
        title="Staff"
        description="Leadership, coaches, and operations people shown on the public team page."
        aside={
          <Link
            href="/admin/staff/new"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add staff
          </Link>
        }
      />
      <FilterLinks base="/admin/staff" current={searchParams.section} options={SECTIONS} param="section" />
      <SetupNotice message={error?.message} />
      <div className={`${tableWrap} overflow-x-auto`}>
        <table className="min-w-full text-sm">
          <thead className={tableHead}>
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Role</th>
              <th className={th}>Section</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className={tr}>
                <td className={td}>
                  <Link href={`/admin/staff/${row.id}`} className="font-medium text-slate-950 hover:text-primary">
                    {row.name}
                  </Link>
                </td>
                <td className={td}>{row.role}</td>
                <td className={`${td} capitalize`}>{row.section}</td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? (
              <EmptyRow cols={3}>No staff yet. Add people who appear on the public team page.</EmptyRow>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

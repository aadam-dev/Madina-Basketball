import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { EmptyRow, FilterLinks, PageHeader, SetupNotice, StatusBadge, nameLink, tableHead, tableWrap, td, th, tr } from "@/components/admin/IntakeBits";

const STATUSES = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "closed", label: "Closed" },
];

export default async function MessagesPage({ searchParams }: { searchParams: { status?: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let query = supabaseAdmin
    .from("contact_messages")
    .select("id, name, subject, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (searchParams.status) query = query.eq("status", searchParams.status);
  const { data, error } = await query;

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Contact and volunteer notes. Sponsorship offers live under Support."
      />
      <FilterLinks base="/admin/messages" current={searchParams.status} options={STATUSES} />
      <SetupNotice message={error?.message} />
      <div className={`${tableWrap} overflow-x-auto`}>
        <table className="min-w-full text-sm">
          <thead className={tableHead}>
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Subject</th>
              <th className={th}>Submitted</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className={tr}>
                <td className={td}>
                  <Link href={`/admin/messages/${row.id}`} className={nameLink()}>{row.name}</Link>
                </td>
                <td className={td}>{row.subject}</td>
                <td className={`${td} whitespace-nowrap text-slate-500`}>{new Date(row.created_at).toLocaleString()}</td>
                <td className={td}><StatusBadge status={row.status} /></td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? <EmptyRow cols={4}>No messages yet.</EmptyRow> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

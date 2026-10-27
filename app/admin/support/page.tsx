import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { EmptyRow, FilterLinks, PageHeader, SetupNotice, StatusBadge, nameLink, tableHead, tableWrap, td, th, tr } from "@/components/admin/IntakeBits";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "in_conversation", label: "In conversation" },
  { value: "pledged", label: "Pledged" },
  { value: "received", label: "Received" },
  { value: "declined", label: "Declined" },
];

export default async function SupportAdminPage({ searchParams }: { searchParams: { status?: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let query = supabaseAdmin
    .from("support_offers")
    .select("id, name, organisation, kinds, status, cash_received, recognize_publicly, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (searchParams.status) query = query.eq("status", searchParams.status);
  const { data, error } = await query;

  const receivedCash = (data || [])
    .filter((row) => row.status === "received")
    .reduce((sum, row) => sum + Number(row.cash_received || 0), 0);

  return (
    <div>
      <PageHeader
        title="Support"
        description="Offers from the public invitation. Received cash here is separate from the GHS 44,750 renovation total."
        aside={
          <p className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
            Cash received in this list
            <span className="mt-1 block text-lg font-semibold tracking-tight text-slate-950">
              GHS {receivedCash.toLocaleString()}
            </span>
          </p>
        }
      />
      <FilterLinks base="/admin/support" current={searchParams.status} options={STATUSES} />
      <SetupNotice message={error?.message} />
      <div className={`${tableWrap} overflow-x-auto`}>
        <table className="min-w-full text-sm">
          <thead className={tableHead}>
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Kind</th>
              <th className={th}>Recognition</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className={tr}>
                <td className={td}>
                  <Link href={`/admin/support/${row.id}`} className={nameLink()}>{row.name}</Link>
                  {row.organisation ? <div className="text-xs text-slate-400">{row.organisation}</div> : null}
                </td>
                <td className={td}>{(row.kinds || []).join(", ") || "—"}</td>
                <td className={td}>{row.recognize_publicly ? "After receipt" : "Private"}</td>
                <td className={td}><StatusBadge status={row.status} /></td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? <EmptyRow cols={4}>No offers yet.</EmptyRow> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

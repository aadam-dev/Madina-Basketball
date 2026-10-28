import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { EmptyRow, PageHeader, SetupNotice, tableHead, tableWrap, td, th, tr } from "@/components/admin/IntakeBits";

export default async function PlayersRosterPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { data, error } = await supabaseAdmin
    .from("players")
    .select("id, name, jersey_number, position, team, is_featured, display_order, image_url")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Roster"
        description="Public team roster. Separate from community registrations — confirming a signup never publishes them here."
        aside={
          <Link
            href="/admin/players/new"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add player
          </Link>
        }
      />
      <SetupNotice message={error?.message} />
      <div className={`${tableWrap} overflow-x-auto`}>
        <table className="min-w-full text-sm">
          <thead className={tableHead}>
            <tr>
              <th className={th}>Player</th>
              <th className={th}>Jersey</th>
              <th className={th}>Position</th>
              <th className={th}>Team</th>
              <th className={th}>Featured</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className={tr}>
                <td className={td}>
                  <Link href={`/admin/players/${row.id}`} className="font-medium text-slate-950 hover:text-primary">
                    {row.name}
                  </Link>
                </td>
                <td className={`${td} tabular-nums`}>{row.jersey_number || "—"}</td>
                <td className={td}>{row.position || "—"}</td>
                <td className={td}>{row.team || "—"}</td>
                <td className={td}>{row.is_featured ? "Yes" : "—"}</td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? (
              <EmptyRow cols={5}>
                No roster players yet. Add Zurak or Old Gees players here — community signups stay under Registrations.
              </EmptyRow>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

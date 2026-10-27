import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { EmptyRow, PageHeader, SetupNotice, tableHead, tableWrap, td, th, tr } from "@/components/admin/IntakeBits";

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString();
}

function daysAgoIso(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

export default async function VisitsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const today = startOfUtcDay();
  const week = daysAgoIso(7);

  const [todayRes, weekRes, recentRes] = await Promise.all([
    supabaseAdmin.from("site_visits").select("id", { count: "exact", head: true }).gte("created_at", today),
    supabaseAdmin
      .from("site_visits")
      .select("path, device, browser, created_at")
      .gte("created_at", week)
      .order("created_at", { ascending: false })
      .limit(2000),
    supabaseAdmin
      .from("site_visits")
      .select("id, path, referrer, ip, browser, os, device, country, city, screen, created_at")
      .order("created_at", { ascending: false })
      .limit(80),
  ]);

  const error = todayRes.error || weekRes.error || recentRes.error;
  const weekRows = weekRes.data || [];
  const recent = recentRes.data || [];

  const pageCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  for (const row of weekRows) {
    pageCounts.set(row.path, (pageCounts.get(row.path) || 0) + 1);
    deviceCounts.set(row.device || "other", (deviceCounts.get(row.device || "other") || 0) + 1);
  }
  const topPages = [...pageCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const devices = [...deviceCounts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visits"
        description="First-party page views. Admin routes are not counted. Data stays in our database."
      />
      <SetupNotice message={error?.message} />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Today (UTC)</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{todayRes.count || 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Last 7 days</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{weekRows.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Devices</p>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
            {devices.map(([name, count]) => (
              <li key={name} className="flex justify-between gap-4">
                <span className="capitalize">{name}</span>
                <span className="font-medium">{count}</span>
              </li>
            ))}
            {devices.length === 0 ? <li className="text-slate-400">No visits yet.</li> : null}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-950">Top pages, 7 days</h2>
          <ul className="mt-3 text-sm">
            {topPages.map(([path, count]) => (
              <li key={path} className="flex justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
                <span className="truncate font-mono text-xs text-slate-700">{path}</span>
                <span className="font-medium text-slate-950">{count}</span>
              </li>
            ))}
            {topPages.length === 0 ? <li className="text-slate-400">No visits yet.</li> : null}
          </ul>
        </div>

        <div className={`${tableWrap} overflow-x-auto`}>
          <table className="min-w-full text-sm">
            <thead className={tableHead}>
              <tr>
                <th className={th}>When</th>
                <th className={th}>Path</th>
                <th className={th}>Device</th>
                <th className={th}>IP</th>
                <th className={th}>Place</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className={tr}>
                  <td className={`${td} whitespace-nowrap text-slate-500`}>
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className={`${td} max-w-[12rem] truncate font-mono text-xs`}>{row.path}</td>
                  <td className={td}>
                    <span className="capitalize">{row.device}</span>
                    <span className="block text-xs text-slate-400">
                      {row.browser} · {row.os}
                    </span>
                  </td>
                  <td className={`${td} font-mono text-xs`}>{row.ip || "—"}</td>
                  <td className={`${td} text-xs text-slate-500`}>
                    {[row.city, row.country].filter(Boolean).join(", ") || "—"}
                  </td>
                </tr>
              ))}
              {!error && recent.length === 0 ? (
                <EmptyRow cols={5}>No visits recorded yet.</EmptyRow>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

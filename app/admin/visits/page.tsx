import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { SetupNotice } from "@/components/admin/IntakeBits";

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Visits</h1>
        <p className="mt-1 text-gray-600">
          First-party page views. Admin routes are not counted. Data stays in our database.
        </p>
      </div>

      <SetupNotice message={error?.message} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Today (UTC)</p>
          <p className="text-3xl font-bold text-gray-900">{todayRes.count || 0}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Last 7 days</p>
          <p className="text-3xl font-bold text-gray-900">{weekRows.length}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Devices (7 days)</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {devices.map(([name, count]) => (
              <li key={name} className="flex justify-between gap-4">
                <span className="capitalize">{name}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
            {devices.length === 0 ? <li className="text-gray-400">No visits yet.</li> : null}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-3 text-lg font-bold text-gray-900">Top pages (7 days)</h2>
          <ul className="space-y-2 text-sm">
            {topPages.map(([path, count]) => (
              <li key={path} className="flex justify-between gap-4 border-b border-gray-50 py-2">
                <span className="truncate font-mono text-gray-800">{path}</span>
                <span className="font-semibold text-gray-900">{count}</span>
              </li>
            ))}
            {topPages.length === 0 ? <li className="text-gray-400">No visits yet.</li> : null}
          </ul>
        </div>

        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Path</th>
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Place</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="max-w-[12rem] truncate px-4 py-3 font-mono text-xs">{row.path}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize">{row.device}</span>
                    <span className="block text-xs text-gray-400">
                      {row.browser} · {row.os}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{row.ip || "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {[row.city, row.country].filter(Boolean).join(", ") || "—"}
                  </td>
                </tr>
              ))}
              {!error && recent.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-gray-500" colSpan={5}>
                    No visits recorded yet. Public page loads send a beacon after you run{" "}
                    <code className="text-xs">scripts/create-site-visits-table.sql</code>.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Need forms and visits together? Run{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-800">
          scripts/APPLY_MADINA_OPS.sql
        </code>{" "}
        in the Madina SQL editor.
      </p>
    </div>
  );
}

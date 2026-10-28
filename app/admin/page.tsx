import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loadOpsAnalytics } from "@/lib/analytics";
import { BarChart, Metric, SplitList, TrendBars } from "@/components/admin/charts";
import { PageHeader, SetupNotice, StatusBadge, nameLink } from "@/components/admin/IntakeBits";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const analytics = await loadOpsAnalytics();
  const queue = [
    { href: "/admin/registrations?status=new", label: "New registrations", value: analytics.queue.registrations },
    { href: "/admin/join?status=new", label: "Join applications", value: analytics.queue.join },
    { href: "/admin/bookings?status=requested", label: "Booking requests", value: analytics.queue.bookings },
    { href: "/admin/messages?status=open", label: "Open messages", value: analytics.queue.messages },
    { href: "/admin/support?status=new", label: "Support offers", value: analytics.queue.support },
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        title="Dashboard"
        description="What needs a decision, then how the community is showing up."
        aside={
          <Link
            href="/admin/impact"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Partner analytics
          </Link>
        }
      />

      <SetupNotice message={analytics.error} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {queue.map((item) => (
          <Metric key={item.href} label={item.label} value={item.value} href={item.href} />
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Metric label="Total signups" value={analytics.signups.total} href="/admin/registrations" />
        <Metric label="Visits today" value={analytics.visits.today} href="/admin/visits" />
        <Metric
          label="Court hours requested"
          value={analytics.court.hoursRequested}
          hint={`${analytics.court.confirmed} confirmed bookings`}
          href="/admin/bookings"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TrendBars title="Signups by week" rows={analytics.signups.weekly} />
        </div>
        <SplitList title="By gender" rows={analytics.signups.genders} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BarChart title="Pipeline" rows={analytics.signups.byStatus} />
        <BarChart title="Areas" rows={analytics.signups.areas} />
        <BarChart title="Skill" rows={analytics.signups.skills} />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-950">Latest registrations</h2>
          <Link href="/admin/registrations" className="text-sm text-slate-500 hover:text-slate-950">
            View all
          </Link>
        </div>
        {analytics.signups.recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">No registrations yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {analytics.signups.recent.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <div>
                  <Link href={`/admin/registrations/${row.id}`} className={nameLink()}>
                    {row.full_name}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {row.area} · <span className="capitalize">{row.skill_level}</span> ·{" "}
                    {new Date(row.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

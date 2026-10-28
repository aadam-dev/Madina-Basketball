import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loadPartnerImpact } from "@/lib/analytics";
import { BarChart, Metric, SplitList } from "@/components/admin/charts";
import { PageHeader, SetupNotice } from "@/components/admin/IntakeBits";

export default async function ImpactPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const report = await loadPartnerImpact();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner analytics"
        description="Aggregate counts for partners. Only confirmed players who accepted impact reporting. No names or phones."
        aside={
          <Link
            href="/api/admin/impact"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Download CSV
          </Link>
        }
      />
      <SetupNotice message={report.error} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Confirmed players" value={report.players.confirmed} />
        <Metric label="New this month" value={report.players.newThisMonth} />
        <Metric label="Upcoming events" value={report.community.upcomingEvents} />
        <Metric label="Cash received (GHS)" value={report.gifts.cashReceived.toLocaleString()} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SplitList title="Age bands" rows={report.players.ages} empty="Confirm players to build this chart." />
        <SplitList title="Gender" rows={report.players.genders} empty="Confirm players to build this chart." />
        <BarChart title="Skill" rows={report.players.skills} empty="Confirm players to build this chart." />
        <BarChart title="Areas" rows={report.players.areas} empty="Confirm players to build this chart." />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BarChart title="Interests" rows={report.players.interests} />
        <BarChart title="Court purpose" rows={report.court.byPurpose} />
        <BarChart title="Gifts received" rows={report.gifts.receivedByKind} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Court hours requested" value={report.court.hoursRequested} />
        <Metric label="Upcoming confirmed bookings" value={report.court.upcomingConfirmed} />
        <Metric label="Volunteer messages" value={report.community.volunteers} />
      </div>
    </div>
  );
}

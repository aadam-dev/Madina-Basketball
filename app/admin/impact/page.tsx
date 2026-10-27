import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loadImpact } from "@/lib/impact";

function Block({ title, rows }: { title: string; rows: [string, string | number][] }) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
            <dd className="text-xl font-semibold text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function pairs(record: Record<string, number>): [string, number][] {
  const entries = Object.entries(record);
  return entries.length ? entries : [["None yet", 0]];
}

export default async function ImpactPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const report = await loadImpact();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Impact</h1>
          <p className="text-gray-600">Counts you can hand to a partner. No names, phones, or medical notes.</p>
        </div>
        <Link href="/api/admin/impact" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
          Download CSV
        </Link>
      </div>
      {report.error ? (
        <p className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          Some tables are missing. Run scripts/create-operations-tables.sql in Supabase. {report.error}
        </p>
      ) : null}
      <Block
        title="Players"
        rows={[
          ["Confirmed, with impact agreement", report.players.confirmed],
          ["New this month", report.players.newThisMonth],
          ...pairs(report.players.ages),
          ...pairs(report.players.genders),
          ...pairs(report.players.skills),
          ...pairs(report.players.areas),
          ...pairs(report.players.interests),
        ]}
      />
      <Block
        title="Court use"
        rows={[
          ["Hours requested", report.court.hoursRequested],
          ["Upcoming confirmed bookings", report.court.upcomingConfirmed],
          ...pairs(report.court.byPurpose),
        ]}
      />
      <Block
        title="Community operations"
        rows={[
          ["Volunteer messages", report.community.volunteers],
          ["Upcoming events", report.community.upcomingEvents],
          ["Past events", report.community.pastEvents],
          ...pairs(report.community.messagesBySubject),
        ]}
      />
      <Block
        title="Gifts received"
        rows={[
          ["Cash received (GHS)", report.gifts.cashReceived],
          ["In-kind gifts", report.gifts.inKindCount],
          ["Open offers, not yet received", report.gifts.openOffers],
          ...pairs(report.gifts.receivedByKind),
        ]}
      />
    </div>
  );
}

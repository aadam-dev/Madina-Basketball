import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loadImpact } from "@/lib/impact";
import { PageHeader } from "@/components/admin/IntakeBits";

function Block({ title, rows }: { title: string; rows: [string, string | number][] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-sm font-semibold text-slate-950">{title}</h2>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 px-4 py-3">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</dt>
            <dd className="mt-1 text-lg font-semibold tracking-tight text-slate-950">{value}</dd>
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
    <div className="max-w-5xl space-y-5">
      <PageHeader
        title="Impact"
        description="Counts you can hand to a partner. No names, phones, or medical notes."
        aside={
          <Link href="/api/admin/impact" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Download CSV
          </Link>
        }
      />
      {report.error ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Some tables could not be read. {report.error}
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

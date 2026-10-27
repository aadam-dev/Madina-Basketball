import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Fact } from "@/components/admin/IntakeBits";
import { ReviewForm } from "@/components/admin/ReviewForm";

export default async function BookingDetail({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { data: row } = await supabaseAdmin.from("court_bookings").select("*").eq("id", params.id).single();
  if (!row) notFound();

  const { data: clashes } = await supabaseAdmin
    .from("court_bookings")
    .select("id, name")
    .eq("booking_date", row.booking_date)
    .eq("time_slot", row.time_slot)
    .eq("status", "confirmed")
    .neq("id", row.id);

  const consents = Array.isArray(row.consents) ? row.consents : [];

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/bookings" className="text-sm font-medium text-slate-500 hover:text-slate-950">Back to bookings</Link>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{row.name}</h1>
      {(clashes || []).length > 0 ? (
        <p className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          Another confirmed booking already uses this date and slot: {(clashes || []).map((item) => item.name).join(", ")}.
        </p>
      ) : null}
      <dl className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 sm:p-5">
        <Fact label="Phone" value={row.phone} />
        <Fact label="Email" value={row.email} />
        <Fact label="Organisation" value={row.organisation} />
        <Fact label="Date" value={row.booking_date} />
        <Fact label="Time slot" value={row.time_slot} />
        <Fact label="Duration" value={row.duration} />
        <Fact label="Purpose" value={row.purpose} />
        <Fact label="Participants" value={row.participants} />
        <Fact label="Details" value={row.details} />
        <Fact label="Agreements" value={consents.map((item: { key: string; accepted: boolean; policy_version?: string }) => `${item.key}: ${item.accepted ? "accepted" : "declined"} (${item.policy_version || ""})`).join("\n")} />
      </dl>
      <ReviewForm
        endpoint={`/api/admin/bookings/${row.id}`}
        status={row.status}
        notes={row.admin_notes}
        options={[
          { value: "requested", label: "Requested" },
          { value: "confirmed", label: "Confirmed" },
          { value: "declined", label: "Declined" },
          { value: "cancelled", label: "Cancelled" },
        ]}
      />
    </div>
  );
}

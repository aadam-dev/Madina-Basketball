import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { EmptyRow, FilterLinks, PageHeader, SetupNotice, StatusBadge, nameLink, tableHead, tableWrap, td, th, tr } from "@/components/admin/IntakeBits";

const STATUSES = [
  { value: "requested", label: "Requested" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function BookingsPage({ searchParams }: { searchParams: { status?: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let query = supabaseAdmin
    .from("court_bookings")
    .select("id, name, booking_date, time_slot, purpose, status")
    .order("booking_date", { ascending: true })
    .limit(200);
  if (searchParams.status) query = query.eq("status", searchParams.status);
  const { data, error } = await query;

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Requests stay unconfirmed until you accept them. A clash warning appears on the booking."
      />
      <FilterLinks base="/admin/bookings" current={searchParams.status} options={STATUSES} />
      <SetupNotice message={error?.message} />
      <div className={`${tableWrap} overflow-x-auto`}>
        <table className="min-w-full text-sm">
          <thead className={tableHead}>
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Date</th>
              <th className={th}>Slot</th>
              <th className={th}>Purpose</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className={tr}>
                <td className={td}>
                  <Link href={`/admin/bookings/${row.id}`} className={nameLink()}>{row.name}</Link>
                </td>
                <td className={td}>{row.booking_date}</td>
                <td className={td}>{row.time_slot}</td>
                <td className={td}>{row.purpose}</td>
                <td className={td}><StatusBadge status={row.status} /></td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? <EmptyRow cols={5}>No bookings yet.</EmptyRow> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { FilterLinks, SetupNotice } from "@/components/admin/IntakeBits";

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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
      <p className="text-gray-600 mb-6">Requests stay unconfirmed until you accept them. A clash warning appears on the booking.</p>
      <FilterLinks base="/admin/bookings" current={searchParams.status} options={STATUSES} />
      <SetupNotice message={error?.message} />
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <Link href={`/admin/bookings/${row.id}`} className="font-medium text-primary hover:underline">{row.name}</Link>
                </td>
                <td className="px-4 py-3">{row.booking_date}</td>
                <td className="px-4 py-3">{row.time_slot}</td>
                <td className="px-4 py-3">{row.purpose}</td>
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? (
              <tr><td className="px-4 py-8 text-gray-500" colSpan={5}>No bookings yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

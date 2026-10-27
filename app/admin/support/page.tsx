import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { FilterLinks, SetupNotice } from "@/components/admin/IntakeBits";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "in_conversation", label: "In conversation" },
  { value: "pledged", label: "Pledged" },
  { value: "received", label: "Received" },
  { value: "declined", label: "Declined" },
];

export default async function SupportAdminPage({ searchParams }: { searchParams: { status?: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let query = supabaseAdmin
    .from("support_offers")
    .select("id, name, organisation, kinds, status, cash_received, recognize_publicly, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (searchParams.status) query = query.eq("status", searchParams.status);
  const { data, error } = await query;

  const receivedCash = (data || [])
    .filter((row) => row.status === "received")
    .reduce((sum, row) => sum + Number(row.cash_received || 0), 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Support</h1>
      <p className="text-gray-600 mb-2">Offers from the public invitation. Received cash on this page is not part of the GHS 44,750 renovation total.</p>
      <p className="text-sm text-gray-500 mb-6">Cash marked received in this filtered list: GHS {receivedCash.toLocaleString()}. Pledges are not included.</p>
      <FilterLinks base="/admin/support" current={searchParams.status} options={STATUSES} />
      <SetupNotice message={error?.message} />
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Recognition</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <Link href={`/admin/support/${row.id}`} className="font-medium text-primary hover:underline">{row.name}</Link>
                  {row.organisation ? <div className="text-xs text-gray-500">{row.organisation}</div> : null}
                </td>
                <td className="px-4 py-3">{(row.kinds || []).join(", ")}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">{row.recognize_publicly ? "Allowed after receipt" : "Private"}</td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? (
              <tr><td className="px-4 py-8 text-gray-500" colSpan={4}>No offers yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { FilterLinks, SetupNotice } from "@/components/admin/IntakeBits";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "waitlist", label: "Waitlist" },
  { value: "inactive", label: "Inactive" },
];

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let query = supabaseAdmin
    .from("player_registrations")
    .select("id, full_name, phone, status, area, skill_level, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (searchParams.status) query = query.eq("status", searchParams.status);
  const { data, error } = await query;
  const phones = new Map<string, number>();
  for (const row of data || []) phones.set(row.phone, (phones.get(row.phone) || 0) + 1);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrations</h1>
      <p className="text-gray-600 mb-6">Community players. Confirming someone does not publish them on the public roster.</p>
      <FilterLinks base="/admin/registrations" current={searchParams.status} options={STATUSES} />
      <SetupNotice message={error?.message} />
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Skill</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <Link href={`/admin/registrations/${row.id}`} className="font-medium text-primary hover:underline">{row.full_name}</Link>
                  {(phones.get(row.phone) || 0) > 1 ? (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Same phone</span>
                  ) : null}
                </td>
                <td className="px-4 py-3">{row.phone}</td>
                <td className="px-4 py-3">{row.area}</td>
                <td className="px-4 py-3">{row.skill_level}</td>
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? (
              <tr><td className="px-4 py-8 text-gray-500" colSpan={5}>No registrations yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

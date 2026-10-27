import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { FilterLinks, SetupNotice } from "@/components/admin/IntakeBits";

const STATUSES = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "closed", label: "Closed" },
];

export default async function MessagesPage({ searchParams }: { searchParams: { status?: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let query = supabaseAdmin
    .from("contact_messages")
    .select("id, name, subject, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (searchParams.status) query = query.eq("status", searchParams.status);
  const { data, error } = await query;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
      <p className="text-gray-600 mb-6">Contact and volunteer notes. Sponsorship offers live under Support.</p>
      <FilterLinks base="/admin/messages" current={searchParams.status} options={STATUSES} />
      <SetupNotice message={error?.message} />
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <Link href={`/admin/messages/${row.id}`} className="font-medium text-primary hover:underline">{row.name}</Link>
                </td>
                <td className="px-4 py-3">{row.subject}</td>
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            ))}
            {!error && (data || []).length === 0 ? (
              <tr><td className="px-4 py-8 text-gray-500" colSpan={3}>No messages yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

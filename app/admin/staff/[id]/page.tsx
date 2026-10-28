import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PageHeader } from "@/components/admin/IntakeBits";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default async function EditStaffPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { data: member } = await supabaseAdmin.from("team_members").select("*").eq("id", params.id).single();
  if (!member) notFound();

  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/admin/staff" className="text-sm font-medium text-slate-500 hover:text-slate-950">
        Back to staff
      </Link>
      <PageHeader title={member.name} description="Edit public team profile." />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <TeamMemberForm memberId={member.id} initialData={member} />
      </div>
    </div>
  );
}

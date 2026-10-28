import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/admin/IntakeBits";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default async function NewStaffPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/admin/staff" className="text-sm font-medium text-slate-500 hover:text-slate-950">
        Back to staff
      </Link>
      <PageHeader title="Add staff" description="Shown on the public team page." />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <TeamMemberForm />
      </div>
    </div>
  );
}

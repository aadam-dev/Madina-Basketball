import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/admin/IntakeBits";
import { PlayerForm } from "@/components/admin/PlayerForm";

export default async function NewPlayerPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/admin/players" className="text-sm font-medium text-slate-500 hover:text-slate-950">
        Back to roster
      </Link>
      <PageHeader title="Add player" description="Adds someone to the public roster." />
      <PlayerForm />
    </div>
  );
}

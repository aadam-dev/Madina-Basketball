import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PageHeader } from "@/components/admin/IntakeBits";
import { PlayerForm } from "@/components/admin/PlayerForm";
import { DeletePlayerButton } from "@/components/admin/DeletePlayerButton";

export default async function EditPlayerPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { data: player } = await supabaseAdmin.from("players").select("*").eq("id", params.id).single();
  if (!player) notFound();

  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/admin/players" className="text-sm font-medium text-slate-500 hover:text-slate-950">
        Back to roster
      </Link>
      <PageHeader
        title={player.name}
        description="Edit public roster details."
        aside={<DeletePlayerButton id={player.id} name={player.name} />}
      />
      <PlayerForm initial={player} />
    </div>
  );
}

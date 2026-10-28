"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePlayerButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (!confirm(`Remove ${name} from the roster?`)) return;
    setPending(true);
    const response = await fetch(`/api/players/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setPending(false);
      alert("Could not delete player.");
      return;
    }
    router.push("/admin/players");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="rounded-full px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}

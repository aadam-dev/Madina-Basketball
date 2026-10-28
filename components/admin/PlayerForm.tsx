"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Player = {
  id?: string;
  name?: string;
  jersey_number?: string | null;
  position?: string | null;
  team?: string | null;
  bio?: string | null;
  image_url?: string | null;
  height?: string | null;
  date_of_birth?: string | null;
  is_featured?: boolean | null;
  display_order?: number | null;
};

export function PlayerForm({ initial }: { initial?: Player }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name || "",
    jersey_number: initial?.jersey_number || "",
    position: initial?.position || "",
    team: initial?.team || "",
    bio: initial?.bio || "",
    image_url: initial?.image_url || "",
    height: initial?.height || "",
    date_of_birth: initial?.date_of_birth || "",
    is_featured: Boolean(initial?.is_featured),
    display_order: String(initial?.display_order ?? 0),
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("bucket", "team");
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      set("image_url", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const endpoint = initial?.id ? `/api/players/${initial.id}` : "/api/players";
      const response = await fetch(endpoint, {
        method: initial?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          display_order: Number(form.display_order) || 0,
          date_of_birth: form.date_of_birth || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save");
      router.push("/admin/players");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
      setPending(false);
    }
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400";

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <label className="block text-sm font-medium text-slate-700">
        Name
        <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} required />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Jersey
          <input className={field} value={form.jersey_number} onChange={(e) => set("jersey_number", e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Position
          <input className={field} value={form.position} onChange={(e) => set("position", e.target.value)} placeholder="PG, SG, SF…" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Team
          <input className={field} value={form.team} onChange={(e) => set("team", e.target.value)} placeholder="Zurak" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Height
          <input className={field} value={form.height} onChange={(e) => set("height", e.target.value)} />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        Bio
        <textarea className={`${field} min-h-24`} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Birthday
          <input type="date" className={field} value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Display order
          <input className={field} value={form.display_order} onChange={(e) => set("display_order", e.target.value)} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
        Featured on site
      </label>
      <div>
        <p className="text-sm font-medium text-slate-700">Photo</p>
        {form.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image_url} alt="" className="mt-2 h-24 w-24 rounded-xl object-cover" />
        ) : null}
        <input type="file" accept="image/*" className="mt-2 text-sm" onChange={onUpload} disabled={uploading} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={pending || uploading}
        className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save player"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";

type Receipt = {
  status: string;
  admin_notes: string | null;
  received_on: string | null;
  received_summary: string | null;
  cash_received: number | null;
  in_kind_description: string | null;
  quantity_received: number | null;
  estimated_value: number | null;
};

export function SupportReview({ endpoint, initial }: { endpoint: string; initial: Receipt }) {
  const [form, setForm] = useState({
    status: initial.status,
    admin_notes: initial.admin_notes || "",
    received_on: initial.received_on || "",
    received_summary: initial.received_summary || "",
    cash_received: initial.cash_received?.toString() || "",
    in_kind_description: initial.in_kind_description || "",
    quantity_received: initial.quantity_received?.toString() || "",
    estimated_value: initial.estimated_value?.toString() || "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    setFieldErrors({});
    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setFieldErrors(data.fieldErrors || {});
        setError(data.error || "Could not save.");
        return;
      }
      setMessage("Saved.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={save} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Account for this offer</h2>
      <p className="text-sm text-gray-600">
        Only gifts marked received count. This book is separate from the GHS 44,750 renovation total.
      </p>
      <label className="block text-sm font-medium text-gray-700">
        Status
        <select className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={form.status} onChange={(event) => set("status", event.target.value)}>
          <option value="new">New</option>
          <option value="in_conversation">In conversation</option>
          <option value="pledged">Pledged</option>
          <option value="received">Received</option>
          <option value="declined">Declined</option>
        </select>
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Date received
        <input type="date" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={form.received_on} onChange={(event) => set("received_on", event.target.value)} />
        {fieldErrors.received_on ? <span className="text-xs text-red-600">{fieldErrors.received_on}</span> : null}
      </label>
      <label className="block text-sm font-medium text-gray-700">
        What arrived
        <textarea className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 min-h-20" value={form.received_summary} onChange={(event) => set("received_summary", event.target.value)} />
        {fieldErrors.received_summary ? <span className="text-xs text-red-600">{fieldErrors.received_summary}</span> : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          Cash received (GHS)
          <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={form.cash_received} onChange={(event) => set("cash_received", event.target.value)} />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Quantity received
          <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={form.quantity_received} onChange={(event) => set("quantity_received", event.target.value)} />
        </label>
      </div>
      <label className="block text-sm font-medium text-gray-700">
        In-kind description
        <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={form.in_kind_description} onChange={(event) => set("in_kind_description", event.target.value)} />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Estimated value (GHS, optional)
        <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={form.estimated_value} onChange={(event) => set("estimated_value", event.target.value)} />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Notes
        <textarea className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 min-h-20" value={form.admin_notes} onChange={(event) => set("admin_notes", event.target.value)} />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      <button type="submit" disabled={pending} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

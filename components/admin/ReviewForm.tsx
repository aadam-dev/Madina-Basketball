"use client";

import { useState } from "react";

export function ReviewForm({
  endpoint,
  status,
  notes,
  options,
}: {
  endpoint: string;
  status: string;
  notes: string | null;
  options: { value: string; label: string }[];
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [adminNotes, setAdminNotes] = useState(notes || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus, admin_notes: adminNotes }),
      });
      const data = await response.json();
      if (!response.ok) {
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
      <h2 className="text-lg font-bold text-gray-900">Review</h2>
      <label className="block text-sm font-medium text-gray-700">
        Status
        <select
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          value={currentStatus}
          onChange={(event) => setCurrentStatus(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Notes
        <textarea
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 min-h-24"
          value={adminNotes}
          onChange={(event) => setAdminNotes(event.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      <button type="submit" disabled={pending} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

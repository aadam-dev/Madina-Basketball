"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export type ProfileData = {
  id: string;
  full_name: string;
  status: string;
  date_of_birth: string | null;
  age: number | null;
  gender: string | null;
  phone: string;
  email: string | null;
  area: string;
  skill_level: string;
  interests: string[];
  emergency_name: string;
  emergency_relationship: string;
  emergency_phone: string;
  guardian_name: string | null;
  guardian_relationship: string | null;
  guardian_phone: string | null;
  medical_notes: string | null;
  photo_consent: boolean;
  created_at: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function InterestChip({ label }: { label: string }) {
  const text =
    label === "girls_women"
      ? "Girls / women sessions"
      : label[0].toUpperCase() + label.slice(1);
  return (
    <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
      {text}
    </span>
  );
}

export function RegistrationProfilePdf({ profile }: { profile: ProfileData }) {
  const courtRef = useRef<HTMLDivElement>(null);
  const staffRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function exportPdf() {
    if (!courtRef.current || !staffRef.current) return;
    setBusy(true);
    setError("");
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const margin = 12;
      const pageWidth = 210 - margin * 2;

      const courtCanvas = await html2canvas(courtRef.current, {
        scale: 2,
        backgroundColor: "#0a0a0a",
        useCORS: true,
      });
      const courtImg = courtCanvas.toDataURL("image/png");
      const courtHeight = (courtCanvas.height * pageWidth) / courtCanvas.width;
      pdf.addImage(courtImg, "PNG", margin, margin, pageWidth, courtHeight);

      pdf.addPage();
      const staffCanvas = await html2canvas(staffRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const staffImg = staffCanvas.toDataURL("image/png");
      const staffHeight = (staffCanvas.height * pageWidth) / staffCanvas.width;
      pdf.addImage(staffImg, "PNG", margin, margin, pageWidth, Math.min(staffHeight, 270));

      const safeName = profile.full_name.replace(/[^\w\-]+/g, "_").slice(0, 40);
      pdf.save(`madina-profile-${safeName}.pdf`);
    } catch (err) {
      console.error(err);
      setError("Could not build the PDF. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void exportPdf()}
          disabled={busy}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {busy ? "Building PDF…" : "Export profile PDF"}
        </button>
        <p className="text-sm text-gray-500">
          Two pages: court card (no private contacts) and staff sheet (emergency and medical).
        </p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {/* Off-screen render targets for capture */}
      <div className="pointer-events-none fixed left-[-10000px] top-0" aria-hidden="true">
        <div
          ref={courtRef}
          className="relative w-[720px] overflow-hidden rounded-2xl bg-[#0a0a0a] p-10 text-white"
          style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,107,53,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.12) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ff6b35]/20 blur-2xl" />
          <div className="relative">
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff6b35]">
                  Madina Basketball
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-tight">{profile.full_name}</h1>
                <p className="mt-2 text-sm text-white/55">
                  Player profile · {profile.status}
                  {profile.age !== null ? ` · age ${profile.age}` : ""}
                </p>
              </div>
              <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-[#ff6b35] bg-gradient-to-br from-[#ff6b35] to-[#004e89] text-3xl font-black">
                {initials(profile.full_name) || "MB"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Area</p>
                <p className="mt-1 text-lg font-semibold">{profile.area}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Skill</p>
                <p className="mt-1 text-lg font-semibold capitalize">{profile.skill_level}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Born</p>
                <p className="mt-1 text-lg font-semibold">{profile.date_of_birth || "Not given"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Gender</p>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {profile.gender ? profile.gender.replace(/_/g, " ") : "Not shared"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">How they play</p>
              <div className="flex flex-wrap gap-2">
                {(profile.interests || []).map((interest) => (
                  <InterestChip key={interest} label={interest} />
                ))}
              </div>
            </div>

            <div className="mt-10 flex items-end justify-between border-t border-white/10 pt-4 text-[11px] text-white/40">
              <span>Libya Quarters · Madina · Accra</span>
              <span>Photo consent: {profile.photo_consent ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        <div
          ref={staffRef}
          className="mt-8 w-[720px] rounded-2xl border border-gray-200 bg-white p-10 text-gray-900"
          style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff6b35]">Staff only</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight">{profile.full_name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Private contacts for coaches and court admins. Do not post or share publicly.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</p>
              <p className="mt-1 text-lg font-semibold">{profile.phone}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</p>
              <p className="mt-1 text-lg font-semibold">{profile.email || "—"}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Emergency contact</p>
              <p className="mt-1 text-lg font-semibold">
                {profile.emergency_name} · {profile.emergency_relationship}
              </p>
              <p className="text-gray-700">{profile.emergency_phone}</p>
            </div>
            {profile.guardian_name ? (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Guardian</p>
                <p className="mt-1 text-lg font-semibold">
                  {profile.guardian_name}
                  {profile.guardian_relationship ? ` · ${profile.guardian_relationship}` : ""}
                </p>
                <p className="text-gray-700">{profile.guardian_phone}</p>
              </div>
            ) : null}
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">Medical note</p>
              <p className="mt-1 whitespace-pre-wrap text-base leading-relaxed text-gray-800">
                {profile.medical_notes || "None recorded"}
              </p>
            </div>
          </div>

          <p className="mt-8 text-[11px] text-gray-400">
            Registered {new Date(profile.created_at).toLocaleDateString()} · ID {profile.id.slice(0, 8)}
          </p>
        </div>
      </div>
    </div>
  );
}

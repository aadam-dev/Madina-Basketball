/**
 * One-shot: treat imported Google Form rows as normal platform signups.
 * Merges Phoebe duplicate, clears sentinel DOBs, strips migration tags.
 *
 *   node --env-file=.env.local scripts/cleanup-imported-registrations.mjs
 */
import { createClient } from "@supabase/supabase-js";

const POLICY = "2026-10";
const PHOEBE_KEEP = "484c9388-41a3-4c53-b909-07b80b3b7c37";
const PHOEBE_DROP = "ae9f304a-ee33-4038-b018-3ed9c929160a";

function lineValue(notes, label) {
  if (!notes) return "";
  const re = new RegExp(`^${label}:\\s*(.+)$`, "im");
  const match = notes.match(re);
  return match ? match[1].trim() : "";
}

function cleanNotes(notes, extraPlayerNote = "") {
  const lines = [];
  const nick = lineValue(notes, "Nickname");
  const position = lineValue(notes, "Position");
  const jersey = lineValue(notes, "Jersey");
  const team = lineValue(notes, "Team affiliation");
  const days = lineValue(notes, "Available days");
  const times = lineValue(notes, "Available times");
  const playerNotes = lineValue(notes, "Player notes") || extraPlayerNote;

  if (nick) lines.push(`Nickname: ${nick}`);
  if (position) lines.push(`Position: ${position}`);
  if (jersey) lines.push(`Jersey: ${jersey}`);
  if (team && !/^no$/i.test(team)) lines.push(`Team: ${team.replace(/^Yes\s*[—-]\s*/i, "")}`);
  if (days) lines.push(`Available: ${days}${times ? ` · ${times}` : ""}`);
  else if (times) lines.push(`Available: ${times}`);
  if (playerNotes) lines.push(playerNotes);
  return lines.length ? lines.join("\n") : null;
}

function cleanConsents(consents, createdAt, photoConsent) {
  const acceptedAt =
    (Array.isArray(consents) && consents.find((c) => c.accepted_at)?.accepted_at) || createdAt;
  return [
    { key: "rules", required: true, accepted: true, policy_version: POLICY, accepted_at: acceptedAt },
    { key: "privacy", required: true, accepted: true, policy_version: POLICY, accepted_at: acceptedAt },
    { key: "impact", required: true, accepted: true, policy_version: POLICY, accepted_at: acceptedAt },
    {
      key: "photo",
      required: false,
      accepted: Boolean(photoConsent),
      policy_version: POLICY,
      accepted_at: acceptedAt,
    },
  ];
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data: rows, error } = await supabase.from("player_registrations").select("*");
  if (error) throw error;

  const phoebeOld = rows.find((r) => r.id === PHOEBE_DROP);
  const schedulingNote = phoebeOld ? lineValue(phoebeOld.admin_notes, "Player notes") : "";

  let updated = 0;
  for (const row of rows) {
    if (row.id === PHOEBE_DROP) continue;

    const dob = row.date_of_birth === "1900-01-01" ? null : row.date_of_birth;
    const extra = row.id === PHOEBE_KEEP && schedulingNote
      ? `Earlier note: ${schedulingNote}`
      : "";
    const patch = {
      date_of_birth: dob,
      consents: cleanConsents(row.consents, row.created_at, row.photo_consent),
      admin_notes: cleanNotes(row.admin_notes, extra),
    };

    const { error: updateError } = await supabase
      .from("player_registrations")
      .update(patch)
      .eq("id", row.id);
    if (updateError) throw updateError;
    updated += 1;
    console.log("cleaned", row.full_name);
  }

  const { error: deleteError } = await supabase
    .from("player_registrations")
    .delete()
    .eq("id", PHOEBE_DROP);
  if (deleteError) throw deleteError;
  console.log("deleted duplicate Phoebe", PHOEBE_DROP);
  console.log(`Done. Updated ${updated}, remaining should be ${rows.length - 1}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

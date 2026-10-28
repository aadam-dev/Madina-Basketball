/**
 * Import Google Form player registrations as normal platform signups.
 *
 *   node --env-file=.env.local scripts/migrate-google-player-registrations.mjs [csvPath]
 *
 * Skips a phone that already exists. Writes clean consents/notes (no migration tags).
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_CSV =
  "/Users/aadam/Downloads/Madina Basketball Court — Player Registration.csv";
const POLICY = "2026-10";

const GENDER_BY_FULL_NAME = {
  phoebe: "woman",
  "phoebe owusu": "woman",
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && next === "\n") i++;
      row.push(field);
      if (row.some((cell) => cell.length)) rows.push(row);
      row = [];
      field = "";
      continue;
    }
    field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.length)) rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (cells[idx] ?? "").trim();
    });
    return obj;
  });
}

function get(row, ...keys) {
  for (const key of keys) {
    if (row[key] != null && String(row[key]).trim() !== "") return String(row[key]).trim();
  }
  for (const key of Object.keys(row)) {
    for (const want of keys) {
      if (key.trim() === want.trim() && String(row[key]).trim() !== "") {
        return String(row[key]).trim();
      }
    }
  }
  return "";
}

function parseGoogleTimestamp(raw) {
  const m = raw.match(
    /^(\d{4})\/(\d{2})\/(\d{2})\s+(\d{1,2}):(\d{2}):(\d{2})\s+(AM|PM)\s+GMT$/i
  );
  if (!m) throw new Error(`Bad timestamp: ${raw}`);
  let hour = Number(m[4]);
  const minute = Number(m[5]);
  const second = Number(m[6]);
  const ampm = m[7].toUpperCase();
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return `${m[1]}-${m[2]}-${m[3]}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}.000Z`;
}

function normalizeGhanaPhone(input) {
  if (!input) return null;
  const compact = String(input).replace(/[\s\-().]/g, "");
  if (!compact) return null;
  let local = compact;
  if (local.startsWith("+233")) local = local.slice(4);
  else if (local.startsWith("233") && local.length === 12) local = local.slice(3);
  else if (local.startsWith("0")) local = local.slice(1);
  if (/^[235]\d{9}$/.test(local)) {
    const trimmed = local.slice(0, 9);
    if (/^[235]\d{8}$/.test(trimmed)) local = trimmed;
  }
  if (!/^[235]\d{8}$/.test(local)) return null;
  return `+233${local}`;
}

function looksLikePhone(value) {
  return /^[+0-9][\d\s\-().]{7,}$/.test(value) && /\d{8,}/.test(value.replace(/\D/g, ""));
}

function mapArea(raw) {
  const text = raw.trim();
  const lower = text.toLowerCase();
  if (!text) return { area: "Other", area_other: null };
  if (lower.includes("libya")) return { area: "Libya Quarters", area_other: null };
  if (lower.includes("madina") || lower === "sda") {
    return { area: "Madina", area_other: text === "Madina" ? null : text };
  }
  const nearby = ["north legon", "pantang", "haatso", "agbobga", "agbogba", "upsa", "university of ghana", "un"];
  if (nearby.some((n) => lower.includes(n) || lower === n)) {
    return { area: "Nearby community", area_other: text };
  }
  return { area: "Other", area_other: text };
}

function mapSkill(playStyle) {
  if (/actively/i.test(playStyle)) return "advanced";
  if (/casual/i.test(playStyle)) return "intermediate";
  return "beginner";
}

function mapInterests(involvement, playStyle, gender) {
  const set = new Set();
  const text = involvement || "";
  if (/regular games/i.test(text)) set.add("pickup");
  if (/training/i.test(text)) set.add("training");
  if (/actively/i.test(playStyle)) set.add("competitive");
  if (gender === "woman") set.add("girls_women");
  if (!set.size) set.add("pickup");
  return [...set];
}

function mapGender(fullName) {
  const key = fullName.trim().toLowerCase().replace(/\s+/g, " ");
  return GENDER_BY_FULL_NAME[key] || "man";
}

function profileNotes(row) {
  const lines = [];
  const nick = get(row, "Nickname / Preferred Name");
  const position = get(row, "Primary Playing Position");
  const jersey = get(row, "Jersey Number (if any)");
  const teams = get(row, "If yes, what team(s)");
  const teamAff = get(row, "Do you play with a specific team? (Team Affiliation)");
  const days = get(row, "Available Days ", "Available Days");
  const times = get(row, "Available Times");
  const playerNotes = get(row, "Additional Notes or Concerns (if any)");

  if (nick) lines.push(`Nickname: ${nick}`);
  if (position) lines.push(`Position: ${position}`);
  if (jersey) lines.push(`Jersey: ${jersey}`);
  if (/^yes$/i.test(teamAff) && teams) lines.push(`Team: ${teams}`);
  if (days || times) lines.push(`Available: ${[days, times].filter(Boolean).join(" · ")}`);
  if (playerNotes) lines.push(playerNotes);
  return lines.length ? lines.join("\n") : null;
}

function mapRow(row) {
  const rawTimestamp = get(row, "Timestamp");
  const createdAt = parseGoogleTimestamp(rawTimestamp);
  const fullName = get(row, "Full Name");
  const email = get(row, "Username").toLowerCase() || null;
  const phone = normalizeGhanaPhone(get(row, "Phone Number"));
  if (!phone) throw new Error(`Bad player phone for ${fullName}`);

  const dobRaw = get(row, "Date of Birth ", "Date of Birth");
  const date_of_birth = /^\d{4}-\d{2}-\d{2}$/.test(dobRaw) ? dobRaw : null;
  const gender = mapGender(fullName);
  const { area, area_other } = mapArea(get(row, "Residential Area / Location"));
  const playStyle = get(row, "Do you play actively or casually?");
  const involvement = get(row, "Which would you like to be involved in");

  let emergencyName = get(row, "Emergency Contact Name");
  let emergencyPhoneRaw = get(row, "Emergency Contact Number");
  if (emergencyName && looksLikePhone(emergencyName) && !emergencyPhoneRaw) {
    emergencyPhoneRaw = emergencyName;
    emergencyName = "";
  } else if (emergencyName && looksLikePhone(emergencyName)) {
    emergencyName = "";
  }
  let emergency_phone = normalizeGhanaPhone(emergencyPhoneRaw) || phone;
  if (!emergencyName) emergencyName = "Not provided";

  const photo = Boolean(get(row, "Upload a recent picture of you (headshot)"));
  const consents = [
    { key: "rules", required: true, accepted: true, policy_version: POLICY, accepted_at: createdAt },
    { key: "privacy", required: true, accepted: true, policy_version: POLICY, accepted_at: createdAt },
    { key: "impact", required: true, accepted: true, policy_version: POLICY, accepted_at: createdAt },
    { key: "photo", required: false, accepted: photo, policy_version: POLICY, accepted_at: createdAt },
  ];

  return {
    status: "new",
    full_name: fullName,
    date_of_birth,
    gender,
    phone,
    email,
    area,
    area_other,
    skill_level: mapSkill(playStyle),
    interests: mapInterests(involvement, playStyle, gender),
    heard_from: null,
    emergency_name: emergencyName,
    emergency_relationship: "other",
    emergency_phone,
    guardian_name: null,
    guardian_relationship: null,
    guardian_phone: null,
    guardian_consent: false,
    medical_notes: null,
    photo_consent: photo,
    consents,
    admin_notes: profileNotes(row),
    created_at: createdAt,
  };
}

async function main() {
  const csvPath = path.resolve(process.argv[2] || DEFAULT_CSV);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");
  if (!fs.existsSync(csvPath)) throw new Error(`CSV not found: ${csvPath}`);

  const mapped = parseCsv(fs.readFileSync(csvPath, "utf8")).map(mapRow);
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data: existing, error: existingError } = await supabase
    .from("player_registrations")
    .select("phone");
  if (existingError) throw existingError;
  const phones = new Set((existing || []).map((r) => r.phone));

  const toInsert = [];
  for (const row of mapped) {
    if (phones.has(row.phone)) {
      console.log("Skip existing phone:", row.phone, row.full_name);
      continue;
    }
    phones.add(row.phone);
    toInsert.push(row);
  }

  if (!toInsert.length) {
    console.log("Nothing new to insert.");
    return;
  }

  const { data, error } = await supabase
    .from("player_registrations")
    .insert(toInsert)
    .select("id, full_name, gender, date_of_birth, created_at, phone");
  if (error) throw error;
  console.log(`Inserted ${data.length}`);
  for (const row of data) {
    console.log(`  ${row.created_at} | ${row.full_name} | ${row.gender} | ${row.date_of_birth || "no DOB"}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

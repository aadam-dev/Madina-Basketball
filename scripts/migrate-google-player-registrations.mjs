/**
 * One-shot import of Google Form player registrations into player_registrations.
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-google-player-registrations.mjs [csvPath]
 *
 * Idempotent: skips rows whose consents JSON already carries the same google_form_timestamp.
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_CSV =
  "/Users/aadam/Downloads/Madina Basketball Court — Player Registration.csv";

const POLICY = "google-forms-legacy-2025";

/** Google Form did not collect gender. Inferred only where names are clear. */
const GENDER_BY_FULL_NAME = {
  "phoebe": "woman",
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
  // Tolerate trailing spaces in Google headers
  for (const key of Object.keys(row)) {
    for (const want of keys) {
      if (key.trim() === want.trim() && String(row[key]).trim() !== "") {
        return String(row[key]).trim();
      }
    }
  }
  return "";
}

/** Parse "2025/07/02 12:30:33 AM GMT" → ISO UTC. */
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
  const iso = `${m[1]}-${m[2]}-${m[3]}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}.000Z`;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date from ${raw}`);
  return iso;
}

function normalizeGhanaPhone(input) {
  if (!input) return null;
  const compact = String(input).replace(/[\s\-().]/g, "");
  if (!compact) return null;
  let local = compact;
  if (local.startsWith("+233")) local = local.slice(4);
  else if (local.startsWith("233") && local.length === 12) local = local.slice(3);
  else if (local.startsWith("0")) local = local.slice(1);
  // Drop an obvious extra digit on mangled emergency numbers (e.g. 02452582573)
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
  if (!text) return { area: "Other", area_other: "Unknown (legacy form)" };
  if (lower.includes("libya")) return { area: "Libya Quarters", area_other: null };
  if (lower.includes("madina") || lower === "sda" || lower.includes("madina sda")) {
    return { area: "Madina", area_other: text === "Madina" ? null : text };
  }
  const nearby = [
    "north legon",
    "pantang",
    "haatso",
    "agbobga",
    "agbogba",
    "upsa",
    "university of ghana",
    "un",
  ];
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
  if (GENDER_BY_FULL_NAME[key]) {
    return { gender: GENDER_BY_FULL_NAME[key], inferred: true, confidence: "high" };
  }
  // Remaining Google Form roster is male-presenting names; form had no gender question.
  return { gender: "man", inferred: true, confidence: "name_based" };
}

function ageOn(isoDob, atIso) {
  if (!isoDob) return null;
  const [y, m, d] = isoDob.split("-").map(Number);
  const at = new Date(atIso);
  let age = at.getUTCFullYear() - y;
  const md = at.getUTCMonth() + 1 - m;
  if (md < 0 || (md === 0 && at.getUTCDate() < d)) age -= 1;
  return age;
}

function buildAdminNotes(row, meta) {
  const lines = [
    "Migrated from Google Form “Madina Basketball Court — Player Registration”.",
    `Google timestamp (GMT): ${meta.rawTimestamp}`,
    `Stored created_at (UTC): ${meta.createdAt}`,
    `Gender: ${meta.gender} (${meta.genderNote})`,
  ];
  if (meta.dobMissing) lines.push("⚠️ Date of birth missing on form — needs admin review.");
  if (meta.wasMinorAtSubmit) {
    lines.push(`⚠️ Was under 18 at form submit (age ${meta.ageAtSubmit}) — guardian not collected on legacy form.`);
  }
  if (meta.emergencyIssues.length) {
    lines.push(`⚠️ Emergency contact: ${meta.emergencyIssues.join("; ")}`);
  }
  if (meta.duplicatePhone) {
    lines.push("Note: same phone appears on another Google Form submission (possible re-registration).");
  }

  const nick = get(row, "Nickname / Preferred Name");
  const position = get(row, "Primary Playing Position");
  const jersey = get(row, "Jersey Number (if any)");
  const teamAff = get(row, "Do you play with a specific team? (Team Affiliation)");
  const teams = get(row, "If yes, what team(s)");
  const days = get(row, "Available Days ", "Available Days");
  const times = get(row, "Available Times");
  const payFreq = get(row, "Preferred Payment Frequency");
  const payMethod = get(row, " Preferred Payment Method ", "Preferred Payment Method");
  const photo = get(row, "Upload a recent picture of you (headshot)");
  const notes = get(row, "Additional Notes or Concerns (if any)");
  const aware = get(row, "Are you aware of the monthly contribution?");
  const perGame = get(row, "If unable to pay monthly, will you contribute per game?");
  const involvement = get(row, "Which would you like to be involved in");

  if (nick) lines.push(`Nickname: ${nick}`);
  if (position) lines.push(`Position: ${position}`);
  if (jersey) lines.push(`Jersey: ${jersey}`);
  if (teamAff) lines.push(`Team affiliation: ${teamAff}${teams ? ` — ${teams}` : ""}`);
  if (involvement) lines.push(`Involvement: ${involvement}`);
  if (days) lines.push(`Available days: ${days}`);
  if (times) lines.push(`Available times: ${times}`);
  if (aware) lines.push(`Aware of monthly contribution: ${aware}`);
  if (perGame) lines.push(`Contribute per game if needed: ${perGame}`);
  if (payFreq) lines.push(`Payment frequency: ${payFreq}`);
  if (payMethod) lines.push(`Payment method: ${payMethod}`);
  if (photo) lines.push(`Photo: ${photo}`);
  if (notes) lines.push(`Player notes: ${notes}`);

  return lines.join("\n");
}

function mapRow(row, phoneCounts) {
  const rawTimestamp = get(row, "Timestamp");
  const createdAt = parseGoogleTimestamp(rawTimestamp);
  const fullName = get(row, "Full Name");
  const email = get(row, "Username").toLowerCase() || null;
  const phoneRaw = get(row, "Phone Number");
  const phone = normalizeGhanaPhone(phoneRaw);
  if (!phone) throw new Error(`Bad player phone for ${fullName}: ${phoneRaw}`);

  const dobRaw = get(row, "Date of Birth ", "Date of Birth");
  const dateOfBirth = /^\d{4}-\d{2}-\d{2}$/.test(dobRaw) ? dobRaw : null;
  const dobMissing = !dateOfBirth;

  const { gender, inferred, confidence } = mapGender(fullName);
  const genderNote = inferred
    ? `inferred (${confidence}) — Google Form had no gender question`
    : "from form";

  const { area, area_other } = mapArea(get(row, "Residential Area / Location"));
  const playStyle = get(row, "Do you play actively or casually?");
  const involvement = get(row, "Which would you like to be involved in");
  const skill_level = mapSkill(playStyle);
  const interests = mapInterests(involvement, playStyle, gender);

  let emergencyName = get(row, "Emergency Contact Name");
  let emergencyPhoneRaw = get(row, "Emergency Contact Number");
  const emergencyIssues = [];

  if (emergencyName && looksLikePhone(emergencyName) && !emergencyPhoneRaw) {
    emergencyPhoneRaw = emergencyName;
    emergencyName = "";
    emergencyIssues.push("name field held a phone number");
  } else if (emergencyName && looksLikePhone(emergencyName) && emergencyPhoneRaw) {
    emergencyIssues.push(`name looked like a phone (${emergencyName}); kept number field`);
    emergencyName = "";
  }

  let emergency_phone = normalizeGhanaPhone(emergencyPhoneRaw);
  if (!emergency_phone && emergencyPhoneRaw) {
    emergencyIssues.push(`could not normalize emergency phone “${emergencyPhoneRaw}”`);
  }
  if (!emergency_phone) {
    emergency_phone = phone;
    emergencyIssues.push("missing emergency phone — used player phone as placeholder");
  }
  if (!emergencyName) {
    emergencyName = "Not provided (legacy form)";
    emergencyIssues.push("missing emergency name");
  }

  const ageAtSubmit = ageOn(dateOfBirth, createdAt);
  const wasMinorAtSubmit = ageAtSubmit !== null && ageAtSubmit < 18;

  const consents = [
    {
      key: "rules",
      required: true,
      accepted: true,
      policy_version: POLICY,
      accepted_at: createdAt,
      source: "google_forms_migration",
      google_form_timestamp: rawTimestamp,
    },
    {
      key: "privacy",
      required: true,
      accepted: true,
      policy_version: POLICY,
      accepted_at: createdAt,
    },
    {
      key: "impact",
      required: true,
      accepted: true,
      policy_version: POLICY,
      accepted_at: createdAt,
    },
    {
      key: "photo",
      required: false,
      accepted: Boolean(get(row, "Upload a recent picture of you (headshot)")),
      policy_version: POLICY,
      accepted_at: createdAt,
    },
  ];

  const admin_notes = buildAdminNotes(row, {
    rawTimestamp,
    createdAt,
    gender,
    genderNote,
    dobMissing,
    wasMinorAtSubmit,
    ageAtSubmit,
    emergencyIssues,
    duplicatePhone: phoneCounts.get(phone) > 1,
  });

  // DOB is NOT NULL in schema — use sentinel only when missing, flagged in notes.
  const date_of_birth = dateOfBirth ?? "1900-01-01";

  return {
    status: "new",
    full_name: fullName,
    date_of_birth,
    gender,
    phone,
    email,
    area,
    area_other,
    skill_level,
    interests,
    heard_from: null,
    emergency_name: emergencyName,
    emergency_relationship: "other",
    emergency_phone,
    guardian_name: null,
    guardian_relationship: null,
    guardian_phone: null,
    guardian_consent: false,
    medical_notes: null,
    photo_consent: Boolean(get(row, "Upload a recent picture of you (headshot)")),
    consents,
    admin_notes,
    created_at: createdAt,
  };
}

async function main() {
  const csvPath = path.resolve(process.argv[2] || DEFAULT_CSV);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  if (!fs.existsSync(csvPath)) {
    console.error("CSV not found:", csvPath);
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  console.log(`Parsed ${rows.length} Google Form rows from ${csvPath}`);

  const phoneCounts = new Map();
  for (const row of rows) {
    const phone = normalizeGhanaPhone(get(row, "Phone Number"));
    if (phone) phoneCounts.set(phone, (phoneCounts.get(phone) || 0) + 1);
  }

  const mapped = rows.map((row) => mapRow(row, phoneCounts));
  const genderSummary = mapped.reduce((acc, r) => {
    acc[r.gender] = (acc[r.gender] || 0) + 1;
    return acc;
  }, {});
  console.log("Gender mapping:", genderSummary);
  console.log(
    "Timestamps (first → last):",
    mapped[0]?.created_at,
    "→",
    mapped[mapped.length - 1]?.created_at
  );

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: existing, error: existingError } = await supabase
    .from("player_registrations")
    .select("id, consents");
  if (existingError) throw existingError;

  const seenTimestamps = new Set(
    (existing || [])
      .flatMap((row) => {
        const list = Array.isArray(row.consents) ? row.consents : [];
        return list
          .map((c) => c?.google_form_timestamp)
          .filter(Boolean);
      })
  );

  const toInsert = mapped.filter((row) => {
    const ts = row.consents.find((c) => c.google_form_timestamp)?.google_form_timestamp;
    if (ts && seenTimestamps.has(ts)) {
      console.log("Skip (already imported):", ts, row.full_name);
      return false;
    }
    return true;
  });

  if (!toInsert.length) {
    console.log("Nothing new to insert.");
    return;
  }

  const { data, error } = await supabase
    .from("player_registrations")
    .insert(toInsert)
    .select("id, full_name, gender, date_of_birth, created_at, phone");

  if (error) {
    console.error("Insert failed:", error);
    process.exit(1);
  }

  console.log(`Inserted ${data.length} registrations:`);
  for (const row of data) {
    console.log(
      `  ${row.created_at} | ${row.full_name} | gender=${row.gender} | dob=${row.date_of_birth} | ${row.phone}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { displayArea } from "@/lib/forms/location";
import { ageFromDob, todayIso } from "@/lib/forms/phone";
import { DURATION_HOURS, consentAccepted } from "@/lib/forms/policies";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type NamedCount = { name: string; value: number };

export type OpsAnalytics = {
  error?: string;
  queue: {
    registrations: number;
    join: number;
    bookings: number;
    messages: number;
    support: number;
  };
  signups: {
    total: number;
    byStatus: NamedCount[];
    weekly: NamedCount[];
    genders: NamedCount[];
    areas: NamedCount[];
    skills: NamedCount[];
    interests: NamedCount[];
    ages: NamedCount[];
    recent: {
      id: string;
      full_name: string;
      status: string;
      area: string;
      skill_level: string;
      created_at: string;
    }[];
  };
  court: {
    requested: number;
    confirmed: number;
    hoursRequested: number;
    byPurpose: NamedCount[];
  };
  visits: {
    today: number;
    week: number;
    topPages: NamedCount[];
  };
  gifts: {
    open: number;
    received: number;
    cashReceived: number;
  };
};

function bump(map: Record<string, number>, key: string) {
  map[key] = (map[key] || 0) + 1;
}

function toNamed(map: Record<string, number>, order?: string[]): NamedCount[] {
  const keys = order?.length ? order.filter((k) => map[k] != null) : Object.keys(map).sort((a, b) => (map[b] || 0) - (map[a] || 0));
  if (!order) {
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }
  const rest = Object.keys(map).filter((k) => !order.includes(k));
  return [...keys, ...rest].map((name) => ({ name, value: map[name] || 0 }));
}

function ageBand(dob: string | null): string {
  if (!dob) return "Birthday not given";
  const age = ageFromDob(dob);
  if (age === null) return "Birthday not given";
  if (age < 13) return "Under 13";
  if (age <= 17) return "13–17";
  if (age <= 24) return "18–24";
  if (age <= 34) return "25–34";
  return "35+";
}

function weekKey(iso: string): string {
  const date = new Date(iso);
  const day = date.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + mondayOffset));
  return monday.toISOString().slice(0, 10);
}

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString();
}

function daysAgoIso(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

export async function loadOpsAnalytics(): Promise<OpsAnalytics> {
  const empty: OpsAnalytics = {
    queue: { registrations: 0, join: 0, bookings: 0, messages: 0, support: 0 },
    signups: {
      total: 0,
      byStatus: [],
      weekly: [],
      genders: [],
      areas: [],
      skills: [],
      interests: [],
      ages: [],
      recent: [],
    },
    court: { requested: 0, confirmed: 0, hoursRequested: 0, byPurpose: [] },
    visits: { today: 0, week: 0, topPages: [] },
    gifts: { open: 0, received: 0, cashReceived: 0 },
  };

  const today = startOfUtcDay();
  const week = daysAgoIso(7);

  const [
    registrations,
    joinApps,
    bookings,
    messages,
    support,
    visitsToday,
    visitsWeek,
  ] = await Promise.all([
    supabaseAdmin
      .from("player_registrations")
      .select("id, full_name, status, area, area_other, skill_level, gender, interests, date_of_birth, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("role_applications").select("id, status"),
    supabaseAdmin.from("court_bookings").select("id, status, duration, purpose"),
    supabaseAdmin.from("contact_messages").select("id, status"),
    supabaseAdmin.from("support_offers").select("id, status, cash_received"),
    supabaseAdmin.from("site_visits").select("id", { count: "exact", head: true }).gte("created_at", today),
    supabaseAdmin.from("site_visits").select("path").gte("created_at", week),
  ]);

  const failed = [
    registrations.error,
    joinApps.error,
    bookings.error,
    messages.error,
    support.error,
    visitsToday.error,
    visitsWeek.error,
  ].find(Boolean);
  if (failed) empty.error = failed.message;

  const regs = registrations.data || [];
  const statusMap: Record<string, number> = {};
  const genderMap: Record<string, number> = {};
  const areaMap: Record<string, number> = {};
  const skillMap: Record<string, number> = {};
  const interestMap: Record<string, number> = {};
  const ageMap: Record<string, number> = {};
  const weeklyMap: Record<string, number> = {};

  for (const row of regs) {
    bump(statusMap, row.status || "new");
    if (row.gender) bump(genderMap, row.gender);
    const areaLabel = displayArea(row.area, row.area_other);
    if (areaLabel !== "—") bump(areaMap, areaLabel);
    if (row.skill_level) bump(skillMap, row.skill_level);
    for (const interest of row.interests || []) bump(interestMap, interest);
    bump(ageMap, ageBand(row.date_of_birth));
    if (row.created_at) bump(weeklyMap, weekKey(row.created_at));
  }

  const weekKeys = Object.keys(weeklyMap).sort();
  const lastWeeks = weekKeys.slice(-8);

  empty.signups = {
    total: regs.length,
    byStatus: toNamed(statusMap, ["new", "confirmed", "waitlist", "inactive"]),
    weekly: lastWeeks.map((name) => ({ name, value: weeklyMap[name] || 0 })),
    genders: toNamed(genderMap),
    areas: toNamed(areaMap).slice(0, 8),
    skills: toNamed(skillMap, ["beginner", "intermediate", "advanced"]),
    interests: toNamed(interestMap),
    ages: toNamed(ageMap, ["Under 13", "13–17", "18–24", "25–34", "35+", "Birthday not given"]),
    recent: regs.slice(0, 5).map((row) => ({
      id: row.id,
      full_name: row.full_name,
      status: row.status,
      area: displayArea(row.area, row.area_other),
      skill_level: row.skill_level,
      created_at: row.created_at,
    })),
  };

  empty.queue.registrations = statusMap.new || 0;
  empty.queue.join = (joinApps.data || []).filter((r) => r.status === "new").length;
  empty.queue.bookings = (bookings.data || []).filter((r) => r.status === "requested").length;
  empty.queue.messages = (messages.data || []).filter((r) => r.status === "open").length;
  empty.queue.support = (support.data || []).filter((r) => r.status === "new").length;

  const purposeMap: Record<string, number> = {};
  let hours = 0;
  let requested = 0;
  let confirmed = 0;
  for (const row of bookings.data || []) {
    if (row.status === "requested") requested += 1;
    if (row.status === "confirmed") confirmed += 1;
    if (row.purpose) bump(purposeMap, row.purpose);
    hours += DURATION_HOURS[row.duration as keyof typeof DURATION_HOURS] || 0;
  }
  empty.court = {
    requested,
    confirmed,
    hoursRequested: hours,
    byPurpose: toNamed(purposeMap),
  };

  const pageMap: Record<string, number> = {};
  for (const row of visitsWeek.data || []) bump(pageMap, row.path || "/");
  empty.visits = {
    today: visitsToday.count || 0,
    week: (visitsWeek.data || []).length,
    topPages: toNamed(pageMap).slice(0, 6),
  };

  let cash = 0;
  let open = 0;
  let received = 0;
  for (const row of support.data || []) {
    if (row.status === "new" || row.status === "in_conversation" || row.status === "pledged") open += 1;
    if (row.status === "received") {
      received += 1;
      cash += Number(row.cash_received || 0);
    }
  }
  empty.gifts = { open, received, cashReceived: cash };

  return empty;
}

export type PartnerImpact = {
  error?: string;
  players: {
    confirmed: number;
    newThisMonth: number;
    ages: NamedCount[];
    genders: NamedCount[];
    skills: NamedCount[];
    areas: NamedCount[];
    interests: NamedCount[];
  };
  court: { hoursRequested: number; upcomingConfirmed: number; byPurpose: NamedCount[] };
  community: { volunteers: number; upcomingEvents: number; pastEvents: number; messagesBySubject: NamedCount[] };
  gifts: { cashReceived: number; inKindCount: number; openOffers: number; receivedByKind: NamedCount[] };
};

export async function loadPartnerImpact(): Promise<PartnerImpact> {
  const report: PartnerImpact = {
    players: {
      confirmed: 0,
      newThisMonth: 0,
      ages: [],
      genders: [],
      skills: [],
      areas: [],
      interests: [],
    },
    court: { hoursRequested: 0, upcomingConfirmed: 0, byPurpose: [] },
    community: { volunteers: 0, upcomingEvents: 0, pastEvents: 0, messagesBySubject: [] },
    gifts: { cashReceived: 0, inKindCount: 0, openOffers: 0, receivedByKind: [] },
  };

  const today = todayIso();
  const monthStart = `${today.slice(0, 7)}-01`;

  const [registrations, bookings, messages, events, offers] = await Promise.all([
    supabaseAdmin
      .from("player_registrations")
      .select("status, date_of_birth, gender, area, area_other, skill_level, interests, consents, created_at"),
    supabaseAdmin.from("court_bookings").select("status, booking_date, duration, purpose"),
    supabaseAdmin.from("contact_messages").select("subject, volunteer_help"),
    supabaseAdmin.from("events").select("status, date"),
    supabaseAdmin.from("support_offers").select("status, kinds, cash_received, quantity_received, in_kind_description"),
  ]);

  const failed = [registrations.error, bookings.error, messages.error, events.error, offers.error].find(Boolean);
  if (failed) report.error = failed.message;

  const ages: Record<string, number> = {};
  const genders: Record<string, number> = {};
  const skills: Record<string, number> = {};
  const areas: Record<string, number> = {};
  const interests: Record<string, number> = {};

  for (const row of registrations.data || []) {
    if (row.status !== "confirmed") continue;
    if (!consentAccepted(row.consents, "impact")) continue;
    report.players.confirmed += 1;
    if (typeof row.created_at === "string" && row.created_at.slice(0, 10) >= monthStart) {
      report.players.newThisMonth += 1;
    }
    bump(ages, ageBand(row.date_of_birth));
    if (row.gender) bump(genders, row.gender);
    if (row.skill_level) bump(skills, row.skill_level);
    const areaLabel = displayArea(row.area, row.area_other);
    if (areaLabel !== "—") bump(areas, areaLabel);
    for (const interest of row.interests || []) bump(interests, interest);
  }

  report.players.ages = toNamed(ages, ["Under 13", "13–17", "18–24", "25–34", "35+", "Birthday not given"]);
  report.players.genders = toNamed(genders);
  report.players.skills = toNamed(skills, ["beginner", "intermediate", "advanced"]);
  report.players.areas = toNamed(areas);
  report.players.interests = toNamed(interests);

  const purpose: Record<string, number> = {};
  for (const row of bookings.data || []) {
    report.court.hoursRequested += DURATION_HOURS[row.duration as keyof typeof DURATION_HOURS] || 0;
    if (row.status === "confirmed" && row.booking_date >= today) report.court.upcomingConfirmed += 1;
    if (row.purpose) bump(purpose, row.purpose);
  }
  report.court.byPurpose = toNamed(purpose);

  const subjects: Record<string, number> = {};
  for (const row of messages.data || []) {
    if (row.subject) bump(subjects, row.subject);
    if ((row.volunteer_help || []).length) report.community.volunteers += 1;
  }
  report.community.messagesBySubject = toNamed(subjects);
  for (const row of events.data || []) {
    if (row.status === "upcoming") report.community.upcomingEvents += 1;
    if (row.status === "completed") report.community.pastEvents += 1;
  }

  const kinds: Record<string, number> = {};
  for (const row of offers.data || []) {
    if (row.status === "received") {
      report.gifts.cashReceived += Number(row.cash_received || 0);
      if (row.in_kind_description || row.quantity_received) report.gifts.inKindCount += 1;
      for (const kind of row.kinds || []) bump(kinds, kind);
    } else if (row.status !== "declined") {
      report.gifts.openOffers += 1;
    }
  }
  report.gifts.receivedByKind = toNamed(kinds);

  return report;
}

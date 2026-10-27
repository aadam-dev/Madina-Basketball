import { ageFromDob, todayIso } from "@/lib/forms/phone";
import { DURATION_HOURS, consentAccepted, type ConsentKey } from "@/lib/forms/policies";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type ImpactReport = {
  error?: string;
  players: {
    confirmed: number;
    newThisMonth: number;
    ages: Record<string, number>;
    genders: Record<string, number>;
    skills: Record<string, number>;
    areas: Record<string, number>;
    interests: Record<string, number>;
  };
  court: {
    byPurpose: Record<string, number>;
    hoursRequested: number;
    upcomingConfirmed: number;
  };
  community: {
    messagesBySubject: Record<string, number>;
    volunteers: number;
    upcomingEvents: number;
    pastEvents: number;
  };
  gifts: {
    receivedByKind: Record<string, number>;
    cashReceived: number;
    inKindCount: number;
    openOffers: number;
  };
};

const AGE_BANDS = ["Under 13", "13–17", "18–24", "25–34", "35+"];

function bump(map: Record<string, number>, key: string) {
  map[key] = (map[key] || 0) + 1;
}

function ageBand(dob: string): string {
  const age = ageFromDob(dob);
  if (age === null) return "Unknown";
  if (age < 13) return "Under 13";
  if (age <= 17) return "13–17";
  if (age <= 24) return "18–24";
  if (age <= 34) return "25–34";
  return "35+";
}

function emptyReport(): ImpactReport {
  return {
    players: {
      confirmed: 0,
      newThisMonth: 0,
      ages: Object.fromEntries(AGE_BANDS.map((band) => [band, 0])),
      genders: {},
      skills: {},
      areas: {},
      interests: {},
    },
    court: { byPurpose: {}, hoursRequested: 0, upcomingConfirmed: 0 },
    community: { messagesBySubject: {}, volunteers: 0, upcomingEvents: 0, pastEvents: 0 },
    gifts: { receivedByKind: {}, cashReceived: 0, inKindCount: 0, openOffers: 0 },
  };
}

export function impactToCsv(report: ImpactReport): string {
  const lines = ["section,metric,value"];
  const push = (section: string, metric: string, value: string | number) => {
    lines.push(`${section},${metric},${value}`);
  };
  push("players", "confirmed", report.players.confirmed);
  push("players", "new_this_month", report.players.newThisMonth);
  for (const [key, value] of Object.entries(report.players.ages)) push("players_age", key, value);
  for (const [key, value] of Object.entries(report.players.genders)) push("players_gender", key, value);
  for (const [key, value] of Object.entries(report.players.skills)) push("players_skill", key, value);
  for (const [key, value] of Object.entries(report.players.areas)) push("players_area", key, value);
  for (const [key, value] of Object.entries(report.players.interests)) push("players_interest", key, value);
  for (const [key, value] of Object.entries(report.court.byPurpose)) push("court_purpose", key, value);
  push("court", "hours_requested", report.court.hoursRequested);
  push("court", "upcoming_confirmed", report.court.upcomingConfirmed);
  for (const [key, value] of Object.entries(report.community.messagesBySubject)) push("messages", key, value);
  push("community", "volunteers", report.community.volunteers);
  push("community", "upcoming_events", report.community.upcomingEvents);
  push("community", "past_events", report.community.pastEvents);
  for (const [key, value] of Object.entries(report.gifts.receivedByKind)) push("gifts_received", key, value);
  push("gifts", "cash_received_ghs", report.gifts.cashReceived);
  push("gifts", "in_kind_count", report.gifts.inKindCount);
  push("gifts", "open_offers_not_received", report.gifts.openOffers);
  return lines.join("\n");
}

export async function loadImpact(): Promise<ImpactReport> {
  const report = emptyReport();
  const today = todayIso();
  const monthStart = `${today.slice(0, 7)}-01`;

  const [registrations, bookings, messages, events, offers] = await Promise.all([
    supabaseAdmin.from("player_registrations").select("status, date_of_birth, gender, area, skill_level, interests, consents, created_at"),
    supabaseAdmin.from("court_bookings").select("status, booking_date, duration, purpose"),
    supabaseAdmin.from("contact_messages").select("subject, volunteer_help"),
    supabaseAdmin.from("events").select("status, date"),
    supabaseAdmin.from("support_offers").select("status, kinds, cash_received, quantity_received, in_kind_description"),
  ]);

  const failed = [registrations.error, bookings.error, messages.error, events.error, offers.error].find(Boolean);
  if (failed) report.error = failed.message;

  for (const row of registrations.data || []) {
    if (row.status !== "confirmed") continue;
    if (!consentAccepted(row.consents, "impact" as ConsentKey)) continue;
    report.players.confirmed += 1;
    if (typeof row.created_at === "string" && row.created_at.slice(0, 10) >= monthStart) {
      report.players.newThisMonth += 1;
    }
    bump(report.players.ages, ageBand(row.date_of_birth));
    if (row.gender) bump(report.players.genders, row.gender);
    if (row.skill_level) bump(report.players.skills, row.skill_level);
    if (row.area) bump(report.players.areas, row.area);
    for (const interest of row.interests || []) bump(report.players.interests, interest);
  }

  for (const row of bookings.data || []) {
    bump(report.court.byPurpose, row.purpose || "Unknown");
    report.court.hoursRequested += DURATION_HOURS[row.duration as keyof typeof DURATION_HOURS] || 0;
    if (row.status === "confirmed" && row.booking_date >= today) report.court.upcomingConfirmed += 1;
  }

  for (const row of messages.data || []) {
    bump(report.community.messagesBySubject, row.subject || "Unknown");
    if (row.subject === "Volunteering" || (row.volunteer_help || []).length > 0) {
      report.community.volunteers += 1;
    }
  }

  for (const row of events.data || []) {
    if (row.date >= today || row.status === "upcoming") report.community.upcomingEvents += 1;
    else report.community.pastEvents += 1;
  }

  for (const row of offers.data || []) {
    if (row.status === "new" || row.status === "in_conversation" || row.status === "pledged") {
      report.gifts.openOffers += 1;
    }
    if (row.status !== "received") continue;
    for (const kind of row.kinds || []) bump(report.gifts.receivedByKind, kind);
    report.gifts.cashReceived += Number(row.cash_received || 0);
    const inKind = (row.kinds || []).some((kind: string) => kind !== "cash") || row.quantity_received || row.in_kind_description;
    if (inKind) report.gifts.inKindCount += 1;
  }

  return report;
}

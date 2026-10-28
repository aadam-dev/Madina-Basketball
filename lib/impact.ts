import { loadPartnerImpact, type PartnerImpact } from "@/lib/analytics";

/** @deprecated Prefer loadPartnerImpact — kept for CSV route compatibility. */
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

function namedToRecord(rows: { name: string; value: number }[]): Record<string, number> {
  return Object.fromEntries(rows.map((row) => [row.name, row.value]));
}

function toLegacy(report: PartnerImpact): ImpactReport {
  return {
    error: report.error,
    players: {
      confirmed: report.players.confirmed,
      newThisMonth: report.players.newThisMonth,
      ages: namedToRecord(report.players.ages),
      genders: namedToRecord(report.players.genders),
      skills: namedToRecord(report.players.skills),
      areas: namedToRecord(report.players.areas),
      interests: namedToRecord(report.players.interests),
    },
    court: {
      byPurpose: namedToRecord(report.court.byPurpose),
      hoursRequested: report.court.hoursRequested,
      upcomingConfirmed: report.court.upcomingConfirmed,
    },
    community: {
      messagesBySubject: namedToRecord(report.community.messagesBySubject),
      volunteers: report.community.volunteers,
      upcomingEvents: report.community.upcomingEvents,
      pastEvents: report.community.pastEvents,
    },
    gifts: {
      receivedByKind: namedToRecord(report.gifts.receivedByKind),
      cashReceived: report.gifts.cashReceived,
      inKindCount: report.gifts.inKindCount,
      openOffers: report.gifts.openOffers,
    },
  };
}

export async function loadImpact(): Promise<ImpactReport> {
  return toLegacy(await loadPartnerImpact());
}

export function impactToCsv(report: ImpactReport): string {
  const lines = ["section,metric,value"];
  const push = (section: string, metric: string, value: string | number) => {
    lines.push(`${section},${JSON.stringify(metric)},${value}`);
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

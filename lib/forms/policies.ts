export const POLICY_VERSION = "2026-10";

export const AREAS = ["Libya Quarters", "Madina", "Nearby community", "Other"] as const;
export const GENDERS = ["woman", "man", "prefer_not_to_say"] as const;
export const SKILL_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export const INTERESTS = ["pickup", "training", "competitive", "girls_women"] as const;
export const HEARD_FROM = ["friend", "social", "event", "school", "other"] as const;
export const RELATIONSHIPS = ["parent", "guardian", "spouse", "sibling", "friend", "other"] as const;

export const JOIN_ROLES = ["volunteer", "coach", "management"] as const;
export const MANAGEMENT_AREAS = ["operations", "finance", "events", "comms", "youth"] as const;
export const COACH_SESSIONS = ["weekday_mornings", "weekday_evenings", "weekends", "flexible"] as const;

export const TIME_SLOTS = [
  "Morning (6am-10am)",
  "Mid-morning (10am-12pm)",
  "Afternoon (12pm-4pm)",
  "Evening (4pm-8pm)",
] as const;

export const DURATIONS = [
  "1 hour",
  "2 hours",
  "3 hours",
  "Half day (4 hours)",
  "Full day (6+ hours)",
] as const;

export const BOOKING_PURPOSES = [
  "Training/Practice",
  "Match/Game",
  "School Activity",
  "Tournament",
  "Event",
] as const;

export const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Event Information",
  "Media/Press",
  "Complaint/Concern",
] as const;

export const CONTACT_METHODS = ["Email", "Phone", "WhatsApp"] as const;
export const VOLUNTEER_HELP = ["coaching", "admin", "events", "media"] as const;

export const SUPPORT_KINDS = [
  "lighting",
  "balls",
  "jerseys",
  "equipment",
  "cash",
  "other",
] as const;

export const SUPPORT_INTENTS = ["sponsorship", "gift_ready", "ask_what_helps"] as const;
export const SUPPORT_CONTACT = ["call", "whatsapp", "email"] as const;

export const DURATION_HOURS: Record<(typeof DURATIONS)[number], number> = {
  "1 hour": 1,
  "2 hours": 2,
  "3 hours": 3,
  "Half day (4 hours)": 4,
  "Full day (6+ hours)": 6,
};

export type ConsentKey = "rules" | "privacy" | "impact" | "photo" | "recognition";

export type ConsentInput = {
  key: ConsentKey;
  required: boolean;
  accepted: boolean;
  policy_version: string;
};

export type StoredConsent = ConsentInput & { accepted_at: string };

export const CONSENT_COPY: Record<
  ConsentKey,
  { title: string; href: string; summary: string }
> = {
  rules: {
    title: "Court rules and code of conduct",
    href: "/terms#court-rules",
    summary:
      "Treat the court and everyone on it with respect. Play safely, leave the court as you found it, and follow booking times. Bookings can be cancelled by the team when the court needs the slot. Harassment and damage are not allowed.",
  },
  privacy: {
    title: "Privacy notice",
    href: "/privacy#your-information",
    summary:
      "We store what you submit so we can run the court: confirm a registration or booking, reply to a message, or account for a gift. Emergency and guardian details are for safety. We do not publish your name, phone, or medical note. Admin alerts contain only a short notice, not the full form.",
  },
  impact: {
    title: "Impact reports",
    href: "/privacy#impact-reports",
    summary:
      "Community and partner reports may count you by age group, area, and skill. They never include your name, phone, email, emergency contact, guardian, or medical note.",
  },
  photo: {
    title: "Photos and video",
    href: "/privacy#your-information",
    summary:
      "This is optional. If you agree, we may use photos or video of you at the court in community updates. You can still register if you leave this unchecked.",
  },
  recognition: {
    title: "Public recognition",
    href: "/privacy#support",
    summary:
      "This is optional. If you agree, we may list your name or organisation after a gift is actually received. An enquiry or a pledge does not put you on the donor wall. Your contact details stay private either way.",
  },
};

export function stampConsents(consents: ConsentInput[], at = new Date().toISOString()): StoredConsent[] {
  return consents.map((consent) => ({ ...consent, accepted_at: at }));
}

export function consentAccepted(consents: unknown, key: ConsentKey): boolean {
  if (!Array.isArray(consents)) return false;
  return consents.some(
    (item) =>
      item &&
      typeof item === "object" &&
      (item as { key?: string }).key === key &&
      (item as { accepted?: boolean }).accepted === true
  );
}

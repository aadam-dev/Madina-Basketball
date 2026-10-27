import { z } from "zod";
import { ageFromDob, normalizeGhanaPhone, todayIso } from "./phone";
import {
  AREAS,
  BOOKING_PURPOSES,
  CONTACT_METHODS,
  CONTACT_SUBJECTS,
  CONSENT_COPY,
  DURATIONS,
  GENDERS,
  HEARD_FROM,
  INTERESTS,
  POLICY_VERSION,
  RELATIONSHIPS,
  SKILL_LEVELS,
  SUPPORT_CONTACT,
  SUPPORT_INTENTS,
  SUPPORT_KINDS,
  TIME_SLOTS,
  VOLUNTEER_HELP,
  JOIN_ROLES,
  MANAGEMENT_AREAS,
  COACH_SESSIONS,
  type ConsentKey,
} from "./policies";

const requiredText = (label: string, max = 120) =>
  z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long.`);

const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : null));

const emailField = z
  .string()
  .trim()
  .max(200)
  .refine((value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter a valid email address.")
  .transform((value) => (value === "" ? null : value.toLowerCase()));

const phoneField = z.string().trim().transform((value, ctx) => {
  const normalized = normalizeGhanaPhone(value);
  if (!normalized) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Enter a Ghana phone number, like 024 000 0000.",
    });
    return z.NEVER;
  }
  return normalized;
});

const consentInput = z.object({
  key: z.enum(["rules", "privacy", "impact", "photo", "recognition"]),
  required: z.boolean(),
  accepted: z.boolean(),
  policy_version: z.literal(POLICY_VERSION),
});

function consentsField(expected: { key: ConsentKey; required: boolean }[]) {
  return z.array(consentInput).superRefine((items, ctx) => {
    for (const item of expected) {
      const found = items.find((entry) => entry.key === item.key);
      if (!found || found.required !== item.required) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Missing agreement: ${CONSENT_COPY[item.key].title}.`,
          path: [item.key],
        });
        continue;
      }
      if (item.required && !found.accepted) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Please agree to the ${CONSENT_COPY[item.key].title.toLowerCase()} to continue.`,
          path: [item.key],
        });
      }
    }
  });
}

export const registerSchema = z
  .object({
    full_name: requiredText("Full name"),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date of birth."),
    gender: z.union([z.enum(GENDERS), z.literal("")]).transform((value) => (value === "" ? null : value)),
    phone: phoneField,
    email: emailField,
    area: z.enum(AREAS, { errorMap: () => ({ message: "Choose an area." }) }),
    area_other: z.string().trim().max(80).optional().transform((value) => value || null),
    skill_level: z.enum(SKILL_LEVELS, { errorMap: () => ({ message: "Choose a skill level." }) }),
    interests: z.array(z.enum(INTERESTS)).min(1, "Choose at least one way you want to play."),
    heard_from: z.union([z.enum(HEARD_FROM), z.literal("")]).transform((value) => (value === "" ? null : value)),
    emergency_name: requiredText("Emergency contact name"),
    emergency_relationship: z.enum(RELATIONSHIPS, { errorMap: () => ({ message: "Choose a relationship." }) }),
    emergency_phone: phoneField,
    guardian_name: z.string().trim().max(120).optional().transform((value) => value || null),
    guardian_relationship: z.union([z.enum(RELATIONSHIPS), z.literal("")]).optional().transform((value) => value || null),
    guardian_phone: z.string().trim().optional().transform((value) => value || null),
    guardian_consent: z.boolean().optional().default(false),
    medical_notes: z.string().trim().max(500, "Keep the medical note under 500 characters.").optional().transform((value) => value || null),
    consents: consentsField([
      { key: "rules", required: true },
      { key: "privacy", required: true },
      { key: "impact", required: true },
      { key: "photo", required: false },
    ]),
  })
  .superRefine((value, ctx) => {
    const age = ageFromDob(value.date_of_birth);
    if (age === null || age < 6 || age > 80) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["date_of_birth"],
        message: "Age must be between 6 and 80.",
      });
    }
    if (value.area === "Other" && !value.area_other) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["area_other"],
        message: "Tell us the area.",
      });
    }
    if (value.emergency_phone === value.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emergency_phone"],
        message: "Use a number that is not the player's own phone.",
      });
    }
    if (age !== null && age < 18) {
      if (!value.guardian_name) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["guardian_name"], message: "Guardian name is required for players under 18." });
      }
      if (!value.guardian_relationship) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["guardian_relationship"], message: "Choose the guardian's relationship." });
      }
      const guardianPhone = value.guardian_phone ? normalizeGhanaPhone(value.guardian_phone) : null;
      if (!guardianPhone) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["guardian_phone"], message: "Enter a Ghana phone number for the guardian." });
      }
      if (!value.guardian_consent) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["guardian_consent"], message: "A parent or guardian must agree." });
      }
    }
  })
  .transform((value) => {
    const age = ageFromDob(value.date_of_birth);
    const minor = age !== null && age < 18;
    const photo = value.consents.find((item) => item.key === "photo")?.accepted === true;
    return {
      ...value,
      guardian_name: minor ? value.guardian_name : null,
      guardian_relationship: minor ? value.guardian_relationship : null,
      guardian_phone: minor && value.guardian_phone ? normalizeGhanaPhone(value.guardian_phone) : null,
      guardian_consent: minor ? true : false,
      photo_consent: photo,
    };
  });

export const bookingSchema = z.object({
  name: requiredText("Name"),
  phone: phoneField,
  email: emailField,
  organisation: optionalText(160),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  time_slot: z.enum(TIME_SLOTS, { errorMap: () => ({ message: "Choose a time slot." }) }),
  duration: z.enum(DURATIONS, { errorMap: () => ({ message: "Choose a duration." }) }),
  purpose: z.enum(BOOKING_PURPOSES, { errorMap: () => ({ message: "Choose a purpose." }) }),
  participants: z.coerce.number().int().min(1, "At least one person.").max(500, "That number is too large."),
  details: optionalText(1000),
  consents: consentsField([
    { key: "rules", required: true },
    { key: "privacy", required: true },
  ]),
}).superRefine((value, ctx) => {
  if (value.booking_date < todayIso()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["booking_date"],
      message: "Choose today or a future date.",
    });
  }
});

export const contactSchema = z
  .object({
    name: requiredText("Name"),
    phone: phoneField,
    email: emailField,
    subject: z.enum(CONTACT_SUBJECTS, { errorMap: () => ({ message: "Choose a subject." }) }),
    message: z.string().trim().min(12, "Write a short message so we know how to help.").max(4000),
    preferred_method: z.enum(CONTACT_METHODS, { errorMap: () => ({ message: "Choose how we should reply." }) }),
    consents: consentsField([{ key: "privacy", required: true }]),
  })
  .superRefine((value, ctx) => {
    if (value.preferred_method === "Email" && !value.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Add an email address so we can reply that way.",
      });
    }
  });

export const roleApplicationSchema = z
  .object({
    role: z.enum(JOIN_ROLES, { errorMap: () => ({ message: "Choose how you want to join." }) }),
    full_name: requiredText("Full name"),
    phone: phoneField,
    email: emailField,
    area: z.union([z.enum(AREAS), z.literal("")]).transform((value) => (value === "" ? null : value)),
    area_other: z.string().trim().max(80).optional().transform((value) => value || null),
    volunteer_help: z.array(z.enum(VOLUNTEER_HELP)).default([]),
    volunteer_availability: optionalText(300),
    coaching_experience: optionalText(2000),
    sessions_available: z
      .union([z.enum(COACH_SESSIONS), z.literal("")])
      .transform((value) => (value === "" ? null : value)),
    reference_name: optionalText(120),
    reference_phone: z.string().trim().transform((value, ctx) => {
      if (!value) return null;
      const normalized = normalizeGhanaPhone(value);
      if (!normalized) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a Ghana phone number, like 024 000 0000.",
        });
        return z.NEVER;
      }
      return normalized;
    }),
    management_areas: z.array(z.enum(MANAGEMENT_AREAS)).default([]),
    weekly_commitment: optionalText(120),
    message: optionalText(2000),
    consents: consentsField([
      { key: "rules", required: true },
      { key: "privacy", required: true },
    ]),
  })
  .superRefine((value, ctx) => {
    if (value.area === "Other" && !value.area_other) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["area_other"], message: "Tell us which area." });
    }
    if (value.role === "volunteer" && value.volunteer_help.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["volunteer_help"],
        message: "Choose at least one way you can help.",
      });
    }
    if (value.role === "coach") {
      if (!value.coaching_experience) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["coaching_experience"],
          message: "Tell us a little about your coaching or training experience.",
        });
      }
      if (!value.sessions_available) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sessions_available"],
          message: "Choose when you can coach.",
        });
      }
    }
    if (value.role === "management" && value.management_areas.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["management_areas"],
        message: "Choose at least one area you can help run.",
      });
    }
  });

export const roleReviewSchema = z.object({
  status: z.enum(["new", "in_conversation", "accepted", "declined", "inactive"]),
  admin_notes: optionalText(2000),
});

const money = z
  .union([z.literal(""), z.coerce.number().positive("Enter an amount above zero.").max(10_000_000)])
  .optional()
  .transform((value) => (value === "" || value === undefined ? null : value));

const quantity = z
  .union([z.literal(""), z.coerce.number().int().positive("Enter a quantity above zero.").max(10000)])
  .optional()
  .transform((value) => (value === "" || value === undefined ? null : value));

export const supportSchema = z
  .object({
    name: requiredText("Name"),
    organisation: optionalText(160),
    phone: phoneField,
    email: emailField,
    preferred_contact: z.enum(SUPPORT_CONTACT, { errorMap: () => ({ message: "Choose how we should reply." }) }),
    kinds: z.array(z.enum(SUPPORT_KINDS)).min(1, "Choose at least one kind of support."),
    intent: z.enum(SUPPORT_INTENTS, { errorMap: () => ({ message: "Tell us how you want to help." }) }),
    lighting_note: optionalText(1000),
    item_description: optionalText(200),
    quantity,
    cash_amount: money,
    message: optionalText(2000),
    consents: consentsField([
      { key: "privacy", required: true },
      { key: "recognition", required: false },
    ]),
  })
  .superRefine((value, ctx) => {
    if (value.preferred_contact === "email" && !value.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Add an email address so we can reply that way.",
      });
    }
    if (value.kinds.includes("other") && !value.message && !value.item_description) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["message"],
        message: "Tell us what you have in mind.",
      });
    }
  })
  .transform((value) => ({
    ...value,
    recognize_publicly: value.consents.find((item) => item.key === "recognition")?.accepted === true,
  }));

export const registrationReviewSchema = z.object({
  status: z.enum(["new", "confirmed", "waitlist", "inactive"]),
  admin_notes: optionalText(2000),
});

export const bookingReviewSchema = z.object({
  status: z.enum(["requested", "confirmed", "declined", "cancelled"]),
  admin_notes: optionalText(2000),
});

export const messageReviewSchema = z.object({
  status: z.enum(["open", "in_progress", "closed"]),
  admin_notes: optionalText(2000),
});

export const supportReviewSchema = z
  .object({
    status: z.enum(["new", "in_conversation", "pledged", "received", "declined"]),
    admin_notes: optionalText(2000),
    received_on: z.string().optional().transform((value) => value || null),
    received_summary: optionalText(500),
    cash_received: money,
    in_kind_description: optionalText(300),
    quantity_received: quantity,
    estimated_value: money,
  })
  .superRefine((value, ctx) => {
    if (value.status !== "received") return;
    if (!value.received_on || !/^\d{4}-\d{2}-\d{2}$/.test(value.received_on)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["received_on"], message: "Enter the date the gift arrived." });
    }
    if (!value.received_summary) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["received_summary"], message: "Record what actually arrived." });
    }
  });

export type RegisterInput = z.input<typeof registerSchema>;
export type BookingInput = z.input<typeof bookingSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type SupportInput = z.input<typeof supportSchema>;
export type RoleApplicationInput = z.input<typeof roleApplicationSchema>;

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const flat = error.flatten();
  const fields: Record<string, string> = {};
  for (const [key, messages] of Object.entries(flat.fieldErrors)) {
    const message = messages?.[0];
    if (message) fields[key] = message;
  }
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
    if (issue.path[0] === "consents" && typeof issue.path[1] === "string" && !fields[issue.path[1]]) {
      fields[issue.path[1]] = issue.message;
    }
  }
  return fields;
}

"use client";

import { useRef, useState } from "react";
import {
  AREAS,
  COACH_SESSIONS,
  MANAGEMENT_AREAS,
  POLICY_VERSION,
  VOLUNTEER_HELP,
  type ConsentKey,
} from "@/lib/forms/policies";
import { fieldErrors, roleApplicationSchema } from "@/lib/forms/schemas";
import {
  ChoiceList,
  ConsentGroup,
  Field,
  FormBanner,
  Guide,
  SelectInput,
  SuccessPanel,
  TextArea,
  TextInput,
  toneClasses,
} from "./controls";
import { FormShell } from "./FormShell";

type Role = "volunteer" | "coach" | "management";

const ROLE_COPY: Record<Role, { title: string; subtitle: string }> = {
  volunteer: {
    title: "Volunteer",
    subtitle: "Help with coaching support, admin, events, or media.",
  },
  coach: {
    title: "Coach / trainer",
    subtitle: "Share your experience and when you can take sessions.",
  },
  management: {
    title: "Management",
    subtitle: "Help run the court week to week.",
  },
};

export default function RoleApplicationForm({ role }: { role: Role }) {
  const tone = "light" as const;
  const styles = toneClasses(tone);
  const startedAt = useRef(Date.now());
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    area: "",
    area_other: "",
    volunteer_help: [] as string[],
    volunteer_availability: "",
    coaching_experience: "",
    sessions_available: "",
    reference_name: "",
    reference_phone: "",
    management_areas: [] as string[],
    weekly_commitment: "",
    message: "",
    consents: { rules: false, privacy: false } as Partial<Record<ConsentKey, boolean>>,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setFormError("");
    const payload = {
      role,
      ...form,
      consents: (["rules", "privacy"] as ConsentKey[]).map((key) => ({
        key,
        required: true,
        accepted: form.consents[key] === true,
        policy_version: POLICY_VERSION,
      })),
      website,
      started_at: startedAt.current,
    };
    const parsed = roleApplicationSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/forms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.fieldErrors || {});
        setFormError(data.error || "We could not save your application.");
        return;
      }
      setDone(true);
    } catch {
      setFormError("We could not reach the server. Try again, or message us on WhatsApp.");
    } finally {
      setPending(false);
    }
  }

  const copy = ROLE_COPY[role];

  if (done) {
    return (
      <FormShell tone={tone} title="Application received" subtitle="The team will follow up.">
        <SuccessPanel
          tone={tone}
          title="Application received"
          body="We have your details. Someone from the court will reply if there is a fit."
        />
      </FormShell>
    );
  }

  return (
    <FormShell tone={tone} title={copy.title} subtitle={copy.subtitle}>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <input
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
        <Field tone={tone} label="Full name" htmlFor="full_name" required error={errors.full_name}>
          <TextInput
            tone={tone}
            id="full_name"
            value={form.full_name}
            onChange={(event) => set("full_name", event.target.value)}
          />
        </Field>
        <Field tone={tone} label="Phone" htmlFor="phone" required error={errors.phone}>
          <TextInput
            tone={tone}
            id="phone"
            inputMode="tel"
            placeholder="024 000 0000"
            value={form.phone}
            onChange={(event) => set("phone", event.target.value)}
          />
        </Field>
        <Field tone={tone} label="Email" htmlFor="email" error={errors.email}>
          <TextInput
            tone={tone}
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => set("email", event.target.value)}
          />
        </Field>
        <Field tone={tone} label="Area" htmlFor="area" error={errors.area}>
          <SelectInput tone={tone} id="area" value={form.area} onChange={(event) => set("area", event.target.value)}>
            <option value="">Optional</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </SelectInput>
        </Field>
        {form.area === "Other" ? (
          <Field tone={tone} label="Which area?" htmlFor="area_other" required error={errors.area_other}>
            <TextInput
              tone={tone}
              id="area_other"
              value={form.area_other}
              onChange={(event) => set("area_other", event.target.value)}
            />
          </Field>
        ) : null}

        {role === "volunteer" ? (
          <>
            <Guide tone={tone}>Pick every area you can help with. Match-day support and quiet admin both count.</Guide>
            <Field tone={tone} label="How you can help" required error={errors.volunteer_help}>
              <ChoiceList
                tone={tone}
                multiple
                value={form.volunteer_help}
                onChange={(value) => set("volunteer_help", value as string[])}
                options={VOLUNTEER_HELP.map((item) => ({
                  value: item,
                  label: item === "admin" ? "Administration" : item[0].toUpperCase() + item.slice(1),
                }))}
              />
            </Field>
            <Field
              tone={tone}
              label="Availability"
              htmlFor="volunteer_availability"
              error={errors.volunteer_availability}
            >
              <TextInput
                tone={tone}
                id="volunteer_availability"
                placeholder="Evenings, weekends…"
                value={form.volunteer_availability}
                onChange={(event) => set("volunteer_availability", event.target.value)}
              />
            </Field>
          </>
        ) : null}

        {role === "coach" ? (
          <>
            <Guide tone={tone}>
              A short note on experience is enough. Formal certificates help, but they are not required to start the
              conversation.
            </Guide>
            <Field
              tone={tone}
              label="Coaching or training experience"
              htmlFor="coaching_experience"
              required
              error={errors.coaching_experience}
            >
              <TextArea
                tone={tone}
                id="coaching_experience"
                value={form.coaching_experience}
                onChange={(event) => set("coaching_experience", event.target.value)}
              />
            </Field>
            <Field tone={tone} label="When can you coach?" required error={errors.sessions_available}>
              <ChoiceList
                tone={tone}
                value={form.sessions_available}
                onChange={(value) => set("sessions_available", value as string)}
                options={COACH_SESSIONS.map((item) => ({
                  value: item,
                  label: item
                    .split("_")
                    .map((part) => part[0].toUpperCase() + part.slice(1))
                    .join(" "),
                }))}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field tone={tone} label="Reference name" htmlFor="reference_name" error={errors.reference_name}>
                <TextInput
                  tone={tone}
                  id="reference_name"
                  value={form.reference_name}
                  onChange={(event) => set("reference_name", event.target.value)}
                />
              </Field>
              <Field tone={tone} label="Reference phone" htmlFor="reference_phone" error={errors.reference_phone}>
                <TextInput
                  tone={tone}
                  id="reference_phone"
                  inputMode="tel"
                  value={form.reference_phone}
                  onChange={(event) => set("reference_phone", event.target.value)}
                />
              </Field>
            </div>
          </>
        ) : null}

        {role === "management" ? (
          <>
            <Guide tone={tone}>Management here means running the court with the community, not a paid office job.</Guide>
            <Field tone={tone} label="Where can you help?" required error={errors.management_areas}>
              <ChoiceList
                tone={tone}
                multiple
                value={form.management_areas}
                onChange={(value) => set("management_areas", value as string[])}
                options={MANAGEMENT_AREAS.map((item) => ({
                  value: item,
                  label: item === "comms" ? "Communications" : item[0].toUpperCase() + item.slice(1),
                }))}
              />
            </Field>
            <Field
              tone={tone}
              label="Weekly commitment"
              htmlFor="weekly_commitment"
              error={errors.weekly_commitment}
              hint="Optional. A rough number of hours helps us plan."
            >
              <TextInput
                tone={tone}
                id="weekly_commitment"
                placeholder="e.g. 4 hours on weekends"
                value={form.weekly_commitment}
                onChange={(event) => set("weekly_commitment", event.target.value)}
              />
            </Field>
          </>
        ) : null}

        <Field tone={tone} label="Anything else?" htmlFor="message" error={errors.message}>
          <TextArea
            tone={tone}
            id="message"
            value={form.message}
            onChange={(event) => set("message", event.target.value)}
          />
        </Field>
        <ConsentGroup
          tone={tone}
          errors={errors}
          value={form.consents}
          onChange={(key, accepted) => set("consents", { ...form.consents, [key]: accepted })}
          items={[
            { key: "rules", required: true, sentence: "I agree to the court rules and code of conduct." },
            {
              key: "privacy",
              required: true,
              sentence: "I understand this application is stored so the team can reply. It is not published.",
            },
          ]}
        />
        {formError ? <FormBanner tone={tone} message={formError} /> : null}
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "Sending…" : "Submit application"}
        </button>
      </form>
    </FormShell>
  );
}

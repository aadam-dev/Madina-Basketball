"use client";

import { useRef, useState } from "react";
import { isWithinNextDay } from "@/lib/forms/phone";
import { BOOKING_PURPOSES, DURATIONS, POLICY_VERSION, TIME_SLOTS } from "@/lib/forms/policies";
import { bookingSchema, fieldErrors } from "@/lib/forms/schemas";
import {
  ChoiceList,
  ConsentGroup,
  Field,
  FormBanner,
  Guide,
  SuccessPanel,
  TextArea,
  TextInput,
  toneClasses,
} from "./controls";
import { FormShell } from "./FormShell";

export default function BookForm() {
  const tone = "light" as const;
  const styles = toneClasses(tone);
  const startedAt = useRef(Date.now());
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    organisation: "",
    booking_date: "",
    time_slot: "",
    duration: "",
    purpose: "",
    participants: "10",
    details: "",
    rules: false,
    privacy: false,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setFormError("");
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      organisation: form.organisation,
      booking_date: form.booking_date,
      time_slot: form.time_slot,
      duration: form.duration,
      purpose: form.purpose,
      participants: form.participants,
      details: form.details,
      consents: [
        { key: "rules", required: true, accepted: form.rules, policy_version: POLICY_VERSION },
        { key: "privacy", required: true, accepted: form.privacy, policy_version: POLICY_VERSION },
      ],
      website,
      started_at: startedAt.current,
    };
    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/forms/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.fieldErrors || {});
        setFormError(data.error || "We could not save this booking.");
        return;
      }
      setDone(true);
    } catch {
      setFormError("We could not reach the server. Try again, or message us on WhatsApp.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <FormShell tone={tone} title="Request received" subtitle="We will confirm the slot.">
        <SuccessPanel
          tone={tone}
          title="Request received"
          body="We have the booking request. The team will confirm the slot and share payment details. This is not a confirmed booking yet."
        />
      </FormShell>
    );
  }

  const soon = form.booking_date ? isWithinNextDay(form.booking_date) : false;

  return (
    <FormShell tone={tone} title="Book the court" subtitle="Request a slot for training, a match, or an event.">
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(event) => setWebsite(event.target.value)} />
      <Field tone={tone} label="Name" htmlFor="name" required error={errors.name}>
        <TextInput tone={tone} id="name" value={form.name} onChange={(event) => set("name", event.target.value)} />
      </Field>
      <Field tone={tone} label="Phone" htmlFor="phone" required error={errors.phone}>
        <TextInput tone={tone} id="phone" inputMode="tel" placeholder="024 000 0000" value={form.phone} onChange={(event) => set("phone", event.target.value)} />
      </Field>
      <Field tone={tone} label="Email" htmlFor="email" error={errors.email}>
        <TextInput tone={tone} id="email" type="email" value={form.email} onChange={(event) => set("email", event.target.value)} />
      </Field>
      <Field tone={tone} label="Organisation or team" htmlFor="organisation" error={errors.organisation}>
        <TextInput tone={tone} id="organisation" value={form.organisation} onChange={(event) => set("organisation", event.target.value)} />
      </Field>
      <Field tone={tone} label="Date" htmlFor="booking_date" required error={errors.booking_date}>
        <TextInput tone={tone} id="booking_date" type="date" value={form.booking_date} onChange={(event) => set("booking_date", event.target.value)} />
      </Field>
      {soon ? (
        <Guide tone={tone}>Slots are normally requested 24–48 hours ahead. You can still send this request.</Guide>
      ) : null}
      <Field tone={tone} label="Time slot" required error={errors.time_slot}>
        <ChoiceList tone={tone} value={form.time_slot} onChange={(value) => set("time_slot", value as string)} options={TIME_SLOTS.map((slot) => ({ value: slot, label: slot }))} />
      </Field>
      <Field tone={tone} label="Duration" required error={errors.duration}>
        <ChoiceList tone={tone} value={form.duration} onChange={(value) => set("duration", value as string)} options={DURATIONS.map((item) => ({ value: item, label: item }))} />
      </Field>
      <Field tone={tone} label="Purpose" required error={errors.purpose}>
        <ChoiceList tone={tone} value={form.purpose} onChange={(value) => set("purpose", value as string)} options={BOOKING_PURPOSES.map((item) => ({ value: item, label: item }))} />
      </Field>
      <Field tone={tone} label="Number of participants" htmlFor="participants" required error={errors.participants}>
        <TextInput tone={tone} id="participants" type="number" min={1} value={form.participants} onChange={(event) => set("participants", event.target.value)} />
      </Field>
      <Field tone={tone} label="Additional details" htmlFor="details" error={errors.details}>
        <TextArea tone={tone} id="details" value={form.details} onChange={(event) => set("details", event.target.value)} />
      </Field>
      <ConsentGroup
        tone={tone}
        errors={errors}
        value={{ rules: form.rules, privacy: form.privacy }}
        onChange={(key, accepted) => {
          if (key === "rules") set("rules", accepted);
          if (key === "privacy") set("privacy", accepted);
        }}
        items={[
          { key: "rules", required: true, sentence: "I agree to the court rules, including care of the court and cancellation notice." },
          { key: "privacy", required: true, sentence: "I understand my name and phone are used to confirm this slot. Court-use totals may appear without my contact details." },
        ]}
      />
      {formError ? <FormBanner tone={tone} message={formError} /> : null}
      <button type="submit" className={styles.button} disabled={pending}>
        {pending ? "Sending…" : "Request this slot"}
      </button>
    </form>
    </FormShell>
  );
}

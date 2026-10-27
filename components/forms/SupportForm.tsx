"use client";

import { useRef, useState } from "react";
import { POLICY_VERSION, SUPPORT_CONTACT, SUPPORT_INTENTS, SUPPORT_KINDS } from "@/lib/forms/policies";
import { fieldErrors, supportSchema } from "@/lib/forms/schemas";
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

const KIND_LABELS: Record<(typeof SUPPORT_KINDS)[number], string> = {
  lighting: "Court lighting",
  balls: "Balls",
  jerseys: "Jerseys",
  equipment: "Other equipment",
  cash: "Cash",
  other: "Something else",
};

const INTENT_LABELS: Record<(typeof SUPPORT_INTENTS)[number], string> = {
  sponsorship: "I want to discuss a sponsorship",
  gift_ready: "I have a specific gift ready",
  ask_what_helps: "I am asking what is most useful",
};

export default function SupportForm({ initialLighting = false }: { initialLighting?: boolean }) {
  const tone = "dark" as const;
  const styles = toneClasses(tone);
  const startedAt = useRef(Date.now());
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    organisation: "",
    phone: "",
    email: "",
    preferred_contact: "",
    kinds: initialLighting ? ["lighting"] : ([] as string[]),
    intent: "",
    lighting_note: "",
    item_description: "",
    quantity: "",
    cash_amount: "",
    message: "",
    privacy: false,
    recognition: false,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const wantsGear = form.kinds.some((kind) => kind === "balls" || kind === "jerseys" || kind === "equipment");

  async function submit() {
    setFormError("");
    const payload = {
      name: form.name,
      organisation: form.organisation,
      phone: form.phone,
      email: form.email,
      preferred_contact: form.preferred_contact,
      kinds: form.kinds,
      intent: form.intent,
      lighting_note: form.lighting_note,
      item_description: form.item_description,
      quantity: form.quantity,
      cash_amount: form.cash_amount,
      message: form.message,
      consents: [
        { key: "privacy", required: true, accepted: form.privacy, policy_version: POLICY_VERSION },
        { key: "recognition", required: false, accepted: form.recognition, policy_version: POLICY_VERSION },
      ],
      website,
      started_at: startedAt.current,
    };
    const parsed = supportSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/forms/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.fieldErrors || {});
        setFormError(data.error || "We could not save this offer.");
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
      <FormShell tone={tone} title="Offer logged" subtitle="Someone will reply.">
        <SuccessPanel
          tone={tone}
          title="Offer logged"
          body="Someone from the team will reply. This form does not collect payment, and the gift is not marked received until it arrives."
        />
      </FormShell>
    );
  }

  return (
    <FormShell tone={tone} title="Support the court" subtitle="Lighting, gear, or cash. No payment is taken here.">
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
      <Field tone={tone} label="Organisation" htmlFor="organisation" error={errors.organisation}>
        <TextInput tone={tone} id="organisation" value={form.organisation} onChange={(event) => set("organisation", event.target.value)} />
      </Field>
      <Field tone={tone} label="Phone" htmlFor="phone" required error={errors.phone}>
        <TextInput tone={tone} id="phone" inputMode="tel" placeholder="024 000 0000" value={form.phone} onChange={(event) => set("phone", event.target.value)} />
      </Field>
      <Field tone={tone} label="Email" htmlFor="email" error={errors.email}>
        <TextInput tone={tone} id="email" type="email" value={form.email} onChange={(event) => set("email", event.target.value)} />
      </Field>
      <Field tone={tone} label="How should we reply?" required error={errors.preferred_contact}>
        <ChoiceList
          tone={tone}
          value={form.preferred_contact}
          onChange={(value) => set("preferred_contact", value as string)}
          options={SUPPORT_CONTACT.map((item) => ({
            value: item,
            label: item === "whatsapp" ? "WhatsApp" : item[0].toUpperCase() + item.slice(1),
          }))}
        />
      </Field>
      <Field tone={tone} label="What do you want to support?" required error={errors.kinds}>
        <ChoiceList
          tone={tone}
          multiple
          value={form.kinds}
          onChange={(value) => set("kinds", value as string[])}
          options={SUPPORT_KINDS.map((kind) => ({ value: kind, label: KIND_LABELS[kind] }))}
        />
      </Field>
      <Field tone={tone} label="How do you want to help?" required error={errors.intent}>
        <ChoiceList
          tone={tone}
          value={form.intent}
          onChange={(value) => set("intent", value as string)}
          options={SUPPORT_INTENTS.map((intent) => ({ value: intent, label: INTENT_LABELS[intent] }))}
        />
      </Field>
      {form.kinds.includes("lighting") && (
        <>
          <Guide tone={tone}>You do not need a specification. Tell us if you can fund, supply, or introduce an installer. We will follow up with what the court actually needs.</Guide>
          <Field tone={tone} label="Lighting note" htmlFor="lighting_note" error={errors.lighting_note}>
            <TextArea tone={tone} id="lighting_note" value={form.lighting_note} onChange={(event) => set("lighting_note", event.target.value)} />
          </Field>
        </>
      )}
      {wantsGear && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field tone={tone} label="Item" htmlFor="item_description" error={errors.item_description} hint="Optional. Balls, jersey sizes, or other gear.">
            <TextInput tone={tone} id="item_description" value={form.item_description} onChange={(event) => set("item_description", event.target.value)} />
          </Field>
          <Field tone={tone} label="Rough quantity" htmlFor="quantity" error={errors.quantity}>
            <TextInput tone={tone} id="quantity" inputMode="numeric" value={form.quantity} onChange={(event) => set("quantity", event.target.value)} />
          </Field>
        </div>
      )}
      {form.kinds.includes("cash") && (
        <>
          <Guide tone={tone}>A figure is optional. This form does not collect payment.</Guide>
          <Field tone={tone} label="Amount in GHS" htmlFor="cash_amount" error={errors.cash_amount}>
            <TextInput tone={tone} id="cash_amount" inputMode="decimal" value={form.cash_amount} onChange={(event) => set("cash_amount", event.target.value)} />
          </Field>
        </>
      )}
      <Field tone={tone} label="Message" htmlFor="message" error={errors.message}>
        <TextArea tone={tone} id="message" value={form.message} onChange={(event) => set("message", event.target.value)} />
      </Field>
      <ConsentGroup
        tone={tone}
        errors={errors}
        value={{ privacy: form.privacy, recognition: form.recognition }}
        onChange={(key, accepted) => {
          if (key === "privacy") set("privacy", accepted);
          if (key === "recognition") set("recognition", accepted);
        }}
        items={[
          { key: "privacy", required: true, sentence: "I understand this offer is stored so the team can reply and account for anything that arrives." },
          { key: "recognition", required: false, sentence: "You may list my name or organisation once the gift is received." },
        ]}
      />
      {formError ? <FormBanner tone={tone} message={formError} /> : null}
      <button type="submit" className={styles.button} disabled={pending}>
        {pending ? "Sending…" : "Send offer"}
      </button>
    </form>
    </FormShell>
  );
}

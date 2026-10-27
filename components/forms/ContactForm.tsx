"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CONTACT_METHODS, CONTACT_SUBJECTS, POLICY_VERSION } from "@/lib/forms/policies";
import { contactSchema, fieldErrors } from "@/lib/forms/schemas";
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

export default function ContactForm() {
  const tone = "dark" as const;
  const styles = toneClasses(tone);
  const startedAt = useRef(Date.now());
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [branch, setBranch] = useState<"form" | "partnership" | "volunteer">("form");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    preferred_method: "",
    privacy: false,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setFormError("");
    const payload = {
      ...form,
      consents: [{ key: "privacy", required: true, accepted: form.privacy, policy_version: POLICY_VERSION }],
      website,
      started_at: startedAt.current,
    };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/forms/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.fieldErrors || {});
        setFormError(data.error || "We could not send that message.");
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
      <FormShell tone={tone} title="Message received" subtitle="We will reply.">
        <SuccessPanel
          tone={tone}
          title="Message received"
          body="We have it. The team will reply by the method you chose."
        />
      </FormShell>
    );
  }

  return (
    <FormShell tone={tone} title="Send a message" subtitle="Questions, press, events, and complaints land here.">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (branch === "form") void submit();
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
        <Field tone={tone} label="Name" htmlFor="name" required error={errors.name}>
          <TextInput tone={tone} id="name" value={form.name} onChange={(event) => set("name", event.target.value)} />
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
        <Field tone={tone} label="Subject" htmlFor="subject" required error={errors.subject}>
          <SelectInput
            tone={tone}
            id="subject"
            value={branch === "partnership" ? "partnership" : branch === "volunteer" ? "volunteer" : form.subject}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "partnership") {
                setBranch("partnership");
                return;
              }
              if (value === "volunteer") {
                setBranch("volunteer");
                return;
              }
              setBranch("form");
              set("subject", value);
            }}
          >
            <option value="">Choose</option>
            {CONTACT_SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
            <option value="volunteer">Volunteering / Join the team</option>
            <option value="partnership">Partnership/Sponsorship</option>
          </SelectInput>
        </Field>

        {branch === "partnership" ? (
          <Guide tone={tone}>
            Sponsorship and gifts have their own form, so we can account for what arrives.{" "}
            <Link href="/support" className={styles.link}>
              Open the support invitation
            </Link>
            .
          </Guide>
        ) : null}

        {branch === "volunteer" ? (
          <Guide tone={tone}>
            Volunteers, coaches, and management join through one form so we can keep roles clear.{" "}
            <Link href="/join" className={styles.link}>
              Open Join the court
            </Link>
            .
          </Guide>
        ) : null}

        {branch === "form" ? (
          <>
            <Field tone={tone} label="Email" htmlFor="email" error={errors.email} hint="Required if you want a reply by email.">
              <TextInput
                tone={tone}
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => set("email", event.target.value)}
              />
            </Field>
            <Field tone={tone} label="How should we reply?" required error={errors.preferred_method}>
              <ChoiceList
                tone={tone}
                value={form.preferred_method}
                onChange={(value) => set("preferred_method", value as string)}
                options={CONTACT_METHODS.map((method) => ({ value: method, label: method }))}
              />
            </Field>
            <Field tone={tone} label="Message" htmlFor="message" required error={errors.message}>
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
              value={{ privacy: form.privacy }}
              onChange={(_key, accepted) => set("privacy", accepted)}
              items={[
                {
                  key: "privacy",
                  required: true,
                  sentence:
                    "I understand this message is stored so the team can reply. It is not added to player impact reports.",
                },
              ]}
            />
            {formError ? <FormBanner tone={tone} message={formError} /> : null}
            <button type="submit" className={styles.button} disabled={pending}>
              {pending ? "Sending…" : "Send message"}
            </button>
          </>
        ) : null}
      </form>
    </FormShell>
  );
}

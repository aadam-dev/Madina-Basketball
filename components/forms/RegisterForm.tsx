"use client";

import { useRef, useState } from "react";
import { ageFromDob } from "@/lib/forms/phone";
import {
  AREAS,
  GENDERS,
  HEARD_FROM,
  POLICY_VERSION,
  RELATIONSHIPS,
  SKILL_LEVELS,
  type ConsentKey,
} from "@/lib/forms/policies";
import { fieldErrors, registerSchema } from "@/lib/forms/schemas";
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

const STEPS = ["About you", "How you play", "Safety", "Agreements"];

const emptyConsents: Partial<Record<ConsentKey, boolean>> = {
  rules: false,
  privacy: false,
  impact: false,
  photo: false,
};

export default function RegisterForm() {
  const tone = "light" as const;
  const styles = toneClasses(tone);
  const startedAt = useRef(Date.now());
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [website, setWebsite] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    area: "",
    area_other: "",
    skill_level: "",
    interests: [] as string[],
    heard_from: "",
    emergency_name: "",
    emergency_relationship: "",
    emergency_phone: "",
    guardian_name: "",
    guardian_relationship: "",
    guardian_phone: "",
    guardian_consent: false,
    medical_notes: "",
    consents: emptyConsents,
  });

  const age = ageFromDob(form.date_of_birth);
  const minor = age !== null && age < 18;

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const stepFields = [
    ["full_name", "date_of_birth", "phone", "email", "area", "area_other", "gender"],
    ["skill_level", "interests", "heard_from"],
    ["emergency_name", "emergency_relationship", "emergency_phone", "guardian_name", "guardian_relationship", "guardian_phone", "guardian_consent", "medical_notes"],
  ];

  function payload() {
    return {
      ...form,
      consents: (["rules", "privacy", "impact", "photo"] as ConsentKey[]).map((key) => ({
        key,
        required: key !== "photo",
        accepted: form.consents[key] === true,
        policy_version: POLICY_VERSION,
      })),
      website,
      started_at: startedAt.current,
    };
  }

  function continueStep() {
    const parsed = registerSchema.safeParse(payload());
    if (!parsed.success) {
      const next = fieldErrors(parsed.error);
      const current = stepFields[step].filter((key) => next[key]);
      if (current.length) {
        setErrors(Object.fromEntries(current.map((key) => [key, next[key]])));
        return;
      }
    }
    setErrors({});
    setStep(step + 1);
  }

  async function submit() {
    setFormError("");
    const body = payload();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const next = fieldErrors(parsed.error);
      setErrors(next);
      const first = Object.keys(next)[0];
      if (["full_name", "date_of_birth", "phone", "email", "area", "area_other", "gender"].includes(first || "")) setStep(0);
      else if (["skill_level", "interests", "heard_from"].includes(first || "")) setStep(1);
      else if (first?.startsWith("emergency") || first?.startsWith("guardian") || first === "medical_notes") setStep(2);
      else setStep(3);
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/forms/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.fieldErrors || {});
        setFormError(data.error || "We could not save your registration.");
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
      <FormShell tone={tone} title="You're registered" subtitle="Welcome to the court.">
        <SuccessPanel
          tone={tone}
          title="You're registered"
          body="We have your details. The team will confirm you and add you to the player list. Watch your phone for updates about sessions."
        />
      </FormShell>
    );
  }

  return (
    <FormShell
      tone={tone}
      title="Player registration"
      subtitle="One form for every player. Girls, boys, women, and men use the same signup."
      steps={STEPS}
      activeStep={step}
    >
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (step < 3) continueStep();
        else void submit();
      }}
    >
      <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(event) => setWebsite(event.target.value)} name="website" />

      {step === 0 && (
        <div className="grid gap-4">
          <Field tone={tone} label="Full name" htmlFor="full_name" required error={errors.full_name}>
            <TextInput tone={tone} id="full_name" value={form.full_name} onChange={(event) => set("full_name", event.target.value)} />
          </Field>
          <Field tone={tone} label="Date of birth" htmlFor="date_of_birth" required error={errors.date_of_birth} hint={age !== null ? `Age ${age}` : undefined}>
            <TextInput tone={tone} id="date_of_birth" type="date" value={form.date_of_birth} onChange={(event) => set("date_of_birth", event.target.value)} />
          </Field>
          <Field tone={tone} label="Phone" htmlFor="phone" required error={errors.phone} hint="A Ghana number. WhatsApp is fine.">
            <TextInput tone={tone} id="phone" inputMode="tel" placeholder="024 000 0000" value={form.phone} onChange={(event) => set("phone", event.target.value)} />
          </Field>
          <Field tone={tone} label="Email" htmlFor="email" error={errors.email} hint="Optional if we can reach you by phone.">
            <TextInput tone={tone} id="email" type="email" value={form.email} onChange={(event) => set("email", event.target.value)} />
          </Field>
          <Field tone={tone} label="Area" htmlFor="area" required error={errors.area}>
            <SelectInput tone={tone} id="area" value={form.area} onChange={(event) => set("area", event.target.value)}>
              <option value="">Choose an area</option>
              {AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </SelectInput>
          </Field>
          {form.area === "Other" && (
            <Field tone={tone} label="Which area?" htmlFor="area_other" required error={errors.area_other}>
              <TextInput tone={tone} id="area_other" value={form.area_other} onChange={(event) => set("area_other", event.target.value)} />
            </Field>
          )}
          <Field tone={tone} label="Gender" htmlFor="gender" error={errors.gender} hint="Optional. We use this only for impact counts, and you can skip it.">
            <SelectInput tone={tone} id="gender" value={form.gender} onChange={(event) => set("gender", event.target.value)}>
              <option value="">Skip</option>
              {GENDERS.map((gender) => (
                <option key={gender} value={gender}>
                  {gender === "prefer_not_to_say" ? "Prefer not to say" : gender[0].toUpperCase() + gender.slice(1)}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4">
          <Field tone={tone} label="Skill level" required error={errors.skill_level}>
            <ChoiceList
              tone={tone}
              value={form.skill_level}
              onChange={(value) => set("skill_level", value as string)}
              options={SKILL_LEVELS.map((level) => ({ value: level, label: level[0].toUpperCase() + level.slice(1) }))}
            />
          </Field>
          <Field tone={tone} label="How do you want to play?" required error={errors.interests}>
            <ChoiceList
              tone={tone}
              multiple
              value={form.interests}
              onChange={(value) => set("interests", value as string[])}
              options={[
                { value: "pickup", label: "Pickup games" },
                { value: "training", label: "Training" },
                { value: "competitive", label: "Competitive team" },
                { value: "girls_women", label: "Girls / women sessions" },
              ]}
            />
          </Field>
          <Field tone={tone} label="How did you hear about the court?" htmlFor="heard_from" error={errors.heard_from}>
            <SelectInput tone={tone} id="heard_from" value={form.heard_from} onChange={(event) => set("heard_from", event.target.value)}>
              <option value="">Optional</option>
              {HEARD_FROM.map((item) => (
                <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>
              ))}
            </SelectInput>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4">
          <Guide tone={tone}>
            If you get injured on court, this is who we call. Use someone who can answer during play, not your own number.
          </Guide>
          <Field tone={tone} label="Emergency contact name" htmlFor="emergency_name" required error={errors.emergency_name}>
            <TextInput tone={tone} id="emergency_name" value={form.emergency_name} onChange={(event) => set("emergency_name", event.target.value)} />
          </Field>
          <Field tone={tone} label="Relationship" htmlFor="emergency_relationship" required error={errors.emergency_relationship}>
            <SelectInput tone={tone} id="emergency_relationship" value={form.emergency_relationship} onChange={(event) => set("emergency_relationship", event.target.value)}>
              <option value="">Choose</option>
              {RELATIONSHIPS.map((item) => (
                <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>
              ))}
            </SelectInput>
          </Field>
          <Field tone={tone} label="Emergency phone" htmlFor="emergency_phone" required error={errors.emergency_phone}>
            <TextInput tone={tone} id="emergency_phone" inputMode="tel" placeholder="024 000 0000" value={form.emergency_phone} onChange={(event) => set("emergency_phone", event.target.value)} />
          </Field>
          <Field tone={tone} label="Medical note" htmlFor="medical_notes" error={errors.medical_notes} hint="Optional. Only what a coach should know in an emergency, such as asthma. This is never shown publicly.">
            <TextArea tone={tone} id="medical_notes" value={form.medical_notes} onChange={(event) => set("medical_notes", event.target.value)} />
          </Field>
          {minor && (
            <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <Guide tone={tone}>
                Players under 18 need a parent or guardian to agree. This matches our terms.
              </Guide>
              <Field tone={tone} label="Guardian name" htmlFor="guardian_name" required error={errors.guardian_name}>
                <TextInput tone={tone} id="guardian_name" value={form.guardian_name} onChange={(event) => set("guardian_name", event.target.value)} />
              </Field>
              <Field tone={tone} label="Relationship" htmlFor="guardian_relationship" required error={errors.guardian_relationship}>
                <SelectInput tone={tone} id="guardian_relationship" value={form.guardian_relationship} onChange={(event) => set("guardian_relationship", event.target.value)}>
                  <option value="">Choose</option>
                  {RELATIONSHIPS.map((item) => (
                    <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field tone={tone} label="Guardian phone" htmlFor="guardian_phone" required error={errors.guardian_phone}>
                <TextInput tone={tone} id="guardian_phone" inputMode="tel" value={form.guardian_phone} onChange={(event) => set("guardian_phone", event.target.value)} />
              </Field>
              <label className={styles.choice}>
                <input type="checkbox" className="mt-1" checked={form.guardian_consent} onChange={(event) => set("guardian_consent", event.target.checked)} />
                <span>A parent or guardian agrees to this registration.</span>
              </label>
              {errors.guardian_consent ? <p className={styles.error}>{errors.guardian_consent}</p> : null}
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <ConsentGroup
          tone={tone}
          errors={errors}
          value={form.consents}
          onChange={(key, accepted) => set("consents", { ...form.consents, [key]: accepted })}
          preface={minor ? "I am the player, or the parent or guardian of a player under 18." : undefined}
          items={[
            { key: "rules", required: true, sentence: "I agree to the court rules and code of conduct." },
            { key: "privacy", required: true, sentence: "I understand how my information is used." },
            { key: "impact", required: true, sentence: "I agree to be counted in aggregate impact reports. My name, phone, and emergency details are never included." },
            { key: "photo", required: false, sentence: "Madina Basketball may use photos or video of me." },
          ]}
        />
      )}

      {formError ? <FormBanner tone={tone} message={formError} /> : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 && (
          <button type="button" className={styles.secondary} onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        <button type="submit" className={styles.button} disabled={pending}>
          {step < 3 ? "Continue" : pending ? "Sending…" : "Submit registration"}
        </button>
      </div>
    </form>
    </FormShell>
  );
}

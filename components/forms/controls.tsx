"use client";

import { useState, type ReactNode } from "react";
import { CONSENT_COPY, type ConsentKey } from "@/lib/forms/policies";

export type Tone = "light" | "dark";

export function toneClasses(tone: Tone) {
  if (tone === "dark") {
    return {
      label: "block text-sm font-semibold text-white/85 mb-1.5",
      input:
        "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-white placeholder:text-white/30 outline-none focus:border-[#ff6b35]",
      hint: "mt-1 text-xs text-white/40",
      error: "mt-1 text-xs text-red-300",
      guide: "rounded-lg border border-[#ff6b35]/30 bg-[#ff6b35]/10 px-3 py-2 text-sm leading-relaxed text-white/75",
      choice: "flex items-start gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80",
      button: "rounded-lg bg-[#ff6b35] px-6 py-3 text-sm font-bold text-white hover:bg-[#e55a2b] disabled:opacity-60",
      secondary: "rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10",
      link: "text-[#ff6b35] underline underline-offset-2",
      dialog: "w-full max-w-lg rounded-2xl bg-[#111] p-6 text-white shadow-xl border border-white/10",
    };
  }
  return {
    label: "block text-sm font-semibold text-gray-800 mb-1.5",
    input:
      "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-primary",
    hint: "mt-1 text-xs text-gray-500",
    error: "mt-1 text-xs text-red-600",
    guide: "rounded-lg border border-primary/20 bg-orange-50 px-3 py-2 text-sm leading-relaxed text-gray-700",
    choice: "flex items-start gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700",
    button: "rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60",
    secondary: "rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50",
    link: "text-primary underline underline-offset-2",
    dialog: "w-full max-w-lg rounded-2xl bg-white p-6 text-gray-900 shadow-xl",
  };
}

export function Field({
  tone,
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  tone: Tone;
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const styles = toneClasses(tone);
  return (
    <div>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required ? " *" : ""}
      </label>
      {children}
      {hint && !error ? <p className={styles.hint}>{hint}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}

export function Guide({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <p className={toneClasses(tone).guide}>{children}</p>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement> & { tone: Tone }) {
  const { tone, className, ...rest } = props;
  return <input className={`${toneClasses(tone).input} ${className ?? ""}`} {...rest} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { tone: Tone }) {
  const { tone, className, ...rest } = props;
  return <textarea className={`${toneClasses(tone).input} min-h-28 ${className ?? ""}`} {...rest} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement> & { tone: Tone }) {
  const { tone, className, children, ...rest } = props;
  return (
    <select className={`${toneClasses(tone).input} ${className ?? ""}`} {...rest}>
      {children}
    </select>
  );
}

export function ChoiceList({
  tone,
  options,
  value,
  onChange,
  multiple,
}: {
  tone: Tone;
  options: { value: string; label: string }[];
  value: string | string[];
  onChange: (next: string | string[]) => void;
  multiple?: boolean;
}) {
  const styles = toneClasses(tone);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const checked = multiple
          ? (value as string[]).includes(option.value)
          : value === option.value;
        return (
          <label key={option.value} className={styles.choice}>
            <input
              type={multiple ? "checkbox" : "radio"}
              className="mt-0.5"
              checked={checked}
              onChange={() => {
                if (!multiple) {
                  onChange(option.value);
                  return;
                }
                const current = value as string[];
                onChange(
                  checked ? current.filter((item) => item !== option.value) : [...current, option.value]
                );
              }}
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function ConsentGroup({
  tone,
  items,
  value,
  onChange,
  errors,
  preface,
}: {
  tone: Tone;
  items: { key: ConsentKey; required: boolean; sentence: ReactNode }[];
  value: Partial<Record<ConsentKey, boolean>>;
  onChange: (key: ConsentKey, accepted: boolean) => void;
  errors: Record<string, string>;
  preface?: string;
}) {
  const styles = toneClasses(tone);
  const [open, setOpen] = useState<ConsentKey | null>(null);
  const copy = open ? CONSENT_COPY[open] : null;

  return (
    <div className="space-y-3">
      {preface ? <Guide tone={tone}>{preface}</Guide> : null}
      {items.map((item) => (
        <div key={item.key}>
          <label className={styles.choice}>
            <input
              type="checkbox"
              className="mt-1"
              checked={value[item.key] === true}
              onChange={(event) => onChange(item.key, event.target.checked)}
            />
            <span>
              {item.sentence}{" "}
              <button type="button" className={styles.link} onClick={() => setOpen(item.key)}>
                Read
              </button>
              {item.required ? "" : " Optional."}
            </span>
          </label>
          {errors[item.key] ? <p className={styles.error}>{errors[item.key]}</p> : null}
        </div>
      ))}
      {copy && open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="consent-title">
          <div className={styles.dialog}>
            <h3 id="consent-title" className="text-lg font-bold mb-3">{copy.title}</h3>
            <p className="text-sm leading-relaxed mb-4 opacity-80">{copy.summary}</p>
            <div className="flex flex-wrap gap-3">
              <a href={copy.href} target="_blank" rel="noopener noreferrer" className={styles.button}>
                Open full page
              </a>
              <button type="button" className={styles.secondary} onClick={() => setOpen(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function FormBanner({ tone, message }: { tone: Tone; message: string }) {
  return <p className={tone === "dark" ? "text-sm text-red-300" : "text-sm text-red-600"}>{message}</p>;
}

export function SuccessPanel({
  tone,
  title,
  body,
}: {
  tone: Tone;
  title: string;
  body: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={dark ? "rounded-2xl border border-white/10 bg-[#111] p-8 text-center" : "rounded-xl bg-white p-8 text-center shadow-sm"}>
      <h3 className={dark ? "text-2xl font-black uppercase mb-3" : "text-2xl font-bold mb-3"}>{title}</h3>
      <p className={dark ? "text-white/70" : "text-gray-600"}>{body}</p>
    </div>
  );
}

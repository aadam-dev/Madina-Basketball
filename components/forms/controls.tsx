"use client";

import { useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CONSENT_COPY, type ConsentKey } from "@/lib/forms/policies";

export type Tone = "light" | "dark";

export function toneClasses(tone: Tone) {
  if (tone === "dark") {
    return {
      label: "mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white/55",
      input:
        "w-full rounded-xl border border-white/12 bg-black/35 px-4 py-3.5 text-[15px] text-white placeholder:text-white/30 outline-none transition focus:border-[#ff6b35] focus:bg-black/50 focus:ring-4 focus:ring-[#ff6b35]/15",
      hint: "mt-1.5 text-xs leading-relaxed text-white/40",
      error: "mt-1.5 text-xs font-medium text-red-300",
      guide:
        "rounded-xl border border-[#ff6b35]/25 bg-[#ff6b35]/10 px-4 py-3 text-sm leading-relaxed text-white/75",
      choice:
        "group relative flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]",
      choiceActive: "border-[#ff6b35]/55 bg-[#ff6b35]/12 text-white shadow-[0_0_0_1px_rgba(255,107,53,0.25)]",
      button:
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6b35] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_-12px_rgba(255,107,53,0.7)] transition hover:bg-[#e55a2b] hover:shadow-[0_14px_32px_-12px_rgba(255,107,53,0.85)] active:scale-[0.98] disabled:opacity-60",
      secondary:
        "inline-flex items-center justify-center rounded-xl border border-white/15 bg-transparent px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5 active:scale-[0.98]",
      link: "font-semibold text-[#ff6b35] underline decoration-[#ff6b35]/40 underline-offset-2 hover:decoration-[#ff6b35]",
      dialog: "w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-6 text-white shadow-xl",
    };
  }
  return {
    label: "mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-500",
    input:
      "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-[#ff6b35]/15",
    hint: "mt-1.5 text-xs leading-relaxed text-slate-500",
    error: "mt-1.5 text-xs font-medium text-red-600",
    guide: "rounded-xl border border-[#ff6b35]/20 bg-orange-50/80 px-4 py-3 text-sm leading-relaxed text-slate-700",
    choice:
      "group relative flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50",
    choiceActive: "border-[#ff6b35]/50 bg-[#fff7f3] text-slate-900 shadow-[0_0_0_1px_rgba(255,107,53,0.2)]",
    button:
      "inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6b35] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_-12px_rgba(255,107,53,0.65)] transition hover:bg-[#e55a2b] hover:shadow-[0_14px_32px_-12px_rgba(255,107,53,0.8)] active:scale-[0.98] disabled:opacity-60",
    secondary:
      "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]",
    link: "font-semibold text-[#ff6b35] underline decoration-[#ff6b35]/35 underline-offset-2 hover:decoration-[#ff6b35]",
    dialog: "w-full max-w-lg rounded-2xl bg-white p-6 text-slate-900 shadow-xl",
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
    <div className="min-w-0">
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required ? <span className="ml-1 text-[#ff6b35]">*</span> : null}
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
  return <textarea className={`${toneClasses(tone).input} min-h-28 resize-y ${className ?? ""}`} {...rest} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement> & { tone: Tone }) {
  const { tone, className, children, ...rest } = props;
  const dark = tone === "dark";
  return (
    <div className="relative block">
      <select
        className={`${toneClasses(tone).input} appearance-none bg-none pr-12 ${className ?? ""}`}
        {...rest}
      >
        {children}
      </select>
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center ${
          dark ? "text-white/45" : "text-slate-400"
        }`}
      >
        <ChevronDown className="h-4 w-4 shrink-0" strokeWidth={2.25} />
      </span>
    </div>
  );
}

export function SegmentedChoice({
  tone,
  options,
  value,
  onChange,
}: {
  tone: Tone;
  options: { value: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`grid gap-2 rounded-2xl p-1.5 ${
        dark ? "bg-black/40" : "bg-slate-100"
      }`}
      style={{ gridTemplateColumns: `repeat(${Math.min(options.length, 3)}, minmax(0, 1fr))` }}
      role="radiogroup"
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
              active
                ? "bg-[#ff6b35] text-white shadow-sm"
                : dark
                  ? "text-white/55 hover:bg-white/5 hover:text-white"
                  : "text-slate-600 hover:bg-white hover:text-slate-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ChoiceList({
  tone,
  options,
  value,
  onChange,
  multiple,
  columns = 2,
}: {
  tone: Tone;
  options: { value: string; label: string; hint?: string }[];
  value: string | string[];
  onChange: (next: string | string[]) => void;
  multiple?: boolean;
  columns?: 2 | 3 | 4;
}) {
  const styles = toneClasses(tone);
  const dark = tone === "dark";
  const colClass =
    columns === 4
      ? "sm:grid-cols-4"
      : columns === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";

  return (
    <div className={`grid gap-2.5 ${colClass}`}>
      {options.map((option) => {
        const checked = multiple
          ? (value as string[]).includes(option.value)
          : value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={checked}
            onClick={() => {
              if (!multiple) {
                onChange(option.value);
                return;
              }
              const current = value as string[];
              onChange(
                checked ? current.filter((item) => item !== option.value) : [...current, option.value]
              );
            }}
            className={`text-left ${styles.choice} ${checked ? styles.choiceActive : ""}`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                checked
                  ? "border-[#ff6b35] bg-[#ff6b35] text-white"
                  : dark
                    ? "border-white/20 bg-transparent text-transparent"
                    : "border-slate-300 bg-white text-transparent"
              }`}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold leading-snug">{option.label}</span>
              {option.hint ? (
                <span className={`mt-0.5 block text-xs ${dark ? "text-white/40" : "text-slate-500"}`}>
                  {option.hint}
                </span>
              ) : null}
            </span>
          </button>
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
  const dark = tone === "dark";
  const [open, setOpen] = useState<ConsentKey | null>(null);
  const copy = open ? CONSENT_COPY[open] : null;

  return (
    <div className="space-y-3">
      {preface ? <Guide tone={tone}>{preface}</Guide> : null}
      {items.map((item) => {
        const checked = value[item.key] === true;
        return (
          <div key={item.key}>
            <button
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => onChange(item.key, !checked)}
              className={`w-full text-left ${styles.choice} ${checked ? styles.choiceActive : ""}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                  checked
                    ? "border-[#ff6b35] bg-[#ff6b35] text-white"
                    : dark
                      ? "border-white/20"
                      : "border-slate-300"
                }`}
              >
                <Check className={`h-3.5 w-3.5 ${checked ? "opacity-100" : "opacity-0"}`} strokeWidth={3} />
              </span>
              <span className="min-w-0 leading-relaxed">
                {item.sentence}{" "}
                <span
                  role="link"
                  tabIndex={0}
                  className={styles.link}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpen(item.key);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      setOpen(item.key);
                    }
                  }}
                >
                  Read
                </span>
                {item.required ? null : (
                  <span className={dark ? "text-white/40" : "text-slate-400"}> · Optional</span>
                )}
              </span>
            </button>
            {errors[item.key] ? <p className={styles.error}>{errors[item.key]}</p> : null}
          </div>
        );
      })}
      {copy && open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
          onClick={() => setOpen(null)}
        >
          <div className={styles.dialog} onClick={(event) => event.stopPropagation()}>
            <h3 id="consent-title" className="mb-3 text-lg font-bold">
              {copy.title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed opacity-80">{copy.summary}</p>
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
  return (
    <p
      className={
        tone === "dark"
          ? "rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      }
    >
      {message}
    </p>
  );
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
    <div
      className={
        dark
          ? "rounded-2xl border border-white/10 bg-[#111] p-8 text-center"
          : "rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm"
      }
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff6b35]/15 text-[#ff6b35]">
        <Check className="h-7 w-7" strokeWidth={2.5} />
      </div>
      <h3 className={dark ? "mb-3 text-2xl font-black" : "mb-3 text-2xl font-bold text-slate-900"}>{title}</h3>
      <p className={dark ? "text-white/70" : "text-slate-600"}>{body}</p>
    </div>
  );
}

export function StepProgress({
  tone,
  steps,
  activeStep,
}: {
  tone: Tone;
  steps: string[];
  activeStep: number;
}) {
  const dark = tone === "dark";
  const pct = ((activeStep + 1) / steps.length) * 100;
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${dark ? "text-white/40" : "text-slate-400"}`}>
          Step {activeStep + 1} of {steps.length}
        </p>
        <p className={`text-sm font-semibold ${dark ? "text-white/70" : "text-slate-700"}`}>{steps[activeStep]}</p>
      </div>
      <div className={`h-1.5 overflow-hidden rounded-full ${dark ? "bg-white/10" : "bg-slate-200"}`}>
        <div
          className="h-full rounded-full bg-[#ff6b35] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-4 flex gap-1.5">
        {steps.map((label, index) => {
          const active = index === activeStep;
          const done = index < activeStep;
          return (
            <li
              key={label}
              className={`h-1.5 flex-1 rounded-full transition ${
                active || done ? "bg-[#ff6b35]" : dark ? "bg-white/10" : "bg-slate-200"
              }`}
              title={label}
            />
          );
        })}
      </ol>
    </div>
  );
}

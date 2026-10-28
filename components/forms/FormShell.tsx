"use client";

import type { ReactNode } from "react";
import type { Tone } from "./controls";
import { StepProgress } from "./controls";

export function FormShell({
  tone,
  title,
  subtitle,
  steps,
  activeStep,
  children,
}: {
  tone: Tone;
  title: string;
  subtitle?: string;
  steps?: string[];
  activeStep?: number;
  children: ReactNode;
}) {
  const shell = tone === "dark" ? "form-shell-dark" : "form-shell-light";
  const titleColor = tone === "dark" ? "text-white" : "text-slate-950";
  const subColor = tone === "dark" ? "text-white/55" : "text-slate-600";

  return (
    <div className={`${shell} p-6 sm:p-8`}>
      <div className="form-court-lines form-court-pulse" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-6 -top-8 opacity-90" aria-hidden="true">
        <svg width="120" height="120" viewBox="0 0 120 120" className="form-ball-bounce">
          <circle cx="60" cy="60" r="38" fill="#ff6b35" />
          <path
            d="M22 60c18-22 58-22 76 0M22 60c18 22 58 22 76 0M60 22c0 20 0 56 0 76M38 30c14 18 14 42 0 60M82 30c-14 18-14 42 0 60"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 opacity-40" aria-hidden="true">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="28" fill="none" stroke="#ff6b35" strokeWidth="2" strokeDasharray="4 6" />
          <circle cx="36" cy="36" r="10" fill="none" stroke="#004e89" strokeWidth="2" />
          <path d="M8 36h56M36 8v56" stroke="#ff6b35" strokeWidth="1.5" opacity="0.5" />
        </svg>
      </div>

      <div className="relative z-10">
        <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#ff6b35]">Madina Court</p>
        <h3 className={`text-balance text-2xl font-black tracking-tight sm:text-[1.75rem] ${titleColor}`}>{title}</h3>
        {subtitle ? <p className={`mt-1.5 max-w-xl text-pretty text-sm leading-relaxed ${subColor}`}>{subtitle}</p> : null}

        {steps && steps.length > 0 && typeof activeStep === "number" ? (
          <StepProgress tone={tone} steps={steps} activeStep={activeStep} />
        ) : null}

        <div key={activeStep ?? "form"} className="form-step-in mt-7">
          {children}
        </div>
      </div>
    </div>
  );
}

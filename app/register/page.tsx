import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import RegisterForm from "@/components/forms/RegisterForm";
import { ShareSignup } from "@/components/forms/ShareSignup";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://madinaball.vercel.app";

export const metadata: Metadata = {
  title: "Register to Play — Madina Basketball",
  description:
    "Sign up to play at Madina Basketball Court in Libya Quarters, Accra. All ages and skill levels welcome. Takes a few minutes.",
  alternates: { canonical: `${SITE_URL}/register` },
  openGraph: {
    title: "Register to Play — Madina Basketball",
    description:
      "Join the Madina court community. Open signup for pickup, training, and team play in Libya Quarters, Accra.",
    url: `${SITE_URL}/register`,
    siteName: "Madina Basketball",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register to Play — Madina Basketball",
    description: "Sign up for Madina Basketball Court. Libya Quarters, Accra.",
  },
};

export default function Register() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0b0a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,107,53,0.18),transparent_50%),radial-gradient(ellipse_at_100%_80%,rgba(0,78,137,0.2),transparent_45%)]"
      />

      <section className="relative border-b border-white/10">
        <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#ff6b35]">Madina Court · Accra</p>
            <h1 className="mt-3 text-balance text-4xl font-black tracking-tight sm:text-5xl">Register to play</h1>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-white/60">
              Open to every age and skill level. Fill the form once — we&apos;ll confirm you and keep you updated on
              sessions.
            </p>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/55">
              {["All skill levels", "Girls & boys welcome", "Takes a few minutes"].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[#ff6b35]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="signup" className="relative scroll-mt-24 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-5">
            <ShareSignup absoluteUrl={`${SITE_URL}/register`} />
            <RegisterForm />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/35">What happens next</p>
              <ol className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  ["1", "Submit", "Send your details through the form."],
                  ["2", "Confirm", "We verify and add you to the player list."],
                  ["3", "Play", "Get session updates on your phone."],
                ].map(([n, title, body]) => (
                  <li key={n}>
                    <p className="text-lg font-black text-[#ff6b35]">{n}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/45">{body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

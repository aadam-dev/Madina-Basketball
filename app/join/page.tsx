import Link from "next/link";
import { ClipboardList, Users, Dumbbell, Briefcase } from "lucide-react";
import RegisterForm from "@/components/forms/RegisterForm";
import RoleApplicationForm from "@/components/forms/RoleApplicationForm";

const ROLES = [
  {
    id: "player",
    href: "/join?role=player",
    title: "Player",
    body: "Register to play. One form for girls, boys, women, and men. You can mark interest in girls and women sessions.",
    icon: Users,
  },
  {
    id: "volunteer",
    href: "/join?role=volunteer",
    title: "Volunteer",
    body: "Help with events, admin, media, or match-day support.",
    icon: ClipboardList,
  },
  {
    id: "coach",
    href: "/join?role=coach",
    title: "Coach / trainer",
    body: "Run or assist training sessions. Tell us your experience and availability.",
    icon: Dumbbell,
  },
  {
    id: "management",
    href: "/join?role=management",
    title: "Management",
    body: "Help run the court: operations, youth, events, finance, or communications.",
    icon: Briefcase,
  },
] as const;

export default function JoinPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams.role || "";
  const active =
    role === "player" || role === "volunteer" || role === "coach" || role === "management"
      ? role
      : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#1a120c] py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 court-lines opacity-40" aria-hidden="true" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#ff6b35]">Join the court</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Play. Coach. Volunteer. Help run Madina Basketball.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/65">
            Pick how you want to show up. Players stay on one registration. Volunteers, coaches, and management each
            have a short application so the team can place people clearly.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
            {ROLES.map((item) => {
              const Icon = item.icon;
              const selected = active === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`group rounded-2xl border p-5 transition ${
                    selected
                      ? "border-[#ff6b35] bg-[#ff6b35]/10"
                      : "border-white/10 bg-white/[0.03] hover:border-[#ff6b35]/50 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff6b35]/15 text-[#ff6b35]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-bold">{item.title}</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-white/60">{item.body}</p>
                </Link>
              );
            })}
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            {!active ? (
              <p className="text-center text-white/45">Choose a role above to open the form.</p>
            ) : null}
            {active === "player" ? <RegisterForm /> : null}
            {active === "volunteer" ? <RoleApplicationForm role="volunteer" /> : null}
            {active === "coach" ? <RoleApplicationForm role="coach" /> : null}
            {active === "management" ? <RoleApplicationForm role="management" /> : null}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-white/40">
            Already a player?{" "}
            <Link href="/register" className="text-[#ff6b35] underline underline-offset-2">
              Register to Play
            </Link>{" "}
            still works. Looking to give lighting or gear?{" "}
            <Link href="/support" className="text-[#ff6b35] underline underline-offset-2">
              Support the Court
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

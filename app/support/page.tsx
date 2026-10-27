import SupportForm from "@/components/forms/SupportForm";
import Link from "next/link";

export const metadata = {
  title: "Support the Court - Madina Basketball",
  description: "Help fund court lighting, equipment, or a cash gift. Every received gift is accounted for.",
};

export default function SupportPage({
  searchParams,
}: {
  searchParams: { focus?: string };
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="border-b border-white/6 py-16 sm:py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Support</p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">
            Help keep the lights on
          </h1>
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              The court is open. The renovation was funded by the community, and those accounts stay on the{" "}
              <Link href="/transparency" className="text-[#ff6b35] underline underline-offset-2">transparency page</Link>.
            </p>
            <p>
              In January 2026 a solar lighting install could not power the court. The equipment was removed.
              Evening play runs on the national grid.
            </p>
            <p>
              The current ask is a lighting system with enough capacity for regular evening sessions.
              Funding, equipment, or an introduction to an installer are all useful. Specifications belong in the follow-up, not on this form.
            </p>
            <p>
              Balls, jerseys, other equipment, and cash are welcome alongside that. This form does not take payment.
              Whatever arrives is logged separately from the renovation total.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-2xl">
          <div className="bg-[#111] border border-white/8 rounded-2xl p-6 sm:p-8">
            <SupportForm initialLighting={searchParams.focus === "lighting"} />
          </div>
        </div>
      </section>
    </div>
  );
}

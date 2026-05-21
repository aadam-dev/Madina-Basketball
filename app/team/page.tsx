import { Users, Camera, Wrench, Trophy, Building2, Mail, Shield } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image_url: string;
  section: string;
  order_index: number;
}

/* ─── Static fallback roster (shown when DB is empty) ──────────────── */
const FALLBACK_MEMBERS: TeamMember[] = [
  {
    id: "1", section: "executive", order_index: 1,
    name: "Shafic",
    role: "Co-Founder & President",
    description: "The driving force behind Madina Basketball. Shafic mobilised the community, led fundraising, and turned a neglected court into a living hub for Accra's basketball culture.",
    image_url: "",
  },
  {
    id: "2", section: "executive", order_index: 2,
    name: "Adam",
    role: "Co-Founder & Operations Lead",
    description: "Adam co-founded Madina Basketball and oversees day-to-day operations, partnerships, and the digital infrastructure that keeps the community connected.",
    image_url: "",
  },
  {
    id: "3", section: "executive", order_index: 3,
    name: "Hisham",
    role: "Executive Member",
    description: "Hisham contributes strategic direction and community engagement, helping to grow the reach and impact of Madina Basketball.",
    image_url: "",
  },
  {
    id: "4", section: "executive", order_index: 4,
    name: "Kwame",
    role: "Executive Member & Head Coach",
    description: "Kwame bridges leadership and coaching — guiding both the executive vision and the development of players on the court.",
    image_url: "",
  },
  {
    id: "5", section: "executive", order_index: 5,
    name: "Titus",
    role: "Executive Member",
    description: "Titus supports governance and community relations, ensuring Madina Basketball stays true to its roots.",
    image_url: "",
  },
  {
    id: "6", section: "executive", order_index: 6,
    name: "Mustafa",
    role: "Executive Member",
    description: "Mustafa contributes on and off the court, playing a key role in organising events and engaging the wider community.",
    image_url: "",
  },
];

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("order_index", { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_MEMBERS;
    return data;
  } catch {
    return FALLBACK_MEMBERS;
  }
}

export default async function Team() {
  const allMembers = await getTeamMembers();

  const executiveBody  = allMembers.filter(m => m.section === "executive");
  const coaches        = allMembers.filter(m => m.section === "coach");
  const maintenance    = allMembers.filter(m => m.section === "maintenance");
  const stakeholders   = allMembers.filter(m => m.section === "stakeholder");
  const mediaTeam      = allMembers.filter(m => m.section === "media");

  const execOrder  = ["Shafic", "Adam", "Hisham", "Kwame", "Titus", "Mustafa"];
  const coachOrder = ["Kwame", "Hisham", "Lord", "Jesse"];
  const byOrder = (ord: string[]) => (a: TeamMember, b: TeamMember) => {
    const ai = ord.findIndex(n => a.name.includes(n));
    const bi = ord.findIndex(n => b.name.includes(n));
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  };
  const sortedExec   = [...executiveBody].sort(byOrder(execOrder));
  const sortedCoach  = [...coaches].sort(byOrder(coachOrder));

  /* ── Card ── */
  const MemberCard = ({ member }: { member: TeamMember }) => (
    <div className="group relative bg-[#111] border border-white/8 rounded-2xl overflow-hidden hover:border-[#ff6b35]/40 transition-all duration-300">
      <div className="relative h-60 bg-gradient-to-br from-[#ff6b35]/10 to-[#004e89]/10">
        <SafeImage
          src={member.image_url}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          placeholderSize="lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="text-white font-black text-lg uppercase tracking-tight">{member.name}</h3>
        <p className="text-[#ff6b35] font-bold text-xs uppercase tracking-widest mt-1 mb-3">{member.role}</p>
        {member.description && (
          <p className="text-white/50 text-sm leading-relaxed">{member.description}</p>
        )}
      </div>
    </div>
  );

  /* ── Section ── */
  const Section = ({
    title, members, isLead = false,
  }: { title: string; members: TeamMember[]; isLead?: boolean }) => {
    if (members.length === 0) return null;
    return (
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1 h-8 bg-[#ff6b35] rounded-full" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
        </div>
        {isLead && members.length >= 2 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mb-6">
              {members.slice(0, 2).map(m => <MemberCard key={m.id} member={m} />)}
            </div>
            {members.length > 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.slice(2).map(m => <MemberCard key={m.id} member={m} />)}
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden court-lines border-b border-white/6">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ff6b35] to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <span className="pill bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/30 mb-5 inline-flex">
            Leadership
          </span>
          <h1
            className="text-white font-black uppercase leading-none mb-5"
            style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.04em" }}
          >
            THE PEOPLE<br />
            <span className="text-[#ff6b35]">BEHIND</span> THE COURT
          </h1>
          <p className="text-white/50 max-w-xl text-base leading-relaxed">
            From strategic leadership to boots-on-ground operations — meet the team
            building Madina Basketball into something that lasts.
          </p>
        </div>
      </section>

      {/* ── Team Grid ── */}
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <Section title="Executive Leadership" members={sortedExec} isLead />
        <Section title="Coaching Staff"       members={sortedCoach} />
        <Section title="Maintenance & Oversight" members={maintenance} />
        <Section title="Key Stakeholders"     members={stakeholders} />
        <Section title="Media & Comms"        members={mediaTeam} />
      </div>

      {/* ── CTA ── */}
      <section className="border-t border-white/8 bg-[#0d0d0d] py-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
            Want to get involved?
          </h2>
          <p className="text-white/45 max-w-md mx-auto mb-8 text-sm">
            Whether as a volunteer, coach, or community supporter — there is always
            a place for you at Madina Basketball.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#ff6b35] text-white font-bold text-sm rounded-lg hover:bg-[#e55a2b] transition-colors uppercase tracking-wider"
          >
            <Mail className="w-4 h-4" /> Get in Touch
          </Link>
        </div>
      </section>

    </div>
  );
}

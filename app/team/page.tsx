import { Users, Camera, Wrench, Trophy, Building2, Mail, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

// Revalidate every 60 seconds to ensure fresh data
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

async function getTeamMembers() {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export default async function Team() {
  const allMembers = await getTeamMembers();

  // Group members by section
  const executiveBody = allMembers.filter(m => m.section === 'executive');
  const coaches = allMembers.filter(m => m.section === 'coach');
  const maintenanceTeam = allMembers.filter(m => m.section === 'maintenance');
  const keyStakeholders = allMembers.filter(m => m.section === 'stakeholder');
  const mediaTeam = allMembers.filter(m => m.section === 'media');

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'executive':
        return Shield;
      case 'coach':
        return Trophy;
      case 'maintenance':
        return Wrench;
      case 'stakeholder':
        return Building2;
      case 'media':
        return Camera;
      default:
        return Users;
    }
  };

  const renderTeamSection = (title: string, members: TeamMember[], icon: any, iconColor: string) => {
    if (members.length === 0) return null;

    const Icon = icon;

    return (
      <section className="py-16">
        <div className="flex items-center space-x-3 mb-12">
          <Icon className={`w-8 h-8 ${iconColor}`} />
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10">
                {member.image_url ? (
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-24 h-24 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Our Leadership Team
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Meet the dedicated individuals leading Madina Basketball. From strategic
              leadership to hands-on operations, our team works together to build and
              maintain a thriving basketball community.
            </p>
          </div>
        </div>
      </section>

      {/* Team Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderTeamSection("Executive Leadership", executiveBody, Shield, "text-primary")}
        {renderTeamSection("Coaching Staff", coaches, Trophy, "text-yellow-600")}
        {renderTeamSection("Maintenance & Oversight", maintenanceTeam, Wrench, "text-green-600")}
        {renderTeamSection("Key Stakeholders", keyStakeholders, Building2, "text-blue-600")}
        {renderTeamSection("Media & Communications", mediaTeam, Camera, "text-purple-600")}

        {/* Call to Action */}
        <section className="py-16">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Want to Get Involved?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We're always looking for passionate individuals to join our community. Whether
              as a volunteer, coach, or supporter, there's a place for you at Madina Basketball.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              <Mail className="w-5 h-5" />
              <span>Get in Touch</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

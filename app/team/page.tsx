import { Users, Camera, Wrench, Trophy, Building2, ArrowRight, Mail, Shield, DollarSign, Users2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Team() {
  // Executive Body - Strategic leadership
  const executiveBody = [
    {
      name: "Shafic",
      role: "Executive & Renovation Lead",
      description: "Led stakeholder engagements with community leaders, led fundraising efforts, and sourced support from his network. Instrumental in bringing the vision to life.",
      image: "/images/team/shafic.jpg",
    },
    {
      name: "Adam",
      role: "Executive & Renovation Lead",
      description: "Sourced contractors, designed dashboards, and tracked the entire renovation project. Co-led the renovation with focus on operations and transparency.",
      image: "/images/team/adam.jpg",
    },
    {
      name: "Mustafa",
      role: "Executive",
      description: "Member of the executive body driving strategic developments for Madina Basketball.",
      image: "/images/team/mustafa.jpg",
    },
    {
      name: "Hisham",
      role: "Executive & Coach",
      description: "Member of the executive body driving strategic developments. Also serves as a coach developing players.",
      image: "/images/team/hisham.jpg",
    },
    {
      name: "Kwame",
      role: "Executive",
      description: "Member of the executive body driving strategic developments for Madina Basketball.",
      image: "/images/team/kwame.jpg",
    },
    {
      name: "Titus",
      role: "Executive",
      description: "Member of the executive body driving strategic developments for Madina Basketball.",
      image: "/images/team/titus.jpg",
    },
  ];

  // Coaches
  const coaches = [
    {
      name: "Hisham",
      role: "Coach",
      description: "Developing players and building skills across all levels through training sessions.",
      image: "/images/team/hisham.jpg",
    },
    {
      name: "Mustafa",
      role: "Coach",
      description: "Leading training sessions and developing players' skills and character.",
      image: "/images/team/mustafa.jpg",
    },
    {
      name: "Peter",
      role: "Coach",
      description: "Dedicated to player development and skill building in the community.",
      image: "/images/team/peter.jpg",
    },
  ];

  // Maintenance & Court Oversight
  const maintenanceTeam = [
    {
      name: "Kwame Focus",
      role: "Court Maintenance & Oversight",
      description: "Ensuring the court remains in excellent condition and overseeing maintenance operations.",
      image: "/images/team/kwame-focus.jpg",
    },
    {
      name: "Baba",
      role: "Court Maintenance & Oversight",
      description: "Maintaining the court facility and ensuring it remains in top condition for the community.",
      image: "/images/team/baba.jpg",
    },
    {
      name: "Moh",
      role: "Treasurer & Court Maintenance",
      description: "Serving as treasurer managing finances, and also contributing to court maintenance and oversight.",
      image: "/images/team/moh.jpg",
    },
    {
      name: "Adam",
      role: "Court Oversight",
      description: "Overseeing court operations and maintenance as part of his role in the renovation project.",
      image: "/images/team/adam.jpg",
    },
  ];

  // Key Stakeholders
  const stakeholders = [
    {
      name: "Assemblyman of Madina",
      role: "Key Stakeholder",
      description: "Played a pivotal role in stakeholder engagements to allow the renovation to happen. Facilitated community support and approvals.",
      image: "/images/team/assemblyman.jpg",
    },
    {
      name: "Thuram",
      role: "Sports Complex Representative",
      description: "Represents the basketball court on the leadership of the Madina Sports Complex, ensuring coordination and integration.",
      image: "/images/team/thuram.jpg",
    },
  ];

  // Media Team
  const mediaTeam = [
    {
      name: "Media Team Member",
      role: "Photographer/Videographer",
      description: "Documenting games, events, and community moments to share the Madina Basketball story.",
      image: "/images/team/media-1.jpg",
    },
  ];

  // Team sections configuration
  const teamSections = [
    {
      title: "Executive Body",
      icon: <Shield className="w-6 h-6" />,
      description: "The strategic leadership team driving developments and decision-making for Madina Basketball.",
      members: executiveBody,
    },
    {
      title: "Coaches",
      icon: <Trophy className="w-6 h-6" />,
      description: "Dedicated coaches developing players and building skills across all levels.",
      members: coaches,
    },
    {
      title: "Court Maintenance & Oversight",
      icon: <Wrench className="w-6 h-6" />,
      description: "Ensuring the court remains in excellent condition for the community.",
      members: maintenanceTeam,
    },
    {
      title: "Key Stakeholders",
      icon: <Users2 className="w-6 h-6" />,
      description: "Community leaders and representatives who played crucial roles in making the renovation possible.",
      members: stakeholders,
    },
    {
      title: "Media Team",
      icon: <Camera className="w-6 h-6" />,
      description: "Capturing and sharing the story of Madina Basketball through photos, videos, and content.",
      members: mediaTeam,
    },
  ];

  // Component to render a team member card
  const TeamMemberCard = ({ member }: { member: { name: string; role: string; description: string; image: string } }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto overflow-hidden">
        {member.image && member.image !== "/images/team/placeholder.jpg" ? (
          <Image
            src={member.image}
            alt={member.name}
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <Users className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
      <p className="text-primary font-semibold text-center mb-4">{member.role}</p>
      <p className="text-gray-600 text-center text-sm leading-relaxed">{member.description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-tight">Our Team</h1>
            <p className="text-xl text-white/90">
              The dedicated individuals making Madina Basketball possible
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Madina Basketball is powered by a team of passionate individuals who contribute their time, 
              expertise, and dedication to make basketball accessible to the community. From executive 
              leadership to coaches, maintenance teams to key stakeholders, each person plays a crucial 
              role in our success.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Together, we're building something special for Madina.
            </p>
          </div>
        </div>
      </section>

      {/* Team Sections */}
      {teamSections.map((section, sectionIndex) => (
        <section key={sectionIndex} className={sectionIndex % 2 === 0 ? "py-20 bg-muted" : "py-20"}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
                  <div className="text-white">{section.icon}</div>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 uppercase tracking-tight">{section.title}</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">{section.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.members.map((member, memberIndex) => (
                  <TeamMemberCard key={memberIndex} member={member} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Call to Partner Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-tight">Partner With Us</h2>
              <p className="text-xl text-white/90 mb-8">
                Join us in building basketball in Madina. We're looking for partners who share our vision 
                for community development through sports.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Why Partner With Us?</h3>
                  <ul className="space-y-3 text-white/90">
                    <li className="flex items-start">
                      <span className="text-primary mr-3 font-bold">•</span>
                      <span>Reach a passionate, engaged community of basketball players and supporters</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 font-bold">•</span>
                      <span>Support youth development and community building in Madina</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 font-bold">•</span>
                      <span>Gain visibility through events, tournaments, and community programs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 font-bold">•</span>
                      <span>Be part of a transparent, community-driven initiative</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Partnership Opportunities</h3>
                  <ul className="space-y-3 text-white/90">
                    <li className="flex items-start">
                      <span className="text-primary mr-3 font-bold">•</span>
                      <span>Event Sponsorship (tournaments, training programs, community events)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 font-bold">•</span>
                      <span>Equipment & Materials Support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 font-bold">•</span>
                      <span>Court Maintenance & Upgrades</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 font-bold">•</span>
                      <span>Youth Development Programs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 font-bold">•</span>
                      <span>Media & Marketing Partnerships</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-white/20">
                <p className="text-lg mb-6 text-white/90">
                  Interested in partnering with Madina Basketball? Let's discuss how we can work together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="mailto:themadinacourt@gmail.com"
                    className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-tight">Join Our Team</h2>
            <p className="text-xl text-gray-700 mb-8">
              Have skills in coaching, media, maintenance, or community organizing? We're always looking 
              for dedicated individuals to join our team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
            >
              <span>Contact Us to Get Involved</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

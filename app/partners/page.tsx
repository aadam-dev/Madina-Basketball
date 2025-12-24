import { Heart, Handshake, Users, Trophy } from "lucide-react";

export default function Partners() {
  // Donor list - 18 total donors (16 named + 2 Anonymous) from payment tracker
  // Update this array with the exact 18 names from your payment tracker
  const donors = [
    "Abdul Ashraf",
    "Abena Ampomah",
    "Ahmed Rufahi",
    "Anthony",
    "Asante",
    "Bernice Ackah",
    "Borley Djenge",
    "Edmund Kombat",
    "Francis Boye",
    "Godfred Nipa",
    "Haruna Kofi Annan",
    "Idriss Abass",
    "Justice Kodzo",
    "Kodjokuma",
    "Nana Kofi Quakyi",
    "Rashid Musah",
    "Richard Enyo",
    "Richard Nunekpelu",
    "Saaka",
    "Yaotse",
    "Yusufu",
    "Anonymous",
    "Anonymous",
  ]
    .filter((name, index, self) => {
      // Keep only unique names, but allow 2 Anonymous entries
      if (name === "Anonymous") {
        const anonymousCount = self.filter(n => n === "Anonymous").length;
        return anonymousCount <= 2;
      }
      return self.indexOf(name) === index;
    })
    .sort((a, b) => {
      // Sort alphabetically, Anonymous at the end
      if (a === "Anonymous" && b !== "Anonymous") return 1;
      if (b === "Anonymous" && a !== "Anonymous") return -1;
      return a.localeCompare(b);
    })
    .slice(0, 18); // Exactly 18 entries - UPDATE THIS LIST with exact names from your tracker

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-tight">Partners & Supporters</h1>
            <p className="text-xl text-white/90">
              Thank you to everyone who made this possible
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-muted rounded-xl p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                The Madina Basketball court renovation was made possible through the support of
                18 generous donors who raised GHS 44,750. From significant contributions to smaller 
                donations, every supporter played a crucial role in bringing this community asset to life.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                We are deeply grateful to everyone who believed in this project and contributed
                their resources. This court truly belongs to the community, and that includes all of you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Donors - Prominent Acknowledgment */}
      <section id="donors" className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">Our Donors</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A big thank you and acknowledgment to our 18 generous donors who raised GHS 44,750. 
                Every contribution, large and small, made a difference.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
              <div className="mb-8 text-center">
                <p className="text-gray-700 text-lg leading-relaxed">
                  We are deeply grateful to each and every donor who contributed to making the Madina Basketball 
                  court a reality. Your generosity has created a lasting impact on our community.
                </p>
              </div>
              
              {/* Donor List - Alphabetical Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {donors.map((donor, index) => (
                  <div
                    key={index}
                    className="p-4 bg-muted rounded-lg text-center hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
                  >
                    <p className="font-medium text-gray-800">{donor}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">18</div>
                    <div className="text-gray-600 text-sm">Total Donors</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">GHS 44,750</div>
                    <div className="text-gray-600 text-sm">Total Raised</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">100%</div>
                    <div className="text-gray-600 text-sm">Community Funded</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 italic">
                  Donors are listed alphabetically. Every contribution, regardless of amount, is equally valued and appreciated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">Our Sponsors</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Businesses and organizations that provided financial support, materials, or services to make this project possible.
              </p>
            </div>
            <div className="bg-muted rounded-xl p-8">
              <p className="text-gray-700 text-lg mb-8 text-center">
                We are grateful to our sponsors who supported the renovation through financial contributions, 
                discounted materials, or professional services. Your partnership made a significant difference.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow-sm text-center min-h-[150px] flex items-center justify-center">
                    <div className="text-gray-400">
                      <Handshake className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-sm font-medium">Sponsor {i}</p>
                      <p className="text-xs text-gray-500 mt-1">Logo/Name</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 italic mb-4">
                  Interested in becoming a sponsor? Contact us to discuss partnership opportunities.
                </p>
                <a
                  href="/contact"
                  className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all"
                >
                  Become a Sponsor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Contributors */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center uppercase tracking-tight">Volunteer Contributors</h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <Heart className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-semibold">Time & Expertise</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Beyond financial contributions, many community members gave their time and expertise
                to make this project a success. From engineers who assessed the site, to volunteers
                who helped with coordination, to community members who spread the word—everyone's
                contribution mattered.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Engineering professionals who provided site assessment and BOQ preparation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Community organizers who coordinated fundraising and communication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Volunteers who helped with project oversight and documentation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Community members who spread awareness and encouraged participation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Future Partners */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center uppercase tracking-tight">Future Partnership Opportunities</h2>
            <div className="bg-muted rounded-xl p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                As we continue to grow and expand our programs, we welcome partnerships with businesses,
                NGOs, sports development organizations, and other stakeholders who share our vision
                for community basketball development.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <Trophy className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Sponsorship</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Sponsor tournaments, training programs, or court maintenance. Visibility and
                    community engagement opportunities available.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <Handshake className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Program Partnerships</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Partner with us on youth development programs, coaching initiatives, or
                    community events.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Equipment & Materials</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Support through equipment donations, materials, or services that help
                    maintain and improve the court.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <Heart className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Volunteer Support</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Organizations can support through volunteer programs, coaching, or
                    administrative assistance.
                  </p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <a
                  href="/contact"
                  className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
                >
                  Become a Partner
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thank You */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 uppercase tracking-tight">Thank You</h2>
            <p className="text-xl mb-8 text-white/90">
              To every supporter, contributor, volunteer, and believer—this court exists because of you.
              Your trust, your contributions, and your commitment to the community made this possible.
            </p>
            <p className="text-lg text-white/80">
              Together, we built more than a basketball court. We built a symbol of what's possible
              when a community comes together with transparency, purpose, and shared vision.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

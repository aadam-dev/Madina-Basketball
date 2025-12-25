import { Calendar, CheckCircle, DollarSign, Hammer, Users, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Journey() {
  const timelineEvents = [
    {
      date: "April 10, 2025",
      title: "The Plan Begins",
      description: "Shafic reaches out to Adam to discuss the renovation. This marks the official start of the renovation plan. Adam would go on to source contractors, design dashboards, and track the project, while Shafic led stakeholder engagements with community leaders and fundraising from his network.",
      phase: "planning",
    },
    {
      date: "April 26, 2025",
      title: "Contractor Contacted",
      description: "After speaking with a couple of people and engineers, we finally reached out to the contractor who would work on the court.",
      phase: "planning",
    },
    {
      date: "May 3, 2025",
      title: "Site Assessment",
      description: "The engineering team met the renovation team on the court to assess the state of the facility. Full damage assessment completed and scope of work defined.",
      phase: "planning",
    },
    {
      date: "May 14-21, 2025",
      title: "BOQ Prepared",
      description: "Bill of Quantities prepared for 3 different scenarios. Final BOQ finalized at GHS 37,250. The community raised GHS 44,750 from 18 donors, exceeding the target. All costs itemized and published for transparency.",
      phase: "planning",
    },
    {
      date: "June 5, 2025",
      title: "Renovation Begins",
      description: "Work started on the court renovation. Surface repair, painting, and equipment installation commenced under community oversight.",
      phase: "renovation",
    },
    {
      date: "June 12, 2025",
      title: "Renovation Complete",
      description: "Full court renovation finished in one week. Standard markings, new hoops, and resurfaced playing area completed. The court is ready for play.",
      phase: "renovation",
    },
    {
      date: "June 22, 2025",
      title: "Court Launch",
      description: "Official opening ceremony held. First official game: Madina vs Kawukudi. Community celebration with photos and videos documented. The court is officially open!",
      phase: "active",
    },
    {
      date: "July 12, 2025",
      title: "Madina Old Gees Join the Court",
      description: "Madina Old Gees joined the court and have been influential since. Their presence and leadership have significantly contributed to the growth and development of basketball in Madina.",
      phase: "active",
    },
    {
      date: "November 2025",
      title: "Zurak Basketball Team Launched",
      description: "Zurak Basketball Team officially launched, expanding the basketball community in Madina.",
      phase: "active",
    },
    {
      date: "Today",
      title: "Court Active",
      description: "Regular pick-up games, training sessions, and events ongoing. The court is alive. Madina CITI Foundation in the works to serve as umbrella for all basketball and social/impact work in Madina.",
      phase: "active",
    },
  ];

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "planning": return "bg-blue-500";
      case "renovation": return "bg-primary";
      case "active": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">The Journey</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 uppercase tracking-tight">
              From Broken to Built
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              The complete story of how a community transformed a neglected court into an 
              active basketball hub. This is our documented journey — every step, every decision, 
              every milestone.
            </p>
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">The Transformation</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                See the difference community action can make. What was once unusable is now 
                a fully operational basketball court.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <div className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-lg z-10 uppercase">
                  Before
                </div>
                <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-center text-gray-400 p-8">
                    <Users className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">Before renovation photo</p>
                    <p className="text-xs mt-2">Cracked surface, faded lines, unusable equipment</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-3 text-center">
                  Cracked surface, faded lines, unusable equipment
                </p>
              </div>
              <div className="relative">
                <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-lg z-10 uppercase">
                  After
                </div>
                <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-center text-gray-400 p-8">
                    <Trophy className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">After renovation photo</p>
                    <p className="text-xs mt-2">Fresh surface, standard markings, professional equipment</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-3 text-center">
                  Fresh surface, standard markings, professional equipment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline - Exact Lovable Design */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">The Timeline</h2>
              <p className="text-xl text-gray-600">
                Every major milestone in our journey, documented.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 md:transform md:-translate-x-1/2" />
                
                {timelineEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`relative flex items-start gap-8 mb-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-white md:transform md:-translate-x-1/2 z-10 shadow-lg">
                      <div className={`w-full h-full rounded-full ${getPhaseColor(event.phase)}`} />
                    </div>
                    
                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <span className="text-primary font-semibold text-sm uppercase tracking-wide">{event.date}</span>
                      <h3 className="text-xl sm:text-2xl font-bold mt-1 mb-2 uppercase tracking-tight">{event.title}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
                    </div>
                    
                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Game Highlight */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Launch Game</div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 uppercase tracking-tight">
                    Madina vs Kawukudi
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    The opening ceremony game on June 22, 2025 marked the official launch of the renovated court. 
                    Madina faced Kawukudi in a memorable match that brought the community together 
                    to celebrate this achievement.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Photos and videos from this historic game are available in our media gallery.
                  </p>
                  <Link
                    href="/media"
                    className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline"
                  >
                    <span>View Photos & Videos</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Trophy className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">Opening Game Photos</p>
                    <p className="text-xs mt-2">(Add actual photos here)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center uppercase tracking-tight">Key Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-muted rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">18</div>
                <div className="text-gray-600 text-sm">Donors</div>
              </div>
              <div className="bg-muted rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">GHS 44.7K</div>
                <div className="text-gray-600 text-sm">Raised Transparently</div>
              </div>
              <div className="bg-muted rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">3 Months</div>
                <div className="text-gray-600 text-sm">From Plan to Play</div>
              </div>
              <div className="bg-muted rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                <div className="text-gray-600 text-sm">Transparency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-tight">See the Numbers</h2>
            <p className="text-xl mb-8 text-white/90 max-w-xl mx-auto">
              Every cedi tracked. Every expense documented. See our full transparency report.
            </p>
            <Link
              href="/transparency"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              <span>View Transparency Report</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

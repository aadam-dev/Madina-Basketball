import { Users, Trophy, Calendar, Target, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Teams() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-tight">Teams & Foundation</h1>
            <p className="text-xl text-white/90">
              Building a basketball community through teams, programs, and social impact
            </p>
          </div>
        </div>
      </section>

      {/* Madina CITI Foundation */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary mb-1 uppercase tracking-wide">Umbrella Organization</div>
                  <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight">Madina CITI Foundation</h2>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The Madina CITI Foundation is in the works to serve as the umbrella organization for all 
                basketball and social/impact-related initiatives in Madina. This foundation will coordinate 
                and support:
              </p>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Basketball teams and programs (Zurak, Old Gees, and future teams)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Youth development and training initiatives</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Community events and tournaments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Social impact programs and community engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Court management and maintenance</span>
                </li>
              </ul>
              <p className="text-gray-600 italic">
                More details about the foundation will be announced as development progresses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">Our Teams</h2>
              <p className="text-xl text-gray-600">
                Community teams that call the Madina Basketball court home
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Zurak Basketball Team */}
              <div className="bg-muted rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary mb-1 uppercase tracking-wide">Launched November 2024</div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Zurak Basketball Team</h3>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Zurak Basketball Team was officially launched in November 2024, adding to the growing 
                  basketball community in Madina. The team represents the spirit of community basketball 
                  and provides opportunities for players to compete and develop their skills.
                </p>
                <p className="text-gray-600">
                  The team trains regularly at the Madina Basketball court and participates in local 
                  competitions and community events.
                </p>
              </div>

              {/* Madina Old Gees Basketball Team */}
              <div className="bg-muted rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary mb-1 uppercase tracking-wide">Established</div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Madina Old Gees</h3>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Madina Old Gees Basketball Team is a community team that will operate under the 
                  Madina CITI Foundation umbrella. The team brings together experienced players and 
                  community members who share a passion for basketball.
                </p>
                <p className="text-gray-600">
                  Old Gees participates in local games and tournaments, including the upcoming Old Gees 
                  Night Ball event.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">Upcoming Events</h2>
              <p className="text-xl text-gray-600">
                Mark your calendar for these exciting basketball events
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Old Gees Night Ball */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">December 27, 2024</div>
                    <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-2">Old Gees Night Ball</h3>
                    <p className="text-lg text-gray-600">Madina Old Gees vs Oyibi Eagles</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="inline-block px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
                      Upcoming
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Join us for an exciting night game as Madina Old Gees takes on Oyibi Eagles. 
                  This event showcases community basketball at its finest and brings together 
                  players and fans from across the region.
                </p>
                <p className="text-gray-600">
                  More details about time, tickets, and viewing will be announced soon.
                </p>
              </div>

              {/* Eid Ball */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Planning Phase</div>
                    <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-2">Eid Ball</h3>
                    <p className="text-lg text-gray-600">Annual tournament during Eid celebrations</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="inline-block px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-semibold">
                      Planning
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Eid Ball has become a highlight of the community calendar, combining basketball 
                  competition with cultural celebration. This annual tournament brings together players 
                  from across the community for competitive games, food, and celebration.
                </p>
                <p className="text-gray-600">
                  Details for the upcoming Eid Ball will be announced as planning progresses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Ceremony Game */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">Historic Moments</h2>
            </div>
            
            <div className="bg-muted rounded-xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">October 2024</div>
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4 uppercase tracking-tight">
                    Opening Ceremony Game
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    The official opening ceremony of the renovated court featured a memorable game 
                    between Madina and Kawukudi. This historic match marked the beginning of a new 
                    era for basketball in Madina and brought the community together to celebrate 
                    this achievement.
                  </p>
                  <p className="text-gray-600 mb-6">
                    We have photos and videos from this special event that capture the excitement 
                    and community spirit of the day.
                  </p>
                  <Link
                    href="/media"
                    className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline"
                  >
                    <span>View Photos & Videos</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="aspect-video bg-white rounded-lg flex items-center justify-center shadow-lg">
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

      {/* CTA */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-tight">Join a Team</h2>
            <p className="text-xl mb-8 text-white/90">
              Interested in joining one of our teams or starting a new one? Get in touch with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
              >
                Register to Play
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


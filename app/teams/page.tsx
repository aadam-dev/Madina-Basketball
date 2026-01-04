import { Users, Trophy, Calendar, Target, Building2, ArrowRight, Video, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Teams() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-tight">Teams</h1>
            <p className="text-xl text-white/90">
              Building a basketball community through teams, programs, and social impact
            </p>
          </div>
        </div>
      </section>

      {/* Madina Basketball */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                  <Image 
                    src="/images/logo/madinabasketball-logo.png"
                    alt="Madina Basketball Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary mb-1 uppercase tracking-wide">Community Hub</div>
                  <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight">Madina Basketball</h2>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Madina Basketball serves as the hub for all basketball and social/impact-related initiatives in Madina. We coordinate and support:
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
            </div>
          </div>
        </div>
      </section>

      {/* Saturday Rivalry Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-xl relative border border-gray-100">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="px-5 py-2 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full text-white text-sm font-bold shadow-lg uppercase tracking-wider">
                    Every Saturday Tradition
                  </div>
                </div>
                
                <div className="text-center mb-10">
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-none tracking-tighter uppercase">
                    <span className="text-orange-500">OLD GEES</span>
                    <span className="text-gray-400 mx-4">VS</span>
                    <span className="text-blue-500">YOUNGINS</span>
                  </h2>
                  <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 via-gray-300 to-blue-500 mx-auto rounded-full mb-8" />
                  <p className="text-xl sm:text-2xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
                    Experience meets energy. Wisdom meets speed. The most anticipated recurring matchup at Madina Basketball.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                    <div className="text-4xl font-black text-orange-500 mb-2">8+</div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Games Played</div>
                  </div>
                  <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                    <div className="text-4xl font-black text-gray-800 mb-2">EVEN</div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Win Record</div>
                  </div>
                  <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                    <div className="text-4xl font-black text-blue-500 mb-2">200+</div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Spectators</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-4 transform rotate-3">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-tight">Competitive Fire</h4>
                    <p className="text-sm text-gray-600">Every possession matters. Community pride is on the line.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-4 transform -rotate-2">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-tight">Community Spirit</h4>
                    <p className="text-sm text-gray-600">Brings generations together in a shared celebration of hoops.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-4 transform rotate-1">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-tight">Pure Basketball</h4>
                    <p className="text-sm text-gray-600">No frills, just great energy and unforgettable moments.</p>
                  </div>
                </div>
                
                <div className="mt-12 text-center">
                  <Link
                    href="/media#events"
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all transform hover:scale-105 shadow-xl"
                  >
                    <Video className="w-5 h-5" />
                    <span>Watch Rivalry Highlights</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">Meet the Rivals</h2>
              <p className="text-xl text-gray-600">
                The community teams that drive the Saturday tradition
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Zurak Basketball Team / The Youngins */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Trophy className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="text-xs font-black text-blue-600 mb-2 uppercase tracking-widest">The Youngins</div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Zurak Basketball</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    The next generation of Madina Basketball. Bringing relentless energy, 
                    athleticism, and creativity to the court every Saturday.
                  </p>
                  <div className="w-12 h-1 bg-blue-200 rounded-full mb-6" />
                  <p className="text-sm text-gray-500 italic">
                    "Speed and fire define our game."
                  </p>
                </div>
              </div>

              {/* Madina Old Gees Basketball Team */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-10 h-10 text-orange-600" />
                  </div>
                  <div className="text-xs font-black text-orange-600 mb-2 uppercase tracking-widest">The Old Gees</div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Madina Old Gees</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    The backbone of the court, bringing decades of experience and wisdom. 
                    Proving that strategy often trumps raw speed.
                  </p>
                  <div className="w-12 h-1 bg-orange-200 rounded-full mb-6" />
                  <p className="text-sm text-gray-500 italic">
                    "Experience is our greatest asset."
                  </p>
                </div>
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
              {/* Old Gees Night Ball / Night of Legends */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">December 27, 2025</div>
                    <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-2">Night of Legends</h3>
                    <p className="text-lg text-gray-600">Madina Old Gees vs Oyibi Eagles</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="inline-block px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-semibold">
                      Completed
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Night of Legends event where Madina Old Gees took on Oyibi Eagles. 
                  This event showcased community basketball at its finest and brought together 
                  players and fans from across the region.
                </p>
                <Link
                  href="/media#highlights"
                  className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline"
                >
                  <span>Watch Highlights</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
                  <div className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">October 2025</div>
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

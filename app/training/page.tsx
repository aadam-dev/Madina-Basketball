import { Calendar, Users, Target, Trophy, Heart, Clock } from "lucide-react";

export default function Training() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Training & Programs</h1>
            <p className="text-xl text-white/90">
              Building skills, character, and community through basketball
            </p>
          </div>
        </div>
      </section>

      {/* Weekly Training */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Weekly Training Sessions</h2>
            <div className="bg-muted rounded-xl p-8 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-semibold">Regular Training</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                We run weekly training sessions focused on skill development, teamwork, and personal growth.
                These sessions are open to players of all skill levels and ages.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Schedule</span>
                  </div>
                  <p className="text-gray-600">
                    Weekly sessions are held on scheduled days. Check our social media or contact us
                    for the current schedule.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Who Can Join</span>
                  </div>
                  <p className="text-gray-600">
                    Open to all community members. Beginners welcome. No prior experience required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Focus Areas */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Program Focus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Youth Development</h3>
                <p className="text-gray-600">
                  Focus on developing young players through structured training, mentorship,
                  and positive role modeling.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Inclusion</h3>
                <p className="text-gray-600">
                  Programs specifically designed to welcome girls, beginners, and players from
                  all backgrounds. Basketball is for everyone.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Building</h3>
                <p className="text-gray-600">
                  Training sessions are more than just basketball—they're opportunities to build
                  friendships and strengthen community bonds.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Skill Development</h3>
                <p className="text-gray-600">
                  Progressive training programs that help players improve their fundamentals,
                  game understanding, and competitive skills.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Character Building</h3>
                <p className="text-gray-600">
                  Emphasis on discipline, respect, teamwork, and resilience—values that extend
                  beyond the court.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Regular Sessions</h3>
                <p className="text-gray-600">
                  Consistent weekly training ensures continuous improvement and maintains
                  engagement with the sport.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Annual Events */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Annual Events</h2>
            <div className="space-y-8">
              <div className="bg-muted rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-semibold">Eid Games</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Our annual tournament held during Eid celebrations, bringing together players
                  from across the community for competitive games, food, and celebration.
                </p>
                <p className="text-gray-600">
                  The Eid Games have become a highlight of the community calendar, combining
                  basketball competition with cultural celebration.
                </p>
              </div>
              <div className="bg-muted rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-semibold">Community Tournaments</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Regular tournaments and competitions that provide opportunities for players
                  to test their skills and compete in a structured environment.
                </p>
                <p className="text-gray-600">
                  These events help build competitive experience while maintaining the
                  community-focused, inclusive spirit of the court.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Coaches */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Coaching</h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Our training programs are led by volunteer coaches who are passionate about
                basketball and community development. These dedicated individuals give their
                time to help players improve their skills and grow as people.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                We are always looking for additional volunteer coaches who can contribute to
                our programs. If you have basketball experience and a desire to give back to
                the community, we'd love to hear from you.
              </p>
              <div className="mt-8">
                <a
                  href="/contact"
                  className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
                >
                  Contact Us About Coaching
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Join Our Programs</h2>
            <p className="text-xl mb-8 text-white/90">
              Whether you're a beginner or experienced player, there's a place for you in our training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
              >
                Register to Play
              </a>
              <a
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Get More Information
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


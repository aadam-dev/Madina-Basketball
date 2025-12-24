import { Target, Heart, Users, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About the Project</h1>
            <p className="text-xl text-white/90">
              Understanding why this matters and how we got here
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">The Problem</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Madina has a large basketball-playing population, but historically lacked a standard public court.
                The community court at Libya Quarters, which once served as a gathering place for youth and players,
                fell into disrepair. Without proper infrastructure, the community's passion for basketball had no place
                to flourish.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                This wasn't just about a broken court—it was about lost opportunities for youth development,
                community cohesion, and the simple joy of playing the game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Community Response */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">The Community Response</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                A grassroots team recognized the need and took action. <strong>Shafic and Adam led the court renovation project</strong>, 
                bringing together their expertise, community connections, and dedication to make this vision a reality. 
                Shafic's connections were instrumental in securing funding and support for the project. Rather than waiting 
                for external help, the community mobilized:
              </p>
              <ul className="space-y-4 text-gray-700 text-lg">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Engineers assessed the site and prepared a detailed Bill of Quantities (BOQ)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Funds were raised transparently through community contributions (GHS 44,750 from 18 donors), with Shafic's connections helping to secure key funding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>Contractors executed the renovation with community oversight led by Shafic and Adam</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span>The court was renovated, painted, standardized, and launched</span>
                </li>
              </ul>
              <p className="text-gray-700 text-lg leading-relaxed mt-6">
                Today, the court is active with training programs, pick-up games, and bookings.
                A launch ceremony and opening game have already taken place, marking the beginning
                of a new chapter for basketball in Madina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Basketball Matters */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Why Basketball Matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-muted rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Youth Development</h3>
                <p className="text-gray-600">
                  Basketball teaches discipline, teamwork, and resilience. It provides a positive outlet
                  for energy and a pathway to personal growth.
                </p>
              </div>
              <div className="p-6 bg-muted rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Inclusion</h3>
                <p className="text-gray-600">
                  The court welcomes everyone—girls, boys, beginners, and experienced players.
                  Basketball is a sport for all.
                </p>
              </div>
              <div className="p-6 bg-muted rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Cohesion</h3>
                <p className="text-gray-600">
                  The court brings people together. It's a place where neighbors meet, friendships form,
                  and community bonds strengthen.
                </p>
              </div>
              <div className="p-6 bg-muted rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Safe Space</h3>
                <p className="text-gray-600">
                  A well-maintained court provides a safe, structured environment for youth to play,
                  learn, and grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-white/80">
                  Every step, every decision, every cedi is documented and shared.
                  Trust is built through openness.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-3">Ownership</h3>
                <p className="text-white/80">
                  This is the community's court. Built by the community, maintained by the community,
                  enjoyed by the community.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚪</div>
                <h3 className="text-xl font-semibold mb-3">Access</h3>
                <p className="text-white/80">
                  The court is open to all. No barriers, no exclusions. Basketball is for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


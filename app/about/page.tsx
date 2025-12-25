import { Target, Heart, Users, Shield } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Madina Basketball</h1>
            <p className="text-xl text-white/90">
              A community-driven basketball hub serving Libya Quarters and beyond
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Today */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">What We Do</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                The Madina Basketball court is more than just a place to play—it's a thriving community hub where players of all ages and skill levels come together. We host daily pick-up games, structured training sessions, competitive tournaments, and community events that bring the neighborhood together.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Home to teams like Zurak Basketball and Madina Old Gees, the court serves as the foundation for youth development, competitive play, and community building. The upcoming Madina CITI Foundation will expand this work, combining basketball with broader social impact initiatives across Madina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Started */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">How It Started</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Madina has always had a passionate basketball community, but lacked proper infrastructure. When community leaders <strong>Shafic and Adam</strong> saw the deteriorating Libya Quarters court, they mobilized the community to transform it into what it is today.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Through transparent fundraising (GHS 44,750 from 18 donors), professional planning, and community oversight, the court was renovated and officially launched in June 2025. This grassroots effort proved what's possible when a community comes together around a shared vision.
              </p>
              <p className="text-gray-600 text-base mt-4">
                <Link href="/journey" className="text-primary hover:underline font-semibold">
                  Read the full story of the renovation journey →
                </Link>
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


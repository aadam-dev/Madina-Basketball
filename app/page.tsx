import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Users, Trophy, CheckCircle, MapPin, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";
import HeroBackground from "@/components/HeroBackground";

async function getFeaturedEvent() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("featured", true)
      .eq("status", "upcoming")
      .order("date", { ascending: true })
      .limit(1)
      .single();

    if (error) {
      // No featured event found, that's okay
      return null;
    }

    // Check if event has passed
    const eventDate = new Date(data.date);
    const eventDateTime = new Date(`${data.date}T${data.time || '00:00'}`);
    const now = new Date();
    
    if (eventDateTime < now) {
      // Event has passed, update status to completed
      await supabase
        .from("events")
        .update({ status: "completed", featured: false })
        .eq("id", data.id);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching featured event:", error);
    return null;
  }
}

async function getUpcomingEvents() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "upcoming")
      .eq("featured", false) // Exclude featured events from regular list
      .order("date", { ascending: true })
      .limit(3);

    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }

    // Filter out past events and update their status
    const now = new Date();
    const validEvents = [];
    
    for (const event of data || []) {
      const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
      if (eventDateTime < now) {
        // Update status to completed
        await supabase
          .from("events")
          .update({ status: "completed" })
          .eq("id", event.id);
      } else {
        validEvents.push(event);
      }
    }

    return validEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export default async function Home() {
  const featuredEvent = await getFeaturedEvent();
  const upcomingEvents = await getUpcomingEvents();
  return (
    <div className="min-h-screen">
      {/* Hero Section - Improved Design */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image/Video */}
        <div className="absolute inset-0">
          {/* Background image - will show if available, otherwise gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-primary">
            {/* Background video/image overlay - Hero section */}
            <HeroBackground />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Status Badge */}
            <div className="inline-flex items-center mb-6 px-4 py-2 bg-green-500/90 backdrop-blur-sm rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Court Now Active
            </div>
            
            {/* Main Title - Uppercase for Impact */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              MADINA<br />BASKETBALL
          </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl mb-4 font-light">
              A Community-Built Court, Now Active
            </p>
            
            <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
              Libya Quarters' premier basketball hub. Home to pick-up games, training programs, tournaments, and a thriving community of players. Built by the community, for the community.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <span>Register to Play</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/journey"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
              >
                See the Journey
              </Link>
            </div>
            
            {/* Location */}
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Libya Quarters, Madina, Accra, Ghana</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-muted rounded-xl">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">GHS 44,750</div>
              <div className="text-gray-600 font-medium text-sm">Amount Raised</div>
            </div>
            <div className="text-center p-6 bg-muted rounded-xl">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">Active</div>
              <div className="text-gray-600 font-medium text-sm">Court Status</div>
            </div>
            <div className="text-center p-6 bg-muted rounded-xl">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-gray-600 font-medium text-sm">Players Registered</div>
            </div>
            <div className="text-center p-6 bg-muted rounded-xl">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">12+</div>
              <div className="text-gray-600 font-medium text-sm">Events Hosted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event Section */}
      {featuredEvent && (
        <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">Featured Event</h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Don't miss tonight's game!
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {featuredEvent.image_url && (
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <Image
                        src={featuredEvent.image_url}
                        alt={featuredEvent.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full uppercase">
                        {featuredEvent.type}
                      </span>
                      <span className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full">
                        Tonight
                      </span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold mb-4">{featuredEvent.title}</h3>
                    {featuredEvent.description && (
                      <p className="text-white/90 text-lg mb-6">{featuredEvent.description}</p>
                    )}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-white/80" />
                        <span className="text-white/90">
                          {new Date(featuredEvent.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {featuredEvent.time && (
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-white/80" />
                          <span className="text-white/90">{featuredEvent.time}</span>
                        </div>
                      )}
                      {featuredEvent.location && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-white/80" />
                          <span className="text-white/90">{featuredEvent.location}</span>
                        </div>
                      )}
                      {featuredEvent.teams && (
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-white/80" />
                          <span className="text-white/90 font-semibold">{featuredEvent.teams}</span>
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/events/${featuredEvent.id}`}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">Upcoming Events</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Don't miss out on the next games, tournaments, and community events
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mission Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Our Mission</div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-tight">
                  Basketball for Everyone
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  The Madina Basketball court is a thriving hub for players of all levels. From daily pick-up games to structured training sessions, from youth development programs to competitive tournaments—this is where the community comes to play.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Home to teams like Zurak Basketball and Madina Old Gees, the court hosts regular events and serves as the foundation for Madina Basketball's ongoing basketball and social impact initiatives.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline"
                >
                  <span>Read Our Story</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="text-6xl font-bold text-primary mb-2">2025</div>
                  <div className="text-2xl font-semibold text-gray-800">Active & Growing</div>
                </div>
                {/* Court image */}
                <div className="mt-6 aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden relative">
                  <Image
                    src="/images/journey/after/court-painting.jpg"
                    alt="Madina Basketball Court - Court Painting"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tight">Get Involved</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Whether you want to play, book the court for your team, or support our programs, 
                there's a place for you at Madina Basketball.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-muted rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase">Register to Play</h3>
                <p className="text-gray-600 mb-6">
                  Join our community of players. Register for pick-up games, training sessions, and tournaments.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="bg-muted rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase">Book the Court</h3>
                <p className="text-gray-600 mb-6">
                  Reserve the court for your team, school, or event. Available for bookings during operating hours.
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="bg-muted rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase">Our Story</h3>
                <p className="text-gray-600 mb-6">
                  Learn how the community came together to create this basketball hub. Full transparency on the journey from vision to reality.
                </p>
                <Link
                  href="/transparency"
                  className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline"
                >
                  <span>Our Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 uppercase tracking-tight">Ready to Ball?</h2>
            <p className="text-xl mb-8 text-white/90">
              The court is open. The community is waiting. Come be part of something real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/court"
                className="px-8 py-4 bg-white text-secondary font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Visit the Court
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Join Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

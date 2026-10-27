import { Users, CheckCircle, FileText } from "lucide-react";
import RegisterForm from "@/components/forms/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Register to Play</h1>
            <p className="text-xl text-white/90">
              Join the Madina Basketball community
            </p>
          </div>
        </div>
      </section>

      {/* Who Should Register */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Who Should Register?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-muted p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Players</h3>
                </div>
                <p className="text-gray-600">
                  Anyone who wants to play basketball at the court, whether for pick-up games,
                  training sessions, or organized events.
                </p>
              </div>
              <div className="bg-muted p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">All Skill Levels</h3>
                </div>
                <p className="text-gray-600">
                  Beginners, intermediate, and advanced players are all welcome. No prior
                  experience is required.
                </p>
              </div>
              <div className="bg-muted p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">All Ages</h3>
                </div>
                <p className="text-gray-600">
                  Youth, teens, and adults are all encouraged to register and participate
                  in our programs.
                </p>
              </div>
              <div className="bg-muted p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Inclusive</h3>
                </div>
                <p className="text-gray-600">
                  Girls and boys, men and women—everyone is welcome. Basketball is for all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code of Conduct */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Code of Conduct</h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-700 text-lg mb-6">
                By registering to play, you agree to uphold the following principles:
              </p>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Respect:</strong> Treat all players, coaches, and community members with respect and dignity.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Inclusion:</strong> Welcome players of all backgrounds, skill levels, and identities.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Sportsmanship:</strong> Play fairly, accept decisions gracefully, and celebrate both wins and losses with dignity.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Safety:</strong> Prioritize safety for yourself and others. Use appropriate equipment and follow safety guidelines.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Community:</strong> Contribute positively to the community atmosphere. Help maintain the court and support fellow players.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>No Discrimination:</strong> Zero tolerance for discrimination, harassment, or exclusionary behavior.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Registration Form</h2>
            <div className="bg-muted rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-semibold">Complete Your Registration</h3>
              </div>
              <p className="text-gray-700 text-lg mb-8">
                Please fill out the registration form below. This helps us understand our community
                and keep you informed about training sessions, events, and court updates.
              </p>
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">What Happens Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-primary mb-2">1</div>
                <h3 className="text-xl font-semibold mb-3">Submit Form</h3>
                <p className="text-white/80">
                  Complete and submit the registration form with your details.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-primary mb-2">2</div>
                <h3 className="text-xl font-semibold mb-3">Get Confirmed</h3>
                <p className="text-white/80">
                  We'll confirm your registration and add you to our player database.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <h3 className="text-xl font-semibold mb-3">Start Playing</h3>
                <p className="text-white/80">
                  You'll receive updates about training sessions, events, and court availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


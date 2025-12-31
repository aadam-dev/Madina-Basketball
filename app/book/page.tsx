import { Calendar, Clock, DollarSign, Users, CheckCircle, Phone } from "lucide-react";

export default function Book() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Book the Court</h1>
            <p className="text-xl text-white/90">
              Reserve the court for your game, training, or event
            </p>
          </div>
        </div>
      </section>

      {/* Booking Info */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Court Booking</h2>
            <div className="bg-muted rounded-xl p-8 mb-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                The Madina Basketball court is available for booking by individuals, teams, schools,
                and organizations. Booking ensures you have dedicated time for your game, training session,
                or event.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Time Slots</span>
                  </div>
                  <p className="text-gray-600">
                    Book in advance to secure your preferred time slot. Available throughout the week.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Who Can Book</span>
                  </div>
                  <p className="text-gray-600">
                    Individuals, teams, schools, leagues, and organizations are all welcome to book.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Rules */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Booking Rules</h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Advance Booking:</strong> Book at least 24-48 hours in advance to secure your slot.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Time Limits:</strong> Standard bookings are for 1-2 hour slots. Extended bookings may be available upon request.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Payment:</strong> Booking fees apply. Contact us for current rates and payment methods.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Cancellation:</strong> Please cancel at least 24 hours in advance if you cannot use your booking.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Court Care:</strong> Leave the court in the same condition you found it. Clean up after your session.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Pick-up Games:</strong> During non-booked hours, the court is available for pick-up games on a first-come, first-served basis.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Schools & Teams:</strong> Special arrangements available for schools and organized teams. Contact us for bulk booking options.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Make a Booking</h2>
            <div className="bg-muted rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-semibold">Booking Form</h3>
              </div>
              <p className="text-gray-700 text-lg mb-8">
                Fill out the form below to request a court booking. We'll confirm your booking
                and provide payment details.
              </p>
              
              {/* Google Form Embed */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="aspect-[4/3] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center p-8">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Google Form will be embedded here</p>
                    <p className="text-sm text-gray-500">
                      Replace this with your Google Form embed code
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Or link to: <a href="#" className="text-primary hover:underline">Booking Form</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p>
                  <strong>Note:</strong> If the form doesn't load, you can access it directly via our
                  social media pages or contact us directly for bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Bookings */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Special Bookings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Schools</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Schools can book the court for physical education classes, team practices,
                  or school tournaments. Special rates and scheduling available.
                </p>
                <a
                  href="/contact"
                  className="text-primary font-medium hover:underline inline-flex items-center"
                >
                  Contact us for school bookings
                  <Phone className="w-4 h-4 ml-1" />
                </a>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Leagues & Teams</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Organized leagues and teams can arrange regular bookings for practices
                  and games. Bulk booking discounts available.
                </p>
                <a
                  href="/contact"
                  className="text-primary font-medium hover:underline inline-flex items-center"
                >
                  Contact us for league bookings
                  <Phone className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Bookings */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Need Help with Booking?</h2>
            <p className="text-xl mb-8 text-white/90">
              If you have questions about booking, availability, or special arrangements,
              don't hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
              >
                Contact Us
              </a>
              <a
                href="https://wa.me/233559602056"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


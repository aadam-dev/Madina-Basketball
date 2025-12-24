import { MapPin, Clock, CheckCircle, Ruler, Users } from "lucide-react";

export default function Court() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">The Court</h1>
            <p className="text-xl text-white/90">
              Fully renovated, standardized, and now active
            </p>
          </div>
        </div>
      </section>

      {/* Court Status */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Court Status: Active</h2>
                  <p className="text-gray-600">Fully operational and ready for play</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                The court at Libya Quarters has been completely renovated and is now a standard,
                professional-grade basketball facility. The renovation included proper surface treatment,
                court markings, rims, and all necessary infrastructure to support regular play and events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Location</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-muted rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-semibold">Address</h3>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  Libya Quarters, Madina<br />
                  Accra, Ghana
                </p>
                <p className="text-gray-600">
                  The court is located in the heart of Libya Quarters, easily accessible to the
                  Madina community and surrounding areas.
                </p>
              </div>
              <div className="bg-gray-100 rounded-xl flex items-center justify-center min-h-[300px]">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Interactive map will be embedded here
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    (Add Google Maps embed with court location)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Court Features */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Court Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Ruler className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Standard Dimensions</h3>
                <p className="text-gray-600">
                  Full-size basketball court with proper FIBA-standard dimensions and markings.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Rims</h3>
                <p className="text-gray-600">
                  Professional-grade basketball rims installed at regulation height.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Proper Surface</h3>
                <p className="text-gray-600">
                  Renovated surface suitable for basketball play with proper grip and bounce.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Court Markings</h3>
                <p className="text-gray-600">
                  Clear, professional court markings including three-point line, free-throw line, and key.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Space</h3>
                <p className="text-gray-600">
                  Safe, accessible space for players of all ages and skill levels.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Maintained</h3>
                <p className="text-gray-600">
                  Regular maintenance ensures the court remains in excellent condition for ongoing use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Rules */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Usage Rules</h2>
            <div className="bg-muted rounded-xl p-8">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>Respect the court and other players. Maintain a positive, inclusive environment.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>Book the court in advance for organized games, training sessions, or events.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>Pick-up games are welcome during non-booked hours on a first-come, first-served basis.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>Keep the court clean. Dispose of trash properly and report any issues.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>Follow safety guidelines. Use appropriate footwear and equipment.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>Schools and teams should contact us for special booking arrangements.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Availability</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6" />
                <h3 className="text-2xl font-semibold">Court Hours</h3>
              </div>
              <p className="text-lg text-white/90 mb-6">
                The court is available for use throughout the week. For organized bookings,
                please use our booking system. Pick-up games are welcome during non-booked hours.
              </p>
              <div className="mt-8">
                <a
                  href="/book"
                  className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
                >
                  Book the Court
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


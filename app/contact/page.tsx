import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-white/90">
              Get in touch with the Madina Basketball community
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* WhatsApp */}
              <a
                href="https://wa.me/233XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted rounded-xl p-8 hover:shadow-lg transition-all transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">Quick responses for bookings and inquiries</p>
                <p className="text-primary font-medium">+233 XX XXX XXXX</p>
              </a>

              {/* Email */}
              <a
                href="mailto:themadinacourt@gmail.com"
                className="bg-muted rounded-xl p-8 hover:shadow-lg transition-all transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-600 mb-4">For detailed inquiries and partnerships</p>
                <p className="text-primary font-medium">themadinacourt@gmail.com</p>
              </a>

              {/* Location */}
              <div className="bg-muted rounded-xl p-8">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p className="text-gray-600 mb-4">Visit us at the court</p>
                <p className="text-gray-700 font-medium">
                  Libya Quarters, Madina<br />
                  Accra, Ghana
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Follow Us on Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a
                href="https://facebook.com/madinabasketball"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all flex items-center space-x-6"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Facebook className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Facebook</h3>
                  <p className="text-gray-600">@madinabasketball</p>
                  <p className="text-sm text-gray-500 mt-2">Updates, events, and community news</p>
                </div>
              </a>
              <a
                href="https://instagram.com/madinabasketball"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all flex items-center space-x-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Instagram</h3>
                  <p className="text-gray-600">@madinabasketball</p>
                  <p className="text-sm text-gray-500 mt-2">Photos, videos, and stories</p>
                </div>
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-6 text-center italic">
              Note: Our social media accounts are being relaunched after account loss.
              New links will be updated soon.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Send Us a Message</h2>
            <div className="bg-muted rounded-xl p-8">
              <p className="text-gray-700 text-lg mb-8 text-center">
                Have a question, suggestion, or want to get involved? Fill out the form below
                or reach out through any of our contact methods.
              </p>
              
              {/* Google Form Embed */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="aspect-[4/3] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center p-8">
                    <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Contact form will be embedded here</p>
                    <p className="text-sm text-gray-500">
                      Replace this with your Google Form embed code
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Or use: <a href="mailto:themadinacourt@gmail.com" className="text-primary hover:underline">themadinacourt@gmail.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Inquiries */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Common Inquiries</h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Court Bookings</h3>
                <p className="text-gray-600">
                  For court bookings, please use our <a href="/book" className="text-primary hover:underline">booking form</a> or
                  contact us via WhatsApp for immediate availability.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Player Registration</h3>
                <p className="text-gray-600">
                  New players can register through our <a href="/register" className="text-primary hover:underline">registration form</a>.
                  All skill levels and ages welcome.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Partnerships & Sponsorships</h3>
                <p className="text-gray-600">
                  Interested in partnering with us? Contact us via email or WhatsApp to discuss
                  partnership opportunities, sponsorships, or support programs.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Volunteer Opportunities</h3>
                <p className="text-gray-600">
                  We welcome volunteers for coaching, administration, and event organization.
                  Reach out to learn how you can contribute.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Media & Press</h3>
                <p className="text-gray-600">
                  Media inquiries and press requests should be directed to our email address.
                  We're happy to share our story and provide interviews or information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Find Us</h2>
            <div className="bg-muted rounded-xl overflow-hidden aspect-video">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Interactive map will be embedded here</p>
                  <p className="text-sm text-gray-500">
                    (Add Google Maps embed with court location)
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Location: Libya Quarters, Madina, Accra, Ghana
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


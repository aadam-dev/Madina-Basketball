import { Camera, Video, Image as ImageIcon, Share2 } from "lucide-react";

export default function Media() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Media & Gallery</h1>
            <p className="text-xl text-white/90">
              Capturing moments from our journey
            </p>
          </div>
        </div>
      </section>

      {/* Launch Game Photos */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Launch Day</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              The official launch ceremony and opening game marked a historic moment for the
              Madina Basketball community. These photos capture the celebration, the first
              game, and the joy of seeing the renovated court in action.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-muted rounded-xl overflow-hidden aspect-square">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">Launch Photo {i}</p>
                      <p className="text-gray-400 text-xs mt-2">(Add actual photos here)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">The Journey</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              From the broken court to renovation to active play—these images document
              the transformation and the community effort that made it possible.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center p-8">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Before: Broken Court</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">The court before renovation</p>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center p-8">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">During: Renovation</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">Renovation work in progress</p>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center p-8">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">After: Completed Court</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">The renovated court ready for play</p>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center p-8">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Today: Active Play</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">Players enjoying the court today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Videos</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Watch highlights from launch day, training sessions, and community events.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-muted rounded-xl overflow-hidden aspect-video">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">Video {i}</p>
                      <p className="text-gray-400 text-xs mt-2">(Embed YouTube/Vimeo video here)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Flyers & Promotional Materials */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Promotional Materials</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Flyers, announcements, and promotional materials from the project.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                    <div className="text-center p-4">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-xs">Flyer {i}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Follow Us</h2>
            <div className="bg-muted rounded-xl p-8">
              <p className="text-gray-700 text-lg mb-8 text-center">
                Stay connected with the Madina Basketball community through our social media channels.
                Follow us for updates, photos, event announcements, and more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href="https://facebook.com/madinabasketball"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Facebook</h3>
                    <p className="text-sm text-gray-600">@madinabasketball</p>
                  </div>
                </a>
                <a
                  href="https://instagram.com/madinabasketball"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Instagram</h3>
                    <p className="text-sm text-gray-600">@madinabasketball</p>
                  </div>
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-6 text-center italic">
                Note: Our social media accounts are being relaunched after account loss.
                New links will be updated soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Share Your Photos */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Share Your Photos</h2>
            <p className="text-xl mb-8 text-white/90">
              Have photos or videos from the court? We'd love to see them! Tag us on social media
              or send them to us to be featured in our gallery.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
            >
              Submit Media
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


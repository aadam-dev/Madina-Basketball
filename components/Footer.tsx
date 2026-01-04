import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Madina Basketball</h3>
            <p className="text-sm leading-relaxed">
              A community-built basketball court in Libya Quarters, Madina (Accra, Ghana).
              Built by the community, for the community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" prefetch={true} className="hover:text-primary transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link href="/journey" prefetch={true} className="hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/media" prefetch={true} className="hover:text-primary transition-colors">
                  Media & Gallery
                </Link>
              </li>
              <li>
                <Link href="/transparency" prefetch={true} className="hover:text-primary transition-colors">
                  Transparency
                </Link>
              </li>
              <li>
                <Link href="/tools" prefetch={true} className="hover:text-primary transition-colors">
                  Game Tools
                </Link>
              </li>
              <li>
                <Link href="/register" prefetch={true} className="hover:text-primary transition-colors">
                  Register to Play
                </Link>
              </li>
              <li>
                <Link href="/book" prefetch={true} className="hover:text-primary transition-colors">
                  Book the Court
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" prefetch={true} className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" prefetch={true} className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary" />
                <span>Libya Quarters, Madina, Accra, Ghana</span>
              </li>
              <li>
                <Link
                  href="https://wa.me/233559602056"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <Phone size={16} className="text-primary" />
                  <span>WhatsApp</span>
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:themadinacourt@gmail.com"
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <Mail size={16} className="text-primary" />
                  <span>themadinacourt@gmail.com</span>
                </Link>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <Link
                href="https://facebook.com/madinabasketball"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="https://instagram.com/madinabasketball"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Madina Basketball. Built with transparency and community spirit.
            </p>
            <div className="text-gray-400">
              <span className="mr-2">Website by</span>
              <a
                href="mailto:aadamsays@gmail.com?subject=Madina Basketball Website Inquiry&body=Hi Adam,%0A%0AI'm reaching out regarding the Madina Basketball website.%0A%0A[Your message here]%0A%0ABest regards"
                className="text-primary hover:text-primary-dark transition-colors font-semibold"
                rel="author"
              >
                Adam
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


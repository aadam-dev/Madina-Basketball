import { Shield, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Madina Basketball",
  description: "Privacy Policy for Madina Basketball community court website",
};

export default function PrivacyPolicy() {
  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-white/90">
              How we collect, use, and protect your information
            </p>
            <p className="text-sm text-white/80 mt-4">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="bg-muted rounded-xl p-8 mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                At Madina Basketball, we are committed to protecting your privacy and being transparent 
                about how we collect, use, and safeguard your personal information. This Privacy Policy 
                explains our practices regarding data collection and usage.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Information We Collect</h2>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>Register to Play:</strong> Name, email address, phone number, age, skill level, and other registration details</li>
                <li><strong>Book the Court:</strong> Name, contact information, booking dates and times, and event details</li>
                <li><strong>Contact Us:</strong> Name, email address, phone number, and message content</li>
                <li><strong>Use Game Tools:</strong> Team names, player names, jersey numbers, and game statistics (stored locally in your browser or passed via URL parameters)</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4">
                When you visit our website, we may automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
              </ul>
            </div>

            {/* How We Collect Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Collect Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Google Forms:</strong> Registration, booking, and contact forms are hosted on Google Forms. Data submitted through these forms is collected by Google and stored in their systems.</li>
                <li><strong>Direct Contact:</strong> Information you provide when contacting us via email, WhatsApp, or other communication channels</li>
                <li><strong>Website Usage:</strong> Information collected automatically through website analytics and server logs</li>
                <li><strong>Admin Portal:</strong> Authentication credentials for authorized administrators</li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>To process and manage player registrations</li>
                <li>To handle court booking requests and confirmations</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To send you updates about events, training sessions, and court activities (with your consent)</li>
                <li>To improve our website and services</li>
                <li>To ensure the security and proper functioning of our website</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            {/* Data Storage */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Storage and Security</h2>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Where Your Data is Stored</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>Google Forms:</strong> Registration, booking, and contact form data is stored on Google's servers, subject to Google's Privacy Policy</li>
                <li><strong>Supabase:</strong> Website content, events, team member information, and admin authentication data is stored in Supabase (PostgreSQL database hosted on secure servers)</li>
                <li><strong>Vercel:</strong> Website hosting and deployment platform</li>
                <li><strong>Local Storage:</strong> Game tool data (team rosters, scores) may be stored locally in your browser and is not transmitted to our servers</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Security Measures</h3>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Secure HTTPS encryption for data transmission</li>
                <li>Password hashing for admin authentication</li>
                <li>Access controls and authentication for admin portal</li>
                <li>Regular security updates and monitoring</li>
                <li>Secure hosting infrastructure</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website (Google Forms, Supabase, Vercel), subject to confidentiality agreements</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Safety and Security:</strong> To protect the rights, property, or safety of Madina Basketball, our users, or others</li>
                <li><strong>With Your Consent:</strong> When you have given explicit consent for us to share your information</li>
              </ul>
            </div>

            {/* Third-Party Services */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                Our website uses the following third-party services that may collect or process your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Google Forms:</strong> For registration, booking, and contact forms. Subject to <Link href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's Privacy Policy</Link></li>
                <li><strong>Supabase:</strong> For database and storage services. Subject to <Link href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase's Privacy Policy</Link></li>
                <li><strong>Vercel:</strong> For website hosting. Subject to <Link href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vercel's Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal and operational requirements)</li>
                <li><strong>Objection:</strong> Object to processing of your personal information for certain purposes</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where consent is the legal basis</li>
              </ul>
              <p className="text-gray-700">
                To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Registration data: Retained while you remain an active member of the community</li>
                <li>Booking records: Retained for operational and record-keeping purposes</li>
                <li>Contact inquiries: Retained until the inquiry is resolved and for a reasonable period thereafter</li>
                <li>Admin authentication data: Retained while the account is active</li>
              </ul>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are open to players of all ages, including minors. If you are under 18, please ensure you have 
                parental or guardian consent before providing personal information. We take special care with information 
                provided by or about minors and comply with applicable laws regarding children's privacy.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy 
                Policy periodically to stay informed about how we protect your information.
              </p>
            </div>

            {/* Contact Us */}
            <div className="bg-muted rounded-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <Link href="mailto:themadinacourt@gmail.com" className="text-primary hover:underline">
                      themadinacourt@gmail.com
                    </Link>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <Link href="https://wa.me/233559602056" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      +233 55 960 2056
                    </Link>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-700">Libya Quarters, Madina, Accra, Ghana</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700">
                This Privacy Policy is governed by the laws of Ghana. Any disputes arising from or related to this 
                Privacy Policy shall be subject to the exclusive jurisdiction of the courts of Ghana.
              </p>
            </div>

            {/* Footer Note */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-600 text-center">
                By using our website and services, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


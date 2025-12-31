import { FileText, Users, Calendar, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - Madina Basketball",
  description: "Terms of Service for Madina Basketball community court",
};

export default function TermsOfService() {
  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-white/90">
              Rules and regulations for using the Madina Basketball court
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
                Welcome to Madina Basketball. These Terms of Service ("Terms") govern your access to and use of 
                the Madina Basketball court, website, and services. By registering, booking, or using our facilities, 
                you agree to be bound by these Terms.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using the Madina Basketball court, website, or services, you agree to comply with 
                and be bound by these Terms. If you do not agree to these Terms, you may not use our facilities or services.
              </p>
            </div>

            {/* Court Usage Rules */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Court Usage Rules and Regulations</h2>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">General Rules</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>The court is a community facility and should be treated with respect</li>
                <li>All users must follow safety guidelines and use appropriate equipment</li>
                <li>No vandalism, graffiti, or damage to court facilities or equipment</li>
                <li>Respect other users and maintain a positive, inclusive environment</li>
                <li>Follow posted court hours and any temporary restrictions</li>
                <li>Clean up after yourself and dispose of trash properly</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Booking and Reservations</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Court bookings must be made in advance through the official booking process</li>
                <li>Bookings are subject to availability and may be limited during peak times</li>
                <li>You must arrive on time for your booked slot</li>
                <li>Failure to show up for a booking may result in restrictions on future bookings</li>
                <li>Bookings may be cancelled or modified by management for operational reasons</li>
                <li>Refunds or rescheduling policies will be communicated at the time of booking</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Code of Conduct</h3>
              <p className="text-gray-700 mb-4">
                All users must adhere to the following code of conduct:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Respect:</strong> Treat all players, staff, and community members with respect and dignity</li>
                <li><strong>Inclusivity:</strong> Welcome players of all skill levels, ages, and backgrounds</li>
                <li><strong>Sportsmanship:</strong> Display good sportsmanship and fair play at all times</li>
                <li><strong>No Discrimination:</strong> Zero tolerance for discrimination, harassment, or exclusionary behavior</li>
                <li><strong>No Violence:</strong> Physical violence, threats, or aggressive behavior is strictly prohibited</li>
                <li><strong>No Drugs or Alcohol:</strong> Use of illegal substances or alcohol on court premises is prohibited</li>
                <li><strong>Appropriate Language:</strong> Use respectful language and avoid profanity or offensive remarks</li>
              </ul>
            </div>

            {/* Registration Requirements */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Registration Requirements</h2>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Player Registration</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>All players are encouraged to register through the official registration process</li>
                <li>Registration helps us understand our community and keep you informed about events</li>
                <li>You must provide accurate and complete information during registration</li>
                <li>Minors (under 18) must have parental or guardian consent to register</li>
                <li>Registration is free and open to all skill levels</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Account Responsibility</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You are responsible for maintaining the confidentiality of any account credentials</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
              </ul>
            </div>

            {/* Liability and Disclaimers */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Liability and Disclaimers</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">Assumption of Risk</h3>
                    <p className="text-yellow-800">
                      Basketball and physical activities involve inherent risks of injury. By using the court, 
                      you acknowledge and assume all risks associated with participation in basketball activities.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Madina Basketball, its organizers, volunteers, and partners shall not be liable for any injuries, 
                    damages, or losses arising from use of the court or participation in activities</li>
                <li>We are not responsible for lost, stolen, or damaged personal property</li>
                <li>We do not guarantee the availability of the court or equipment at all times</li>
                <li>We reserve the right to close the court for maintenance, events, or safety reasons</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Medical Condition</h3>
              <p className="text-gray-700">
                If you have any medical conditions or concerns, please consult with a healthcare professional before 
                participating in basketball activities. You are responsible for ensuring you are physically able to 
                participate safely.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on the Madina Basketball website, including text, graphics, logos, images, and software, 
                is the property of Madina Basketball or its content suppliers and is protected by copyright and other 
                intellectual property laws.
              </p>
              <p className="text-gray-700">
                You may not reproduce, distribute, modify, or create derivative works from any content on the website 
                without prior written permission from Madina Basketball.
              </p>
            </div>

            {/* Prohibited Activities */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">
                The following activities are strictly prohibited:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Vandalism, graffiti, or intentional damage to court facilities or equipment</li>
                <li>Use of the court for illegal activities</li>
                <li>Harassment, discrimination, or threatening behavior toward other users</li>
                <li>Unauthorized commercial activities or solicitation</li>
                <li>Interference with court operations or other users' enjoyment of the facility</li>
                <li>Attempting to gain unauthorized access to administrative systems or accounts</li>
                <li>Posting false, misleading, or defamatory information</li>
              </ul>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to suspend or terminate your access to the court and services, with or without 
                notice, for any violation of these Terms or for any other reason we deem necessary to protect the 
                safety and integrity of the facility and community.
              </p>
              <p className="text-gray-700">
                Upon termination, your right to use the court and services will immediately cease. We may also remove 
                or delete any information or content associated with your account.
              </p>
            </div>

            {/* Modifications to Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Modifications to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes 
                by posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of 
                the court and services after such modifications constitutes your acceptance of the updated Terms.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                In the event of any dispute arising from or relating to these Terms or your use of the court:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>We encourage you to contact us first to attempt to resolve the dispute amicably</li>
                <li>If a dispute cannot be resolved through direct communication, it shall be subject to the exclusive 
                    jurisdiction of the courts of Ghana</li>
                <li>These Terms shall be governed by and construed in accordance with the laws of Ghana</li>
              </ul>
            </div>

            {/* Severability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Severability</h2>
              <p className="text-gray-700">
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining 
                provisions shall continue in full force and effect.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-muted rounded-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Questions About These Terms</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Email</p>
                  <Link href="mailto:themadinacourt@gmail.com" className="text-primary hover:underline">
                    themadinacourt@gmail.com
                  </Link>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">WhatsApp</p>
                  <Link href="https://wa.me/233559602056" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    +233 55 960 2056
                  </Link>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Location</p>
                  <p className="text-gray-700">Libya Quarters, Madina, Accra, Ghana</p>
                </div>
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-600 text-center">
                By using the Madina Basketball court, website, or services, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


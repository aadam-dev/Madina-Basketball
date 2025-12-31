import { FileText, DollarSign, CheckCircle, BarChart3, Receipt, ArrowRight } from "lucide-react";
import Image from "next/image";
import GoogleSheetsEmbed from "@/components/GoogleSheetsEmbed";

export default function Transparency() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Transparency</h1>
            <p className="text-xl text-white/90">
              Building trust through complete openness
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-muted rounded-xl p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Transparency is at the core of the Madina Basketball project. From the very beginning,
                we committed to complete openness about every step of the process—from assessment to
                fundraising to execution. This page documents our financial journey and demonstrates
                our commitment to accountability.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Every cedi raised, every decision made, and every expense incurred has been documented
                and shared with the community. This transparency builds trust and ensures that the
                court truly belongs to the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOQ Summary */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Bill of Quantities (BOQ)</h2>
            <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-semibold">Project Assessment</h3>
              </div>
              <p className="text-gray-700 text-lg mb-6">
                Engineers assessed the site and prepared a detailed Bill of Quantities outlining
                all materials, labor, and services required for the renovation.
              </p>
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Total BOQ Amount:</span>
                  <span className="text-2xl font-bold text-primary">GHS 37,250</span>
                </div>
                <p className="text-sm text-gray-600">
                  This amount covered all aspects of the renovation including surface work,
                  court markings, rims, painting, and related infrastructure.
                </p>
              </div>
            </div>

            {/* BOQ Summary */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Cost Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 pt-4 border-t-2 border-primary">
                  <span className="text-lg font-bold">Total Project Cost</span>
                  <span className="text-lg font-bold text-primary">GHS 37,250</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Note:</strong> The proforma invoice below shows the complete breakdown. 
                All line items and amounts are documented in the invoice for full transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fundraising Dashboard */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Fundraising Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-muted rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">GHS 37,250</div>
                <div className="text-gray-600 font-medium">BOQ Target</div>
              </div>
              <div className="bg-muted rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">GHS 44,750</div>
                <div className="text-gray-600 font-medium">Amount Raised</div>
              </div>
              <div className="bg-muted rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">120%</div>
                <div className="text-gray-600 font-medium">Target Exceeded</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-semibold">Fundraising Progress</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Through transparent community fundraising, we successfully raised GHS 44,750 from 18 donors, 
                exceeding our BOQ target of GHS 37,250. Every contribution, large and small, was documented
                and acknowledged. Shafic's connections were instrumental in securing key funding 
                for the project.
              </p>
              <p className="text-gray-700 mb-6">
                Our donation dashboard tracks all contributions in real-time, providing complete 
                transparency on fundraising progress and donor recognition.
              </p>
              <div className="bg-muted rounded-lg overflow-hidden mb-4">
                <GoogleSheetsEmbed
                  sheetUrl="https://docs.google.com/spreadsheets/d/1fyjItPyghvd5aVZSrrF__4U3gwLQcemCZHu6psPL-BA/edit?gid=609525463#gid=609525463"
                  title="Live Donation Dashboard"
                  height="500px"
                />
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-700 mb-4">
                  We are deeply grateful to all 18 donors who contributed to this project. Every contribution, 
                  regardless of amount, made this renovation possible.
                </p>
                <a
                  href="/partners#donors"
                  className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline"
                >
                  <span>View Our Donors</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div className="bg-primary h-4 rounded-full" style={{ width: '120%', maxWidth: '100%' }}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0%</span>
                  <span>120% of Target (GHS 44,750 raised)</span>
                  <span>120%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contractor Invoice */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Contractor Invoice</h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <Receipt className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-semibold">Payment Documentation</h3>
              </div>
              <p className="text-gray-700 text-lg mb-6">
                All contractor payments were made with proper documentation and oversight.
                The invoice and payment receipts are maintained for transparency and accountability.
              </p>
              <div className="bg-muted rounded-lg overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image
                    src="/images/journey/proforma-invoice.jpg"
                    alt="Proforma Invoice - Bill of Quantities"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Proforma Invoice:</strong> This document shows the detailed breakdown of all costs 
                for the renovation project. All amounts are in GHS (Ghana Cedis).
              </p>
              <p className="text-sm text-gray-500 mt-4">
                <strong>Note:</strong> Sensitive information (contractor details, account numbers)
                may be redacted for privacy, but payment amounts and dates are fully documented.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Transparency */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ongoing Transparency</h2>
            <p className="text-xl mb-8 text-white/90">
              Transparency doesn't end with the renovation. We remain committed to open communication
              about court operations, maintenance, and any future initiatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
              >
                Request Documentation
              </a>
              <a
                href="/about"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Learn More About the Project
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


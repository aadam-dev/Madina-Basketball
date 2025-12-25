import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SiteWrapper from "@/components/SiteWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Madina Basketball — Community-Built Court, Now Active",
  description: "A grassroots basketball initiative in Libya Quarters, Madina (Accra, Ghana). Community-renovated court, now active with training programs, pick-up games, and bookings.",
  keywords: "basketball, Madina, Accra, Ghana, community sports, youth development, Libya Quarters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Admin routes have their own layout, so we don't need Header/Footer there
  // The admin layout will handle its own structure
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <SiteWrapper>{children}</SiteWrapper>
      </body>
    </html>
  );
}

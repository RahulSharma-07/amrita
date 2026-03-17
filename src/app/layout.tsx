import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Shree Amrita Academy | Excellence in Education",
  description: "Shree Amrita Academy - Managed by Shri Bindheshwari Educational Trust. Providing quality education with international standard infrastructure, STEM curriculum, and holistic development.",
  keywords: "Shree Amrita Academy, School Ankleshwar, Education, GSEB School, Admission 2026-2027",
  openGraph: {
    title: "Shree Amrita Academy",
    description: "Excellence in Education - Admission Open for 2026-2027",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <StructuredData />
        <Navbar />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

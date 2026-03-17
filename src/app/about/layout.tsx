import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us - Shree Amrita Academy | Excellence in Education",
  description: "Learn about Shree Amrita Academy's mission, vision, and commitment to providing quality education. Managed by Shri Bindheshwari Educational Trust with 15+ years of excellence.",
  keywords: "Shree Amrita Academy about, mission vision, educational trust, Ankleshwar school, quality education",
  openGraph: {
    title: "About Shree Amrita Academy",
    description: "Discover our commitment to excellence in education and holistic student development",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

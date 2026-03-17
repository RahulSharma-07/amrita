import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Faculty - Shree Amrita Academy | Our Teaching Team",
  description: "Meet the dedicated faculty team at Shree Amrita Academy. Experienced educators committed to nurturing young minds and providing quality education.",
  keywords: "Shree Amrita Academy faculty, teaching staff, experienced teachers, Ankleshwar school faculty",
  openGraph: {
    title: "Our Faculty - Shree Amrita Academy",
    description: "Meet our dedicated team of experienced educators",
    type: "website",
  },
};

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

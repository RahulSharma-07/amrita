import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us - Shree Amrita Academy | Get in Touch",
  description: "Contact Shree Amrita Academy for admissions, inquiries, and information. Located in Ankleshwar, Gujarat. Call us at +91 92277 80530 or email amritaacademy@yahoo.co.in",
  keywords: "Shree Amrita Academy contact, school admission Ankleshwar, contact phone email, school address",
  openGraph: {
    title: "Contact Shree Amrita Academy",
    description: "Get in touch with us for admissions and inquiries",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

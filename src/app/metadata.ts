import { Metadata } from 'next';

const BASE_URL = 'https://shreeamritaacademy.com';

export function getPageMetadata(page: string): Metadata {
  const metadataMap: Record<string, Metadata> = {
    '/': {
      metadataBase: new URL(BASE_URL),
      alternates: { canonical: '/' },
      title: "Shree Amrita Academy | Excellence in Education",
      description: "Shree Amrita Academy - Managed by Shri Bindheshwari Educational Trust. Providing quality education with international standard infrastructure, STEM curriculum, and holistic development.",
      keywords: "Shree Amrita Academy, School Ankleshwar, Education, GSEB School, Admission 2026-2027",
      openGraph: {
        title: "Shree Amrita Academy",
        description: "Excellence in Education - Admission Open for 2026-2027",
        type: "website",
        images: ['/og-image.jpg'],
      },
    },
    '/about': {
      alternates: { canonical: '/about' },
      title: "About Us - Shree Amrita Academy | Excellence in Education",
      description: "Learn about Shree Amrita Academy's mission, vision, and commitment to providing quality education. Managed by Shri Bindheshwari Educational Trust with 15+ years of excellence.",
      keywords: "Shree Amrita Academy about, mission vision, educational trust, Ankleshwar school, quality education",
      openGraph: {
        title: "About Shree Amrita Academy",
        description: "Discover our commitment to excellence in education and holistic student development",
        type: "website",
      },
    },
    '/contact': {
      alternates: { canonical: '/contact' },
      title: "Contact Us - Shree Amrita Academy | Get in Touch",
      description: "Contact Shree Amrita Academy for admissions, inquiries, and information. Located in Ankleshwar, Gujarat. Call us at +91 92277 80530 or email amritaacademy@yahoo.co.in",
      keywords: "Shree Amrita Academy contact, school admission Ankleshwar, contact phone email, school address",
      openGraph: {
        title: "Contact Shree Amrita Academy",
        description: "Get in touch with us for admissions and inquiries",
        type: "website",
      },
    },
    '/faculty': {
      alternates: { canonical: '/faculty' },
      title: "Faculty - Shree Amrita Academy | Our Teaching Team",
      description: "Meet the dedicated faculty team at Shree Amrita Academy. Experienced educators committed to nurturing young minds and providing quality education.",
      keywords: "Shree Amrita Academy faculty, teaching staff, experienced teachers, Ankleshwar school faculty",
      openGraph: {
        title: "Our Faculty - Shree Amrita Academy",
        description: "Meet our dedicated team of experienced educators",
        type: "website",
      },
    },
    '/admission': {
      alternates: { canonical: '/admission' },
      title: "Admission Form 2026-2027 - Shree Amrita Academy",
      description: "Apply for admission at Shree Amrita Academy for the 2026-2027 academic session. Join Ankleshwar's premier educational institution. Start your child's journey today.",
      keywords: "school admission Ankleshwar, Shree Amrita Academy admission form, SAA apply online, admission 2026-2027",
    },
    '/gallery': {
      alternates: { canonical: '/gallery' },
      title: "Event Gallery - Shree Amrita Academy | Life at SAA",
      description: "Explore the vibrant life at Shree Amrita Academy through our event gallery. Capturing moments from sports, cultural events, and academic celebrations.",
      keywords: "Shree Amrita Academy gallery, school events, sports day photos, cultural events Ankleshwar",
    },
    '/calendar': {
      alternates: { canonical: '/calendar' },
      title: "Academic Calendar - Shree Amrita Academy",
      description: "Stay updated with Shree Amrita Academy's academic calendar. View upcoming holidays, exam schedules, and school events for the year 2026.",
      keywords: "school calendar Ankleshwar, academic schedule, holiday list SAA, exam dates",
    },
    '/downloads': {
      alternates: { canonical: '/downloads' },
      title: "Downloads & Resources - Shree Amrita Academy",
      description: "Download important school documents, brochures, syllabus, and forms from Shree Amrita Academy's resource center.",
      keywords: "school resources, syllabus download, school forms Ankleshwar, prospectus download",
    },
    '/tours': {
      alternates: { canonical: '/tours' },
      title: "Education Tours - Shree Amrita Academy",
      description: "Discover our educational tours and travel programs. We believe in learning beyond classrooms through experiential academic trips.",
      keywords: "educational tours, school trips SAA, field trips Ankleshwar",
    },
    '/privacy-policy': {
      alternates: { canonical: '/privacy-policy' },
      title: "Privacy Policy - Shree Amrita Academy",
      description: "Read our privacy policy to understand how we protect your personal and student data at Shree Amrita Academy.",
      robots: "noindex, follow",
    },
    '/terms': {
      alternates: { canonical: '/terms' },
      title: "Terms & Conditions - Shree Amrita Academy",
      description: "View the terms and conditions for admission and website usage at Shree Amrita Academy.",
      robots: "noindex, follow",
    },
  };

  const metadata = metadataMap[page] || metadataMap['/'];
  return {
    ...metadata,
    metadataBase: new URL(BASE_URL),
  };
}

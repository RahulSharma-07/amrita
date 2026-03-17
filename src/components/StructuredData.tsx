export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Shree Amrita Academy",
    "url": "https://shreeamritaacademy.com",
    "logo": "https://shreeamritaacademy.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-92277-80530",
      "contactType": "Admissions",
      "availableLanguage": ["English", "Hindi", "Gujarati"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot No. 36 to 40, Pushpvatika Society, Nr. Gadkhol Patia",
      "addressLocality": "Ankleshwar",
      "addressRegion": "Gujarat",
      "postalCode": "393002",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://facebook.com/shreeamritaacademy",
      "https://instagram.com/shreeamritaacademy",
      "https://youtube.com/shreeamritaacademy"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

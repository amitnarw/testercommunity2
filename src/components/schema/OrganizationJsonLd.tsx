export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "inTesters",
    alternateName: "inTesters Community",
    url: "https://intesters.com",
    logo: "https://intesters.com/inTesters-logo-light.svg",
    description: "App testing community platform where developers get their Android apps tested by real users to meet Google Play's 12-tester requirement.",
    foundingDate: "2024",
    legalName: "GAMDIX PRIVATE LIMITED",
    sameAs: [
      "https://x.com/inTesters",
      "https://www.reddit.com/r/inTesters",
      "https://t.me/inTesters",
      "https://www.youtube.com/",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "support",
      email: "support@intesters.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

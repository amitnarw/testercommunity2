export function SoftwareApplicationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "inTesters",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Android, Web",
    description: "Platform for Android app testing and meeting Google Play's 12-tester closed testing requirement.",
    url: "https://intesters.com",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free community testing",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

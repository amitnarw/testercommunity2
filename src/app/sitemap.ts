import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://intesters.com";

  const staticPages = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/how-it-works`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/pricing`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/reviews`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/contact-us`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/help`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/acceptable-use`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/offers`, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/community-hub`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/samples/free-community-hub`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/samples/paid-dashboard`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/12-testers-google-play-complete-guide`, changeFrequency: "weekly" as const, priority: 0.95 },
  ];

  return [
    ...staticPages,
  ];
}

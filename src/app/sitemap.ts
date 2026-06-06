import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/data";
import { articles } from "@/lib/blog-data";

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
    { url: `${baseUrl}/cookie-policy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/offers`, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/seo/free-testing`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/samples/free-testing`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/seo/pro-testing`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/samples/pro-testing`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/12-testers-google-play-complete-guide`, changeFrequency: "weekly" as const, priority: 0.95 },
    { url: `${baseUrl}/llms.txt`, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/llms-full.txt`, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/guides`, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  // Dynamic Blog Posts
  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Guide Categories
  const uniqueCategories = Array.from(new Set(articles.map((art) => art.category)));
  const guideCategoryUrls = uniqueCategories.map((cat) => {
    const categorySlug = cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
    return {
      url: `${baseUrl}/guides/${categorySlug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  // Dynamic Guide Articles
  const guideArticleUrls = articles.map((article) => {
    const categorySlug = article.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
    return {
      url: `${baseUrl}/guides/${categorySlug}/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  return [
    ...staticPages,
    ...blogUrls,
    ...guideCategoryUrls,
    ...guideArticleUrls,
  ];
}

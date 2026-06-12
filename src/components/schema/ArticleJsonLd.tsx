interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedTime: string;
  updatedTime?: string;
  authorName: string;
  tags?: string[];
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  publishedTime,
  updatedTime,
  authorName,
  tags,
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: imageUrl,
    url: `https://intesters.com${url}`,
    datePublished: publishedTime,
    dateModified: updatedTime || publishedTime,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "inTesters",
      logo: {
        "@type": "ImageObject",
        url: "https://intesters.com/inTesters-logo-light.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://intesters.com${url}`,
    },
    keywords: tags?.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

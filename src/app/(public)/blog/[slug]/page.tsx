import { getPublicBlogBySlug } from "@/lib/apiCalls";
import BlogPostClient from "./BlogPostClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);

  if (!blog) {
    return { title: "Blog Post Not Found | inTesters" };
  }

  return {
    title: `${blog.title} | inTesters`,
    description: blog.excerpt,
    keywords: blog.tags.join(", "),
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      url: `/blog/${slug}`,
      siteName: "inTesters",
      images: [
        {
          url: blog.imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      publishedTime: blog.date,
      authors: [blog.authorName],
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: blog.title, url: `/blog/${slug}` },
        ]}
      />
      <ArticleJsonLd
        title={blog.title}
        description={blog.excerpt}
        url={`/blog/${slug}`}
        imageUrl={blog.imageUrl}
        publishedTime={blog.date}
        updatedTime={blog.updatedAt}
        authorName={blog.authorName}
        tags={blog.tags}
      />
      <BlogPostClient slug={slug} initialData={blog} />
    </>
  );
}

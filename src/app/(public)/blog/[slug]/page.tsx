import { getPublicBlogBySlug } from "@/lib/apiCalls";
import BlogPostClient from "./BlogPostClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);

  if (!blog) {
    return { title: "Blog Post Not Found" };
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

  return <BlogPostClient slug={slug} />;
}
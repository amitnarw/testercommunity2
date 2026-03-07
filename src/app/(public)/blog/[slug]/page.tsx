import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data";
import { ArticleView } from "@/components/blog/article-view";
import { Metadata } from "next";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  // The original code `params.slug` would not work directly if `params` is a Promise.
  // Assuming the intent is to get the slug from the resolved promise.
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} | inTesters Blog`,
    description: post.excerpt,
    openGraph: {
      images: [post.imageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return <ArticleView post={post} />;
}

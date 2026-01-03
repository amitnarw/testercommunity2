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
  params: { slug: string };
}): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} | inTesters Blog`,
    description: post.excerpt,
    openGraph: {
      images: [post.imageUrl],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return <ArticleView post={post} />;
}

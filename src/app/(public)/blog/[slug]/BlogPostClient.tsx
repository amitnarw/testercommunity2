"use client";

import { notFound } from "next/navigation";
import { ArticleView } from "@/components/blog/article-view";
import { useEffect, useState } from "react";
import { getPublicBlogBySlug, PublicBlog } from "@/lib/apiCalls";

interface BlogPostClientProps {
  slug: string;
}

function blogPostToDisplayFormat(post: PublicBlog) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: {
      name: post.authorName,
      avatarUrl: post.authorAvatarUrl,
      dataAiHint: post.authorDataAiHint,
    },
    date: post.date,
    imageUrl: post.imageUrl,
    dataAiHint: post.dataAiHint,
    tags: post.tags,
  };
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<PublicBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const blog = await getPublicBlogBySlug(slug);
        if (!blog) {
          setPost(null);
        } else {
          setPost(blog);
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return <ArticleView post={blogPostToDisplayFormat(post)} />;
}
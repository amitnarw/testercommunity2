"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BlogListing } from "@/components/blog/blog-listing";
import { BlogListingSkeleton } from "@/components/blog/blog-listing-skeleton";
import { getPublicBlogs, PublicBlog } from "@/lib/apiCalls";
import { decryptData } from "@/lib/encryptDecryptPayload";

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

export default function BlogPage() {
  const [posts, setPosts] = useState<PublicBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        console.log("Fetching blogs from API...");
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/blogs`;
        console.log("URL:", url);
        const response = await fetch(url, {
          credentials: "include",
        });
        console.log("Response status:", response.status);
        const json = await response.json();
        console.log("Response JSON:", JSON.stringify(json).slice(0, 200));

        // Decrypt the encrypted data
        const blogs = await decryptData<any[]>(json.data);
        console.log("Decrypted blogs count:", blogs.length);
        setPosts(blogs);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError(err instanceof Error ? err.message : "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div
        data-loc="BlogPage"
        className="min-h-screen bg-background relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 relative z-10">
          <BlogListingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-loc="BlogPage"
        className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center"
      >
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

  const displayPosts = posts.map(blogPostToDisplayFormat);

  return (
    <div
      data-loc="BlogPage"
      className="min-h-screen bg-background relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            The inTesters
            <span className="block text-primary">Chronicles</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Deep dives into quality assurance, community stories, and the future
            of software testing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BlogListing posts={displayPosts} />
        </motion.div>
      </div>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/types";
import { BLOG_CATEGORY_LABELS } from "@/lib/types";

interface BlogListingProps {
  posts: BlogPost[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function BlogListing({
  posts,
  categories,
  selectedCategory,
  onCategoryChange,
}: BlogListingProps) {
  const allCategories = ["All", ...categories];

  return (
    <div data-loc="BlogListing" className="space-y-16">
      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-muted/30 backdrop-blur-xl rounded-full border border-white/10">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-500
                ${
                  selectedCategory === category
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {selectedCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                {BLOG_CATEGORY_LABELS[
                  category as keyof typeof BLOG_CATEGORY_LABELS
                ] || category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="min-h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: idx * 0.05,
                ease: "easeOut",
              }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>

      {posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="text-6xl mb-4">&#x1F578;&#xFE0F;</div>
          <h3 className="text-2xl font-bold mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            We are writing them as we speak!
          </p>
        </motion.div>
      )}
    </div>
  );
}

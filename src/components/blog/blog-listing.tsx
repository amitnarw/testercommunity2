"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface BlogListingProps {
  posts: BlogPost[];
}

const CATEGORIES = [
  "All",
  "Automation",
  "UI/UX",
  "Security",
  "AI",
  "Mobile",
  "DevOps",
];

export function BlogListing({ posts }: BlogListingProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) =>
          post.tags.some(
            (tag) =>
              tag.toLowerCase().includes(selectedCategory.toLowerCase()) ||
              tag === selectedCategory
          )
        );

  return (
    <div data-loc="BlogListing" className="space-y-20">
      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-muted/30 backdrop-blur-xl rounded-full border border-white/10">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
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
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Grid */}
      <div className="min-h-[600px] columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              layout
              initial={{ filter: "blur(20px)", opacity: 0, y: 30 }}
              whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              exit={{ filter: "blur(20px)", opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ duration: 0.8, delay: idx * 0.08, ease: "easeOut" }}
              className="break-inside-avoid"
            >
              <BlogCard post={post} index={idx} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="text-6xl mb-4">🕸️</div>
          <h3 className="text-2xl font-bold mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            We are writing them as we speak!
          </p>
        </motion.div>
      )}

    </div>
  );
}

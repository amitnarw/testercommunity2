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
    <div className="space-y-20">
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
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
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

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-blue-600 text-primary-foreground p-8 md:p-24 text-center mt-32"
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        {/* Animated Background Shapes */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/10 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-blue-300/20 blur-[120px] rounded-full"
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-md px-4 py-1.5 text-sm uppercase tracking-wider">
            Weekly Digest
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Stop Testing in Production.
            <span className="block text-blue-200">Start Learning.</span>
          </h2>
          <p className="text-blue-100/80 text-lg md:text-xl max-w-xl mx-auto">
            Join 10,000+ QA professionals. We distill the noise into actionable
            insights, sent every Monday.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="name@company.com"
              className="flex-1 rounded-full px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-blue-100/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 backdrop-blur-xl transition-all"
            />
            <button className="px-8 py-4 rounded-full bg-white text-primary font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">
              Join Now
            </button>
          </form>
        </div>
      </motion.section>
    </div>
  );
}

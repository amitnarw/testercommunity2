"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  // Simple logic to vary card styles for visual interest in the masonry grid
  const isTall = index % 3 === 1; // Every 2nd card is "tall"

  return (
    <Link href={`/blog/${post.slug}`} className="block group mb-8">
      <motion.article
        whileHover={{ y: -8 }}
        className="relative flex flex-col h-full bg-card/50 hover:bg-card border border-border/50 hover:border-border transition-colors duration-500 rounded-[2rem] overflow-hidden"
      >
        {/* Image Container */}
        <div
          className={cn(
            "relative w-full overflow-hidden bg-muted",
            isTall ? "aspect-[3/4]" : "aspect-[4/3]"
          )}
        >
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />

          <div className="absolute top-4 left-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 1).map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-1 bg-background/50 backdrop-blur-md rounded-full text-xs font-semibold border border-white/10 text-foreground"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col flex-1">
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {Math.ceil(post.content.length / 800)} min read
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>

          <p className="text-muted-foreground line-clamp-3 mb-6 text-sm leading-relaxed flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-background">
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium">{post.author.name}</span>
            </div>

            <div className="flex items-center gap-1 text-sm font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Read Article <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

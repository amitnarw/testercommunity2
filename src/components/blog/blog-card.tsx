"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { BLOG_CATEGORY_LABELS } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group h-full">
      <article className="relative flex flex-col h-full overflow-hidden rounded-2xl bg-card border border-border/40 transition-colors duration-300">
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 bg-accent rounded-full text-[11px] font-semibold text-secondary-foreground uppercase tracking-wide">
              {BLOG_CATEGORY_LABELS[post.category] || post.category}
            </span>
            <time className="text-xs text-muted-foreground">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
          <h3 className="text-lg md:text-xl font-semibold leading-snug mb-2 group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 rounded-full overflow-hidden ring-2 ring-background">
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {post.author.name}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

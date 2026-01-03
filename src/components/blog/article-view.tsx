"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Bookmark,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ArticleViewProps {
  post: BlogPost;
}

export function ArticleView({ post }: ArticleViewProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isScrolledPastHeader, setIsScrolledPastHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHeader(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Floating Navigation Header (appears on scroll) */}
      <motion.div
        className={cn(
          "fixed top-0 inset-x-0 h-16 bg-background/80 backdrop-blur-lg border-b border-border/50 z-40 flex items-center justify-between px-4 md:px-8 transition-all duration-300",
          isScrolledPastHeader
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        )}
      >
        <Link
          href="/blog"
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <span className="text-sm font-semibold truncate max-w-[200px] md:max-w-md">
          {post.title}
        </span>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-12 lg:py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12 group"
        >
          <span className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </span>
          Back to all articles
        </Link>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto text-center mb-16 space-y-8">
          <div className="flex items-center justify-center gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-primary/10 text-primary border-transparent hover:bg-primary/20"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                <AvatarImage src={post.author.avatarUrl} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">
                  {post.author.name}
                </p>
                <p className="text-xs">Author</p>
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs">Published</p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4 italic opacity-70">
            Image source: Unsplash · {post.title}
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar (Socials) */}
          <aside className="hidden lg:block lg:col-span-2 relative">
            <div className="sticky top-32 flex flex-col gap-4 items-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 writing-mode-vertical">
                Share
              </p>
              <button className="p-3 rounded-full bg-muted/50 hover:bg-blue-500 hover:text-white transition-all hover:scale-110">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-muted/50 hover:bg-sky-500 hover:text-white transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-muted/50 hover:bg-blue-700 hover:text-white transition-all hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </button>
              <div className="w-8 h-px bg-border my-2" />
              <button className="p-3 rounded-full bg-muted/50 hover:bg-yellow-500 hover:text-white transition-all hover:scale-110">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </aside>

          {/* Content Body */}
          <div className="col-span-1 lg:col-span-8">
            <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl">
              <p className="lead text-2xl md:text-3xl font-light text-muted-foreground mb-8">
                {post.excerpt}
              </p>

              {/* We are rendering HTML from data, need to ensure it's safe or mocked well */}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />

              <hr className="my-12 border-border" />

              <div className="bg-muted/30 p-8 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">About the Author</h3>
                <div className="flex gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={post.author.avatarUrl} />
                    <AvatarFallback>
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-xl">{post.author.name}</p>
                    <p className="text-muted-foreground">
                      Expert software tester and contributor to the community.
                      Passionate about AI, automation, and user experience.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar (TOC placeholder or related) */}
          <aside className="hidden lg:block lg:col-span-2 relative">
            {/* Could go TOC here */}
          </aside>
        </div>
      </main>

      {/* Mobile Share Bar (Bottom) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border z-30 flex justify-around">
        <button className="p-2 text-muted-foreground hover:text-foreground">
          <Share2 />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground">
          <Facebook />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground">
          <Twitter />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground">
          <Bookmark />
        </button>
      </div>
    </div>
  );
}

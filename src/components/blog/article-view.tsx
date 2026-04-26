"use client";

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/types";
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHeader(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = post.title;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

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
        <header className="max-w-4xl mx-auto text-center mb-10 space-y-8">
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

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="h-10 w-10 rounded-full border-2 border-background shadow-sm object-cover"
              />
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
        <div className="max-w-6xl mx-auto mb-10">
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
              <button
                onClick={() => handleShare("facebook")}
                className="p-3 rounded-full bg-muted/50 hover:bg-blue-500 hover:text-white transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="p-3 rounded-full bg-muted/50 hover:bg-sky-500 hover:text-white transition-all hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="p-3 rounded-full bg-muted/50 hover:bg-blue-700 hover:text-white transition-all hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <motion.button
                onClick={handleCopyLink}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-muted/50 relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={copied ? "check" : "copy"}
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 2.5 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute inset-0 bg-green-500/30 rounded-full"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
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

              <div className="bg-gradient-to-tr from-primary to-primary/50 p-3 sm:p-6 rounded-3xl">
                <h3 className="text-sm font-semibold !mt-0 text-white">About the Author</h3>
                <div className="flex gap-3">
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="h-12 w-12 rounded-full border-2 border-white/30 object-cover shrink-0 !my-0"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-white !my-0">{post.author.name}</p>
                    <p className="text-xs text-white/80 !my-2">
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
        <button
          onClick={() => handleShare("facebook")}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          <Facebook />
        </button>
        <button
          onClick={() => handleShare("twitter")}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          <Twitter />
        </button>
        <button
          onClick={() => handleShare("linkedin")}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          <Linkedin />
        </button>
        <motion.button
          onClick={handleCopyLink}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-muted-foreground hover:text-foreground relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={copied ? "check" : "copy"}
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy />}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 2.5 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 bg-green-500/30 rounded-full"
              />
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

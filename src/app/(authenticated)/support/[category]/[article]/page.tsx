"use client";

import { motion } from "framer-motion";
import {
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  ChevronLeft,
  FileText,
  Shield,
  Star,
  Wallet,
  Globe,
  Share2,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

const categorySlugMap: Record<string, string> = {
  "google-play-guidelines": "Google Play Guidelines",
  "free-community-testing": "Free Community Testing",
  "paid-professional-testing": "Paid Professional Testing",
  "wallet-account": "Wallet & Account",
};

export default function ArticlePage() {
  const params = useParams();
  const articleSlug = params.article as string;
  const categorySlug = params.category as string;
  const article = getArticleBySlug(articleSlug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-black uppercase tracking-tighter">System Error: 404</h1>
          <Link href="/support">
            <Button variant="outline" className="border-2 border-border hover:border-primary rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs">
              Return to Center
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = getArticlesByCategory(article.category)
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30 overflow-x-hidden transition-colors duration-500">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--muted)/0.5)_0%,hsl(var(--background))_100%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(17,24,39,1)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />

      <main className="container mx-auto px-4 md:px-8 py-12 md:py-24 max-w-4xl relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-16"
        >
          {/* Header Navigation Interface */}
          <div className="space-y-10">
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
              <Link href="/support" className="hover:text-primary transition-colors">Support Hub</Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-30" />
              <Link href={`/support/${categorySlug}`} className="hover:text-primary transition-colors">
                {categorySlugMap[categorySlug]}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-30" />
              <span className="text-primary truncate max-w-[150px] md:max-w-none">{article.title}</span>
            </div>

            <div className="flex justify-between items-center">
              <Link href={`/support/${categorySlug}`}>
                <Button variant="ghost" className="group text-muted-foreground hover:text-primary hover:bg-muted dark:hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] px-0 hover:px-6 transition-all h-10">
                  <ChevronLeft className="w-3.5 h-3.5 mr-3 group-hover:-translate-x-1 transition-transform" />
                  Exit Article
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-border hover:border-primary transition-all">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-border hover:border-primary transition-all">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Article Identity Section */}
          <div className="space-y-10 pb-16 border-b-2 border-border">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Technical Archiving: {article.category}
              </div>
              <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tight leading-[0.85] uppercase text-foreground">
                {article.title}
              </h1>
              <p className="text-2xl text-muted-foreground leading-relaxed font-bold max-w-3xl italic opacity-80">
                "{article.description}"
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-12 gap-y-6 pt-10 border-t border-border text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <span>Script v2.04</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span>Indexed: {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* Structured Content Interface */}
          <div className="relative">
            <article className="prose prose-zinc dark:prose-invert max-w-none 
              prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black
              prose-h2:text-5xl prose-h2:border-b-2 prose-h2:border-border prose-h2:pb-6 prose-h2:mt-24 prose-h2:mb-12 prose-h2:text-foreground
              prose-h3:text-2xl prose-h3:mt-16 prose-h3:mb-8 prose-h3:text-primary
              prose-p:text-muted-foreground prose-p:text-xl prose-p:leading-relaxed prose-p:font-medium prose-p:mb-8
              prose-strong:text-foreground prose-strong:font-black prose-strong:bg-muted/30 prose-strong:px-1 prose-strong:rounded
              prose-li:text-muted-foreground prose-li:text-xl prose-li:font-medium prose-li:marker:text-primary prose-li:marker:font-black
              prose-code:text-primary prose-code:bg-primary/5 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none prose-code:font-black prose-code:text-base
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/20 prose-blockquote:p-10 prose-blockquote:rounded-[2.5rem] prose-blockquote:italic prose-blockquote:text-foreground prose-blockquote:text-2xl
              prose-hr:border-border prose-hr:border-2 prose-hr:my-20
            ">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </article>
          </div>

          {/* Related Modules */}
          <div className="pt-32 space-y-12">
            <div className="flex items-center gap-4">
              <div className="h-[2px] flex-1 bg-border" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground px-8">Accelerated Tracks</h3>
              <div className="h-[2px] flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((ra) => (
                <Link
                  key={ra.id}
                  href={`/support/${categorySlug}/${ra.slug}`}
                  className="group p-8 rounded-[2.5rem] bg-card border-2 border-border hover:border-primary transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="h-full flex flex-col justify-between space-y-6">
                    <h4 className="font-black text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight uppercase tracking-tight">
                      {ra.title}
                    </h4>
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{ra.readTime}</span>
                      <ChevronRight className="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* System Feedback Terminal */}
          <div className="pt-24 pb-12">
            <div className="p-12 rounded-[4rem] bg-muted/20 border-2 border-border flex flex-col items-center text-center space-y-8">
              <div className="w-16 h-16 rounded-3xl bg-card flex items-center justify-center text-primary shadow-xl border border-border">
                <Zap className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black uppercase tracking-tight text-foreground leading-none">Status: Optimized?</h3>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide max-w-xs">Your system feedback refines our global documentation efficiency.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="border-2 border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 rounded-2xl h-14 px-10 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                  Confirmed
                </Button>
                <Button variant="outline" className="border-2 border-border hover:border-rose-500/50 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 rounded-2xl h-14 px-10 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                  Incomplete
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

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
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Article Not Found</h1>
          <Link href="/support">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl h-12 px-8 font-bold uppercase tracking-widest text-[10px]">
              Back to Support
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
    <div className="min-h-screen w-full bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />

      <main className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-4xl relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-16"
        >
          {/* Header Navigation */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
              <Link href="/support" className="hover:text-blue-400 transition-colors">Support Center</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/support/${categorySlug}`} className="hover:text-blue-400 transition-colors">
                {categorySlugMap[categorySlug]}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-400 truncate max-w-[150px] md:max-w-none">{article.title}</span>
            </div>

            <Link href={`/support/${categorySlug}`}>
              <Button variant="ghost" className="group text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest px-0 hover:px-4 transition-all">
                <ChevronLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Return to Category
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <div className="space-y-8 pb-12 border-b border-white/[0.03]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                Track: {article.category}
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.9] uppercase">
                {article.title}
              </h1>
              <p className="text-xl text-zinc-500 leading-relaxed font-medium max-w-3xl">
                {article.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8 py-6 border-y border-white/[0.03] text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-zinc-700" />
                <span>Technical Script</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-zinc-700" />
                <span>{article.readTime} EST.</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-zinc-700" />
                <span>INDEXED: {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-zinc-700" />
                <span>{article.views} PV</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="relative">
            <article className="prose prose-invert prose-zinc max-w-none 
              prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black
              prose-h2:text-4xl prose-h2:border-b prose-h2:border-white/[0.03] prose-h2:pb-4 prose-h2:mt-16
              prose-p:text-zinc-400 prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium
              prose-strong:text-white prose-strong:font-bold
              prose-li:text-zinc-400 prose-li:text-lg
              prose-code:text-blue-400 prose-code:bg-blue-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              prose-blockquote:border-l-blue-500 prose-blockquote:bg-zinc-900/40 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-zinc-300
            ">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </article>
          </div>

          {/* Related Resources */}
          <div className="pt-24 space-y-10">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-600 text-center">Accelerated tracks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((ra) => (
                <Link
                  key={ra.id}
                  href={`/support/${categorySlug}/${ra.slug}`}
                  className="group p-6 rounded-[2rem] bg-zinc-900/10 border border-white/[0.03] hover:bg-zinc-900/30 hover:border-white/10 transition-all duration-300"
                >
                  <div className="h-full flex flex-col justify-between space-y-4">
                    <h4 className="font-bold text-zinc-300 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight uppercase tracking-tight">
                      {ra.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{ra.readTime}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Feedback / CTA */}
          <div className="pt-16 pb-12">
            <div className="p-10 rounded-[3rem] bg-zinc-900/20 border border-white/[0.03] flex flex-col items-center text-center space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-widest">Was this helpful?</h3>
                <p className="text-zinc-600 text-sm font-medium">Your feedback optimizes our documentation engine.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-white/5 hover:bg-white/5 rounded-xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest">Yes, confirmed</Button>
                <Button variant="outline" className="border-white/5 hover:bg-white/5 rounded-xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest">No, clarify</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

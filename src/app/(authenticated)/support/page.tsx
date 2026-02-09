"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  TrendingUp,
  ArrowRight,
  Shield,
  Zap,
  Star,
  Wallet,
  Globe,
  HelpCircle,
  MessageCircle,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { getPopularArticles, searchArticles } from "@/lib/blog-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SupportChatbot } from "@/components/support-chatbot";

const categories = [
  {
    id: "google-play-guidelines",
    icon: Shield,
    title: "Google Play Guidelines",
    description: "Policy deep-dives for the 20-tester & 14-day requirements. Essential for 2024 compliance.",
    color: "from-blue-600 to-indigo-600",
    textColor: "text-blue-400",
    glow: "rgba(37, 99, 235, 0.15)",
    href: "/support/google-play-guidelines",
    size: "md:col-span-2 md:row-span-2",
  },
  {
    id: "free-community-testing",
    icon: Globe,
    title: "Community Testing",
    description: "Master the Karma system to get testers worldwide for free.",
    color: "from-emerald-500 to-teal-600",
    textColor: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.15)",
    href: "/support/free-community-testing",
    size: "md:col-span-2 md:row-span-1",
  },
  {
    id: "paid-professional-testing",
    icon: Star,
    title: "Professional",
    description: "Vetted QA cycles with guaranteed results.",
    color: "from-amber-500 to-orange-600",
    textColor: "text-amber-400",
    glow: "rgba(245, 158, 11, 0.15)",
    href: "/support/paid-professional-testing",
    size: "md:col-span-1 md:row-span-1",
  },
  {
    id: "wallet-account",
    icon: Wallet,
    title: "Wallet",
    description: "Secure your points and manage transaction history.",
    color: "from-purple-500 to-pink-600",
    textColor: "text-purple-400",
    glow: "rgba(168, 85, 247, 0.15)",
    href: "/support/wallet-account",
    size: "md:col-span-1 md:row-span-1",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const popularArticles = getPopularArticles(4);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return searchArticles(searchQuery).slice(0, 5);
  }, [searchQuery]);

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Subtle Background Mesh */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <main className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-7xl relative z-10 w-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <HelpCircle className="w-3.5 h-3.5" />
              Technical Support
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.9]">
              How can we <br />
              <span className="text-zinc-600 italic">help you build?</span>
            </h1>
          </div>

          <div className="relative w-full max-w-md group">
            <div className="relative bg-zinc-900/40 border border-white/5 rounded-2xl p-1 backdrop-blur-3xl transition-all hover:border-white/10 group-focus-within:border-blue-500/50">
              <div className="flex items-center px-4">
                <Search className="w-5 h-5 text-zinc-500" />
                <Input
                  placeholder="Search articles..."
                  className="bg-transparent border-none focus-visible:ring-0 text-base h-12 shadow-none placeholder:text-zinc-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <AnimatePresence>
              {searchQuery.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-zinc-900/95 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4 py-3 border-b border-white/5">
                    Search Results ({searchResults.length})
                  </div>
                  <div className="p-2 space-y-1">
                    {searchResults.map((article) => (
                      <Link
                        key={article.id}
                        href={`/support/${article.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}/${article.slug}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group/item"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover/item:bg-blue-500/20 transition-colors">
                          <FileText className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-zinc-200 group-hover/item:text-white truncate text-sm">
                            {article.title}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                            {article.category}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover/item:text-white transition-all transform group-hover/item:translate-x-1" />
                      </Link>
                    ))}
                    {searchResults.length === 0 && (
                      <div className="p-8 text-center text-zinc-500 text-sm">
                        No matches found.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]"
        >
          {/* Main Categories */}
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={itemVariants}
              className={cn(
                "group relative rounded-[2.5rem] overflow-hidden border border-white/[0.03] bg-zinc-900/20 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/40 hover:border-white/10",
                cat.size
              )}
            >
              <Link href={cat.href} className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className="flex items-start justify-between">
                  <div className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110", cat.textColor)}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{cat.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-[90%]">
                    {cat.description}
                  </p>
                </div>
              </Link>
              {/* Subtle Gradient Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${cat.glow} 0%, transparent 70%)` }}
              />
            </motion.div>
          ))}

          {/* Trending Articles Card (Vertical) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-2 rounded-[2.5rem] border border-white/[0.03] bg-zinc-900/10 p-8 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-8 text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">
              <TrendingUp className="w-4 h-4" />
              Trending Resources
            </div>
            <div className="flex-1 space-y-8">
              {popularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/support/${article.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}/${article.slug}`}
                  className="group/article block space-y-2.5"
                >
                  <h4 className="font-bold text-zinc-300 group-hover/article:text-blue-400 transition-colors line-clamp-2 leading-snug text-sm">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span className="text-zinc-500">{article.views} PV</span>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="ghost" className="mt-8 w-full justify-between hover:bg-white/5 text-zinc-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest px-4">
              Browse All
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </motion.div>

          {/* Quick Stats Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 rounded-[2.5rem] border border-white/[0.03] bg-zinc-900/10 p-8 flex flex-col justify-center items-center text-center space-y-2"
          >
            <div className="text-5xl font-black text-white tracking-tighter">99.8%</div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Compliance Rate</div>
            <p className="text-[10px] text-zinc-700 italic">Across 5k+ Play Store reviews</p>
          </motion.div>

          {/* Service Availability */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 rounded-[2.5rem] border border-white/[0.03] bg-zinc-900/10 p-8 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Status
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Response Time</div>
              <div className="text-xl font-bold text-white tracking-tight">&lt; 18 Minutes</div>
            </div>
          </motion.div>

          {/* CTA / Contact Support Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-1 rounded-[2.5rem] border border-white/[0.03] bg-gradient-to-br from-blue-600/10 via-zinc-900/10 to-purple-600/10 p-10 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-3xl font-black tracking-tight leading-none">Questions?</h3>
              <p className="text-zinc-500 text-sm max-w-[320px] leading-relaxed">
                Connect with our QA engineering lead for specialized technical consultations.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Button className="bg-white text-black hover:bg-zinc-200 rounded-xl h-12 px-8 font-bold text-xs uppercase tracking-widest transition-transform active:scale-95 shadow-lg shadow-white/5">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Alex
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <SupportChatbot />

      {/* Structured Footer */}
      <footer className="w-full py-20 border-t border-white/[0.03] mt-20 relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">Secure Support</span>
        </div>
        <div className="flex gap-10 mb-10 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
          <Link href="#" className="hover:text-white transition-colors">API Reference</Link>
          <Link href="#" className="hover:text-white transition-colors">Platform Status</Link>
        </div>
        <p className="text-zinc-700 text-[10px] tracking-widest uppercase font-bold">
          © {new Date().getFullYear()} inTesters Engineering.
        </p>
      </footer>
    </div>
  );
}

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
  Command,
  ChevronRight,
  MousePointer2,
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
    description: "Deep dive into 20-tester & 14-day requirements. Stay compliant with current policies.",
    textColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    href: "/support/google-play-guidelines",
  },
  {
    id: "free-community-testing",
    icon: Globe,
    title: "Community Testing",
    description: "Master the Karma system. Build your tester pool through mutual cooperation.",
    textColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    href: "/support/free-community-testing",
  },
  {
    id: "paid-professional-testing",
    icon: Star,
    title: "Professional Testing",
    description: "Vetted QA cycles with guaranteed results for high-stakes releases.",
    textColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    href: "/support/paid-professional-testing",
  },
  {
    id: "wallet-account",
    icon: Wallet,
    title: "Wallet & Account",
    description: "Manage credits, transactions, and secure your developer credentials.",
    textColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    href: "/support/wallet-account",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const popularArticles = getPopularArticles(5);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return searchArticles(searchQuery).slice(0, 6);
  }, [searchQuery]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10 animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] dark:bg-blue-500/10" />
      </div>

      <main className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-24 max-w-7xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-24 md:space-y-32"
        >
          {/* Section 1: Hero & Search */}
          <motion.section variants={itemVariants} className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                <HelpCircle className="w-3.5 h-3.5" />
                Knowledge Base 2.0
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.85] text-foreground uppercase">
                How can we <br />
                <span className="text-muted-foreground opacity-50">Optimize</span> you?
              </h1>
            </div>

            {/* Central Search Terminal */}
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-full" />
              <div className="relative flex items-center bg-card/80 dark:bg-zinc-900/40 border-2 border-border group-focus-within:border-primary transition-all duration-300 rounded-[2rem] p-2 backdrop-blur-xl">
                <Search className="w-6 h-6 ml-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  className="bg-transparent border-none focus-visible:ring-0 text-lg h-14 placeholder:text-muted-foreground/50 font-medium"
                  placeholder="Ask a technical question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="mr-4 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/50 border border-border text-[10px] font-bold text-muted-foreground uppercase opacity-50">
                  <Command className="w-3 h-3" />
                  K
                </div>
              </div>

              {/* Live Search Dropdown */}
              <AnimatePresence>
                {searchQuery.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute top-full left-0 right-0 mt-4 bg-card border-2 border-border rounded-[2.5rem] shadow-2xl overflow-hidden z-50 backdrop-blur-2xl"
                  >
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Matches</span>
                      <span className="text-[10px] font-bold text-primary">{searchResults.length} Results</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {searchResults.map((article) => (
                        <Link
                          key={article.id}
                          href={`/support/${article.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}/${article.slug}`}
                          className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all group/item"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-bold text-sm text-foreground group-hover/item:text-primary transition-colors">{article.title}</h4>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{article.category}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:translate-x-1 group-hover/item:text-foreground transition-all" />
                        </Link>
                      ))}
                      {searchResults.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground space-y-2">
                          <HelpCircle className="w-12 h-12 mx-auto opacity-10" />
                          <p className="text-sm font-medium">No archived solutions found.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* Section 2: Core Tracks (Categories) */}
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-8 gap-4">
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Core Modules</h2>
                <p className="text-3xl font-black tracking-tight text-foreground uppercase">Selection Interface</p>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs font-medium">
                Choose a specialized track to access targeted technical documentation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link key={cat.id} href={cat.href} className="group">
                  <div className="h-full relative p-8 rounded-[2.5rem] bg-card border-2 border-border hover:border-primary transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
                    {/* Background Icon Decoration */}
                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
                      <cat.icon className="w-48 h-48" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", cat.bgColor, cat.textColor)}>
                        <cat.icon className="w-7 h-7" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-2xl font-black tracking-tight text-foreground uppercase group-hover:text-primary transition-colors leading-none">
                          {cat.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                          {cat.description}
                        </p>
                        <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          Initialize track
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Section 3: Intelligence & Ticker */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Live Intelligence */}
            <motion.section variants={itemVariants} className="lg:col-span-2 space-y-8">
              <div className="p-10 rounded-[3rem] bg-muted/20 border-2 border-border overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10">
                  <Zap className="w-12 h-12 text-primary opacity-20" />
                </div>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Live Intelligence</h3>
                    <p className="text-4xl font-black text-foreground uppercase tracking-tight leading-none">Global Performance</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <div className="text-4xl font-black text-primary leading-none tracking-tighter">99.8%</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Success Rate</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-black text-foreground leading-none tracking-tighter">18m</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg Response</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <div className="text-4xl font-black text-foreground leading-none tracking-tighter italic uppercase">Live</div>
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Systems Online</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Lead Card */}
              <div className="p-10 rounded-[3rem] bg-foreground text-background dark:bg-primary dark:text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8 transition-transform hover:scale-[1.01] duration-500">
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-3xl font-black uppercase leading-none tracking-tight">Technical Block?</h3>
                  <p className="max-w-[320px] font-bold opacity-80 leading-relaxed text-sm uppercase">
                    Direct access to our lead engineering team for critical infrastructure support.
                  </p>
                </div>
                <Button className="bg-background text-foreground dark:bg-white dark:text-black hover:scale-105 transition-transform rounded-2xl h-16 px-10 font-black uppercase tracking-widest text-xs">
                  Connect Now
                </Button>
              </div>
            </motion.section>

            {/* Trending Articles List */}
            <motion.section variants={itemVariants} className="space-y-8">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-foreground">Trending</h3>
              </div>
              <div className="space-y-4">
                {popularArticles.map((article, i) => (
                  <Link
                    key={article.id}
                    href={`/support/${article.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}/${article.slug}`}
                    className="flex items-start gap-4 p-4 rounded-3xl hover:bg-muted/50 transition-all group"
                  >
                    <span className="text-lg font-black text-muted-foreground/30 group-hover:text-primary transition-colors">0{i + 1}</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-sm leading-tight group-hover:text-foreground transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                        {article.views} PV
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Button variant="ghost" className="w-full h-14 rounded-3xl font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-muted py-0">
                View Archive
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.section>
          </div>
        </motion.div>
      </main>

      <SupportChatbot />

      {/* Modern High-End Footer */}
      <footer className="mt-32 border-t border-border bg-muted/10 backdrop-blur-3xl py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col items-center space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.5em] text-foreground">inTesters Support Hub</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Infrastructure</Link>
            <Link href="#" className="hover:text-primary transition-colors">API Docs</Link>
            <Link href="#" className="hover:text-primary transition-colors">Tester SOP</Link>
            <Link href="#" className="hover:text-primary transition-colors">Network Status</Link>
          </div>

          <div className="pt-12 flex flex-col items-center space-y-4 opacity-30">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase">Built for developers by developers.</p>
            <p className="text-[9px] font-bold tracking-widest uppercase italic">© {new Date().getFullYear()} inTesters Engineering Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

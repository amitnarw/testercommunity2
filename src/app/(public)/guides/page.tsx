"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  TrendingUp,
  ArrowRight,
  Shield,
  Star,
  Wallet,
  Globe,
  ChevronRight,
  Code,
  BarChart3,
} from "lucide-react";
import { getPopularArticles, searchArticles, articles } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TransitionLink } from "@/components/transition-link";

const categories = [
  {
    id: "google-play-guidelines",
    slug: "google-play-guidelines",
    icon: Shield,
    title: "Play Guidelines",
    description: "Deep dive into 12-tester & 14-day requirements.",
    textColor: "text-blue-500",
    bgColor: "blue-500/10",
  },
  {
    id: "free-community-testing",
    slug: "free-community-testing",
    icon: Globe,
    title: "Community Testing",
    description: "Master the Karma system and tester pool.",
    textColor: "text-green-500",
    bgColor: "green-500/10",
  },
  {
    id: "paid-professional-testing",
    slug: "paid-professional-testing",
    icon: Star,
    title: "Pro Testing",
    description: "Vetted QA cycles with guaranteed results.",
    textColor: "text-amber-500",
    bgColor: "amber-500/10",
  },
  {
    id: "wallet-account",
    slug: "wallet-account",
    icon: Wallet,
    title: "Wallet & Account",
    description: "Manage credits and secure credentials.",
    textColor: "text-violet-500",
    bgColor: "violet-500/10",
  },
  {
    id: "play-store-optimization",
    slug: "play-store-optimization",
    icon: BarChart3,
    title: "ASO & Marketing",
    description: "App Store Optimization strategies for growth.",
    textColor: "text-rose-500",
    bgColor: "rose-500/10",
  },
  {
    id: "developer-resources",
    slug: "developer-resources",
    icon: Code,
    title: "Developer Resources",
    description: "SEO and backlink strategies for developers.",
    textColor: "text-cyan-500",
    bgColor: "cyan-500/10",
  },
];

function getArticleCount(slug: string): number {
  const categoryMap: Record<string, string> = {
    "google-play-guidelines": "Google Play Guidelines",
    "free-community-testing": "Free Community Testing",
    "paid-professional-testing": "Paid Professional Testing",
    "wallet-account": "Wallet & Account",
    "play-store-optimization": "Play Store Optimization",
    "developer-resources": "Developer Resources",
  };
  return articles.filter((a) => a.category === categoryMap[slug]).length;
}

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const popularArticles = getPopularArticles(5);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return searchArticles(searchQuery).slice(0, 6);
  }, [searchQuery]);

  return (
    <div className="min-h-screen relative overflow-hidden text-foreground transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-6 py-10 relative z-10 max-w-7xl">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
            Guides & <span className="italic">Resources</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about app testing, Google Play requirements, and launching successfully.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 w-full bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden z-50"
              >
                {searchResults.map((article) => {
                  const categorySlug = article.category
                    .toLowerCase()
                    .replace(/ & /g, "-")
                    .replace(/ /g, "-");
                  return (
                    <TransitionLink
                      key={article.id}
                      href={`/guides/${categorySlug}/${article.slug}`}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {article.category}
                        </p>
                      </div>
                    </TransitionLink>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-8">
            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-6">
              {categories.map((cat) => (
                <TransitionLink
                  key={cat.id}
                  href={`/guides/${cat.slug}`}
                  className="group block h-full"
                >
                  <Card
                    className={cn(
                      "h-full border-border/50 bg-gradient-to-br to-secondary/0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-3xl flex flex-col p-4 py-2 sm:p-8 relative overflow-hidden",
                      `from-${cat.bgColor}`
                    )}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/10 transition-colors duration-500" />

                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 absolute sm:static -bottom-8 right-0 z-10 opacity-50 sm:opacity-100",
                        `bg-${cat.bgColor}`,
                        cat.textColor,
                      )}
                    >
                      <cat.icon className="w-7 h-7" />
                    </div>

                    <h3 className="text-lg sm:text-2xl font-bold tracking-tight leading-tight mb-3 group-hover:text-primary transition-colors relative z-10">
                      {cat.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4 flex-1 relative z-10 leading-relaxed">
                      {cat.description}
                    </p>

                    <span className="text-xs font-medium text-muted-foreground/70 relative z-10">
                      {getArticleCount(cat.slug)} articles
                    </span>

                    <div className="hidden sm:flex items-center text-sm font-semibold text-primary relative z-10 group-hover:translate-x-1 transition-transform w-[max-content] mt-4">
                      Browse
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </Card>
                </TransitionLink>
              ))}
            </div>
          </div>

          {/* Sidebar / Trending */}
          <Card className="border border-border/50 bg-secondary p-6 rounded-3xl h-[max-content]">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-primary">
                Popular Guides
              </h3>
            </div>
            <div className="space-y-2">
              {popularArticles.map((article, i) => {
                const categorySlug = article.category
                  .toLowerCase()
                  .replace(/ & /g, "-")
                  .replace(/ /g, "-");
                return (
                  <TransitionLink
                    key={article.id}
                    href={`/guides/${categorySlug}/${article.slug}`}
                    className="flex items-start gap-4 p-3 -mx-3 rounded-2xl hover:bg-muted/50 transition-all group"
                  >
                    <span className="text-xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors mt-0.5">
                      0{i + 1}
                    </span>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold text-sm leading-tight group-hover:text-foreground transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="text-xs text-muted-foreground font-medium">
                        {article.views} views
                      </div>
                    </div>
                  </TransitionLink>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
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
  Code,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/transition-link";
import type { PublicGuideCategory, PublicGuide } from "@/lib/apiCalls";

const iconMap: Record<string, any> = {
  Shield,
  Star,
  Wallet,
  Globe,
  Code,
  BarChart3,
  FileText,
};

function resolveIcon(iconName: string): any {
  return iconMap[iconName] || FileText;
}

interface GuidesPageContentProps {
  categories: PublicGuideCategory[];
  popularGuides: PublicGuide[];
  guidesByCategory: Record<number, number>;
}

export default function GuidesPageContent({
  categories,
  popularGuides,
  guidesByCategory,
}: GuidesPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PublicGuide[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const { searchPublicGuides } = await import("@/lib/apiCalls");
        if (cancelled) return;
        const results = await searchPublicGuides(searchQuery);
        if (cancelled) return;
        setSearchResults(results.slice(0, 6));
      } catch {
        if (cancelled) return;
        setSearchResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  return (
    <div className="min-h-screen relative overflow-hidden text-foreground transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-6 py-10 relative z-10 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
            Guides & <span className="italic">Resources</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about app testing, Google Play requirements, and launching successfully.
          </p>

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
                {searchResults.map((article) => (
                  <TransitionLink
                    key={article.id}
                    href={`/guides/${article.category.slug}/${article.slug}`}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {article.category.title}
                      </p>
                    </div>
                  </TransitionLink>
                ))}
              </motion.div>
            )}
            {searching && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="absolute top-full mt-2 w-full bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden z-50 p-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-2 sm:gap-6">
              {categories.map((cat) => {
                const Icon = resolveIcon(cat.iconName);
                const articleCount = guidesByCategory[cat.id] ?? 0;
                return (
                  <TransitionLink
                    key={cat.id}
                    href={`/guides/${cat.slug}`}
                    className="group block h-full"
                  >
                    <Card
                      className={cn(
                        "h-full border-border/50 bg-gradient-to-br to-secondary/0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-3xl flex flex-col p-4 py-2 sm:p-8 relative overflow-hidden",
                        `from-${cat.bgColorKey.replace("bg-", "")}`,
                      )}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/10 transition-colors duration-500" />

                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 absolute sm:static -bottom-8 right-0 z-10 opacity-50 sm:opacity-100",
                          cat.bgColorKey,
                          cat.colorKey,
                        )}
                      >
                        <Icon className="w-7 h-7" />
                      </div>

                      <h3 className="text-lg sm:text-2xl font-bold tracking-tight leading-tight mb-3 group-hover:text-primary transition-colors relative z-10">
                        {cat.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4 flex-1 relative z-10 leading-relaxed">
                        {cat.description}
                      </p>

                      <span className="text-xs font-medium text-muted-foreground/70 relative z-10">
                        {articleCount} articles
                      </span>

                      <div className="hidden sm:flex items-center text-sm font-semibold text-primary relative z-10 group-hover:translate-x-1 transition-transform w-[max-content] mt-4">
                        Browse
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </Card>
                  </TransitionLink>
                );
              })}
            </div>
          </div>

          <Card className="border border-border/50 bg-secondary p-6 rounded-3xl h-[max-content]">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-primary">
                Popular Guides
              </h3>
            </div>
            <div className="space-y-2">
              {popularGuides.map((article, i) => (
                <TransitionLink
                  key={article.id}
                  href={`/guides/${article.category.slug}/${article.slug}`}
                  className="flex items-start gap-4 p-3 -mx-3 rounded-2xl hover:bg-muted/50 transition-all group"
                >
                  <span className="text-xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors mt-0.5">
                    {String(i + 1).padStart(2, "0")}
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
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


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
  Command,
  ChevronRight,
  Bot,
} from "lucide-react";
import { getPopularArticles, searchArticles } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SupportChatbot } from "@/components/support-chatbot";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { TransitionLink } from "@/components/transition-link";

const categories = [
  {
    id: "google-play-guidelines",
    icon: Shield,
    title: "Play Guidelines",
    description: "Deep dive into 20-tester & 14-day requirements.",
    textColor: "text-blue-500",
    bgColor: "blue-500/10",
    href: "/support/google-play-guidelines",
  },
  {
    id: "free-community-testing",
    icon: Globe,
    title: "Community Testing",
    description: "Master the Karma system and tester pool.",
    textColor: "text-green-500",
    bgColor: "green-500/10",
    href: "/support/free-community-testing",
  },
  {
    id: "paid-professional-testing",
    icon: Star,
    title: "Pro Testing",
    description: "Vetted QA cycles with guaranteed results.",
    textColor: "text-amber-500",
    bgColor: "amber-500/10",
    href: "/support/paid-professional-testing",
  },
  {
    id: "wallet-account",
    icon: Wallet,
    title: "Wallet & Account",
    description: "Manage credits and secure credentials.",
    textColor: "text-violet-500",
    bgColor: "violet-500/10",
    href: "/support/wallet-account",
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const popularArticles = getPopularArticles(5);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return searchArticles(searchQuery).slice(0, 6);
  }, [searchQuery]);

  return (
    <>
      <div className="min-h-screen relative overflow-hidden text-foreground transition-colors duration-500">
        <div className="container mx-auto px-4 md:px-6 py-10 relative z-10 max-w-7xl">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Knowledge Base 2.0
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
              How can we <span className="italic">Optimize</span> you?
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Find technical documentation, connect with experts, or explore our
              knowledge base.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mt-10 group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-border/50 rounded-full p-1 px-2 transition-transform duration-300 group-hover:scale-[1.01] group-focus-within:scale-[1.01]">
                <Search className="ml-4 w-6 h-6 text-muted-foreground hidden sm:block" />
                <input
                  type="text"
                  placeholder="Ask a question or search keywords..."
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 text-md sm:text-lg placeholder:text-muted-foreground/50"
                />
                <Button
                  size="lg"
                  className="rounded-full px-4 sm:px-8 shadow-lg shadow-primary/25"
                >
                  <span className="hidden sm:block">Search</span>
                  <Search className="w-10 h-10 block sm:hidden" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2 space-y-8">
              {/* Specialized Tracks - Bento Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-6">
                {categories.map((cat) => (
                  <TransitionLink
                    key={cat.id}
                    href={cat.href}
                    className="group block h-full"
                  >
                    <Card
                      className={`h-full border-border/50 bg-gradient-to-br from-${cat.bgColor} to-secondary/0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-3xl flex flex-col p-4 py-2 sm:p-8 relative overflow-hidden`}
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

                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-8 flex-1 relative z-10 leading-relaxed">
                        {cat.description}
                      </p>

                      <div className="hidden sm:flex items-center text-sm font-semibold text-primary relative z-10 group-hover:translate-x-1 transition-transform w-[max-content]">
                        Open
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </Card>
                  </TransitionLink>
                ))}
              </div>
            </div>

            {/* Sidebar / Trending */}
            {/* Trending Articles */}
            <Card className="border border-border/50 bg-secondary p-6 rounded-3xl h-[max-content]">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-lg text-primary">
                  Trending Articles
                </h3>
              </div>
              <div className="space-y-2">
                {popularArticles.map((article, i) => (
                  <TransitionLink
                    key={article.id}
                    href={`/support/${article.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}/${article.slug}`}
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
                        {article.views} PV
                      </div>
                    </div>
                  </TransitionLink>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-3 rounded-xl font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                View Archive
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* AI Chat Card - Featured */}
            <div className="md:col-span-3 group">
              <Card className="h-full relative overflow-hidden border-border/50 bg-gradient-to-br from-secondary/50 to-primary/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 rounded-3xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-500" />

                <div className="relative p-6 sm:p-10 h-full flex flex-col justify-between z-10">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Bot className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                      Chat with Alex
                    </CardTitle>
                    <CardDescription className="text-lg max-w-md">
                      Our advanced AI assistant can help you with 90% of common
                      queries instantly. No waiting required.
                    </CardDescription>
                  </div>

                  <div className="mt-10">
                    <div
                      data-chatbot-trigger
                      className="inline-flex items-center gap-2 text-primary font-semibold cursor-pointer group/btn"
                    >
                      Start a Conversation
                      <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute right-0 bottom-0 opacity-5 sm:opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4 group-hover:translate-x-10 group-hover:translate-y-10 transition-transform duration-700">
                  <Bot className="w-80 h-80" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <SupportChatbot />
    </>
  );
}

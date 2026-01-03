"use client";

import { motion } from "framer-motion";
import {
  LifeBuoy,
  MessageCircle,
  BookOpen,
  Zap,
  Shield,
  Users,
  Mail,
  ChevronRight,
  Sparkles,
  TrendingUp,
  FileText,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SupportChatbot } from "@/components/support-chatbot";
import { getPopularArticles } from "@/lib/blog-data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const categories = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Learn the basics and set up your account",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-500",
    articles: 12,
    href: "/support/getting-started",
  },
  {
    icon: Shield,
    title: "Account & Security",
    description: "Manage your account settings and privacy",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    iconColor: "text-emerald-500",
    articles: 8,
    href: "/support/account-security",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with testers and manage projects",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-500",
    articles: 15,
    href: "/support/community-hub",
  },
  {
    icon: BookOpen,
    title: "Billing & Plans",
    description: "Pricing, payments, and subscriptions",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    iconColor: "text-orange-500",
    articles: 10,
    href: "/support/billing-plans",
  },
];

export default function SupportPage() {
  const popularArticles = getPopularArticles(4);
  return (
    <>
      <div className="min-h-screen w-full relative overflow-hidden">
        <main className="container mx-auto px-4 md:px-8 py-8 md:py-16 max-w-7xl relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12 md:space-y-16"
          >
            {/* Hero Section */}
            <motion.div
              variants={itemVariants}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  We're here to help
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent mb-6">
                Support Center
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Find answers, get help, and connect with our community. We're
                committed to your success.
              </p>
            </motion.div>

            {/* Categories Grid */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Browse by Category
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <Link href={category.href}>
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl -z-10 from-primary/20 to-primary/5" />
                      <div
                        className={`relative h-full p-6 rounded-3xl border ${category.borderColor} ${category.bgColor} backdrop-blur-sm hover:bg-opacity-80 transition-all duration-300 cursor-pointer group-hover:scale-105 group-hover:shadow-xl`}
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {category.articles} articles
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Popular Articles */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs font-medium text-orange-500">
                      Popular
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Trending Articles
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularArticles.map((article, index) => (
                  <motion.div
                    key={article.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/support/${article.category
                        .toLowerCase()
                        .replace(/ & /g, "-")
                        .replace(/ /g, "-")}/${article.slug}`}
                    >
                      <div className="group p-6 rounded-2xl bg-card/30 backdrop-blur-xl border border-border/50 hover:bg-card/50 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span className="px-2 py-1 rounded-md bg-secondary">
                                {article.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {article.readTime}
                              </span>
                              <span>{article.views} views</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div variants={itemVariants}>
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-blue-700 p-1 shadow-2xl shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20 animate-pulse" />
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.3rem] p-8 md:p-12">
                  {/* Decorative Elements */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />

                  <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6">
                      <LifeBuoy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Still need help?
                    </h3>
                    <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                      Can't find what you're looking for? Our support team is
                      ready to assist you with any questions or concerns.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button
                        data-chatbot-trigger
                        size="lg"
                        className="bg-white text-slate-900 hover:bg-white/90 rounded-xl px-8 h-12 font-semibold shadow-xl shadow-white/20 hover:shadow-2xl hover:shadow-white/30 transition-all hover:scale-105"
                      >
                        <MessageCircle className="mr-2 w-5 h-5" />
                        Chat with Alex
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl px-8 h-12 font-semibold backdrop-blur-md"
                      >
                        <Link href="mailto:support@inTesters.com">
                          <Mail className="mr-2 w-5 h-5" />
                          Email Support
                        </Link>
                      </Button>
                    </div>

                    {/* Support Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                          &lt;2h
                        </div>
                        <div className="text-sm text-white/60">
                          Avg Response
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                          98%
                        </div>
                        <div className="text-sm text-white/60">
                          Satisfaction
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                          24/7
                        </div>
                        <div className="text-sm text-white/60">
                          Availability
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
      <SupportChatbot />
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getArticlesByCategory } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";

const categoryMap: Record<
  string,
  { title: string; description: string; color: string; gradient: string }
> = {
  "getting-started": {
    title: "Getting Started",
    description: "Learn the basics and set up your account",
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
  },
  "account-security": {
    title: "Account & Security",
    description: "Manage your account settings and privacy",
    color: "text-emerald-500",
    gradient: "from-emerald-500 to-teal-500",
  },
  "community-hub": {
    title: "Community Hub",
    description: "Connect with testers and manage projects",
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
  },
  "billing-plans": {
    title: "Billing & Plans",
    description: "Pricing, payments, and subscriptions",
    color: "text-orange-500",
    gradient: "from-orange-500 to-red-500",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const categoryInfo = categoryMap[categorySlug];
  const articles = getArticlesByCategory(categoryInfo?.title || "");

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Link href="/support">
            <Button>Back to Support</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <Link href="/support">
              <Button variant="ghost" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Support Center
              </Button>
            </Link>
          </motion.div>

          {/* Category Header */}
          <motion.div variants={itemVariants} className="text-center">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryInfo.gradient} mb-6`}
            >
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {categoryInfo.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {categoryInfo.description}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {articles.length} articles
              </span>
            </div>
          </motion.div>

          {/* Articles Grid */}
          <motion.div variants={itemVariants} className="grid gap-6">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/support/${categorySlug}/${article.slug}`}>
                  <div className="group p-6 md:p-8 rounded-3xl bg-card/30 backdrop-blur-xl border border-border/50 hover:bg-card/50 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-xl">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FileText className="w-8 h-8 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {article.title}
                        </h2>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {article.description}
                        </p>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            <span>{article.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4" />
                            <span>{article.views} views</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Read More Arrow */}
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {articles.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16 bg-card/30 backdrop-blur-xl rounded-3xl border border-border/50"
            >
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Articles Yet</h3>
              <p className="text-muted-foreground mb-6">
                We're working on adding content to this category.
              </p>
              <Link href="/support">
                <Button>Browse Other Categories</Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

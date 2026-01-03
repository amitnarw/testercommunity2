"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  Calendar,
  User,
  Share2,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

const categorySlugMap: Record<string, string> = {
  "getting-started": "Getting Started",
  "account-security": "Account & Security",
  "community-hub": "Community Hub",
  "billing-plans": "Billing & Plans",
};

export default function ArticlePage() {
  const params = useParams();
  const articleSlug = params.article as string;
  const categorySlug = params.category as string;
  const article = getArticleBySlug(articleSlug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link href="/support">
            <Button>Back to Support</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = getArticlesByCategory(article.category)
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/support"
              className="hover:text-foreground transition-colors"
            >
              Support
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/support/${categorySlug}`}
              className="hover:text-foreground transition-colors"
            >
              {categorySlugMap[categorySlug]}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{article.title}</span>
          </div>

          {/* Back Button */}
          <Link href={`/support/${categorySlug}`}>
            <Button variant="ghost" className="group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to {categorySlugMap[categorySlug]}
            </Button>
          </Link>

          {/* Article Header */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground">
              {article.description}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {article.author.name}
                  </div>
                  <div className="text-xs">{article.author.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>{article.views} views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="p-8 md:p-10 rounded-3xl bg-card/30 backdrop-blur-xl border border-border/50">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed text-muted-foreground">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-muted-foreground">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  code: ({ children }) => (
                    <code className="px-1.5 py-0.5 rounded bg-secondary text-sm font-mono">
                      {children}
                    </code>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full border-collapse">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border/50 px-4 py-2 bg-secondary font-semibold text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-border/50 px-4 py-2">
                      {children}
                    </td>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t border-border/50">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid gap-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/support/${categorySlug}/${related.slug}`}
                  >
                    <div className="group p-6 rounded-2xl bg-card/30 backdrop-blur-xl border border-border/50 hover:bg-card/50 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {related.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {related.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {related.views} views
                            </span>
                          </div>
                        </div>
                        <ArrowLeft className="w-5 h-5 rotate-180 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">
                Was this article helpful?
              </h3>
              <p className="text-muted-foreground mb-6">
                Let us know if you need more information or have questions.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button>Yes, it helped!</Button>
                <Button variant="outline">Contact Support</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

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
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BackButton } from "@/components/back-button";

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
          <h1 className="text-2xl font-bold tracking-tight">
            Article Not Found
          </h1>
          <Link href="/support">
            <Button variant="outline" className="rounded-full px-8">
              Return to Support
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
    <div className="min-h-screen relative overflow-hidden text-foreground transition-colors duration-500">
      <main className="container mx-auto px-4 md:px-6 py-10 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-12"
        >
          {/* Header Navigation Interface */}
          <div className="space-y-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/support">Support Hub</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/support/${categorySlug}`}>
                      {categorySlugMap[categorySlug]}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[150px] md:max-w-none truncate text-foreground">
                    {article.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between items-center">
              <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8 w-1/2">
                <BackButton href={`/support/${categorySlug}`} />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Article Identity Section */}
          <div className="space-y-8 pb-12 border-b border-border/50">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary">
                {article.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80 pb-2">
                {article.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                {article.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Article</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Updated on{" "}
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Structured Content Interface */}
          <div className="relative">
            <article
              className="prose prose-zinc dark:prose-invert max-w-none 
              prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-foreground
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-muted-foreground prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-foreground prose-strong:font-semibold
              prose-li:text-muted-foreground prose-li:text-lg
              prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
              prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-muted/30 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-foreground prose-blockquote:italic
              prose-img:rounded-2xl
              prose-hr:border-border/50 prose-hr:my-12
            "
            >
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </article>
          </div>

          {/* Related Modules */}
          {relatedArticles.length > 0 && (
            <div className="pt-16 space-y-8 border-t border-border/50">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((ra) => (
                  <Link
                    key={ra.id}
                    href={`/support/${categorySlug}/${ra.slug}`}
                    className="group p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="h-full flex flex-col justify-between space-y-4">
                      <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {ra.title}
                      </h4>
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs font-medium text-muted-foreground">
                          {ra.readTime}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* System Feedback Terminal */}
          <div className="pt-16 pb-12">
            <div className="p-8 md:p-12 rounded-3xl bg-card border border-border/50 flex flex-col items-center text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Zap className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  Was this article helpful?
                </h3>
                <p className="text-muted-foreground">
                  Your feedback helps us improve our knowledge base.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  className="rounded-full px-8 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/50 transition-colors"
                >
                  Yes
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-8 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/50 transition-colors"
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

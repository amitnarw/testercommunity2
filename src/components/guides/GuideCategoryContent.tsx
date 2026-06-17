"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  Zap,
  Shield,
  Star,
  Wallet,
  Globe,
  Code,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

interface GuideCategoryContentProps {
  categorySlug: string;
  category: PublicGuideCategory | null;
  guides: PublicGuide[];
}

export default function GuideCategoryContent({
  categorySlug,
  category,
  guides,
}: GuideCategoryContentProps) {
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Category Not Found
          </h1>
          <Link href="/guides">
            <Button variant="outline" className="rounded-full px-8">
              Return to Guides
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = resolveIcon(category.iconName);

  return (
    <div className="min-h-screen relative overflow-hidden text-foreground transition-colors duration-500">
      <main className="container mx-auto px-4 md:px-6 py-10 relative z-10 max-w-5xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="space-y-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/guides">Guides</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground">
                    {category.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <BackButton href="/guides" />

            <div className="flex flex-col gap-6 items-start pb-10 border-b border-border/50">
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-2",
                  category.bgColorKey,
                  category.colorKey,
                )}
              >
                <Icon className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {category.title}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
                  {category.title}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                  {category.description}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                {guides.length} Resources Available
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 gap-6"
          >
            {guides.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/guides/${categorySlug}/${article.slug}`}
                  className="block group"
                >
                  <div className="p-6 md:p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/10 transition-colors duration-500" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                            {article.title}
                          </h2>
                          <p className="text-muted-foreground text-base line-clamp-2 leading-relaxed">
                            {article.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>{article.views} Views</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary transition-colors">
                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {guides.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-24 rounded-3xl bg-muted/20 border border-dashed border-border/50"
            >
              <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                No Guides Found
              </h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                We&apos;re currently updating our resources for this category.
                Please check back later.
              </p>
              <Link href="/guides">
                <Button variant="outline" className="rounded-full px-8">
                  Return to Guides
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  Shield,
  Star,
  Wallet,
  Globe,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getArticlesByCategory } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categoryMap: Record<
  string,
  { title: string; description: string; color: string; icon: any; glow: string }
> = {
  "google-play-guidelines": {
    title: "Google Play Guidelines",
    description: "Navigate the technical requirements with precision and ensure your personal account stays compliant.",
    color: "text-blue-600 dark:text-blue-400",
    icon: Shield,
    glow: "bg-blue-500/5",
  },
  "free-community-testing": {
    title: "Free Community Testing",
    description: "Earn credits by helping fellow developers and build your 20-tester pool through mutual cooperation.",
    color: "text-emerald-600 dark:text-emerald-400",
    icon: Globe,
    glow: "bg-emerald-500/5",
  },
  "paid-professional-testing": {
    title: "Paid Professional Testing",
    description: "Deploy guaranteed QA cycles with professional testers to meet Google's 14-day requirement quickly.",
    color: "text-amber-600 dark:text-amber-400",
    icon: Star,
    glow: "bg-amber-500/5",
  },
  "wallet-account": {
    title: "Wallet & Account",
    description: "Manage your karma points, professional slots, and account security settings in one dashboard.",
    color: "text-purple-600 dark:text-purple-400",
    icon: Wallet,
    glow: "bg-purple-500/5",
  },
};

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

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const categoryInfo = categoryMap[categorySlug];
  const articles = getArticlesByCategory(categoryInfo?.title || "");

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-black uppercase tracking-tighter">System Error: Track Offline</h1>
          <Link href="/support">
            <Button variant="outline" className="border-2 border-border hover:border-primary rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs">
              Return to Center
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30 overflow-x-hidden transition-colors duration-500">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--muted)/0.5)_0%,hsl(var(--background))_100%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(17,24,39,1)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />

      <main className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-5xl relative z-10 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-20"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="space-y-12">
            <Link href="/support">
              <Button variant="ghost" className="group text-muted-foreground hover:text-primary hover:bg-muted dark:hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] px-0 hover:px-6 transition-all h-10">
                <ArrowLeft className="w-3.5 h-3.5 mr-3 group-hover:-translate-x-1 transition-transform" />
                Return to Modules
              </Button>
            </Link>

            <div className="flex flex-col gap-8 items-start pb-16 border-b-2 border-border">
              <div className={cn("w-20 h-20 rounded-[2rem] bg-card flex items-center justify-center border-2 border-border shadow-2xl relative overflow-hidden group/icon", categoryInfo.color)}>
                <div className={cn("absolute inset-0 opacity-20", categoryInfo.glow)} />
                <categoryInfo.icon className="w-10 h-10 relative z-10 group-hover/icon:scale-110 transition-transform" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Technical Track</span>
                  <div className="h-[1px] w-12 bg-primary/30" />
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.85] text-foreground uppercase">
                  {categoryInfo.title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                  {categoryInfo.description}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 border border-border text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <Zap className="w-3 h-3 text-primary" />
                {articles.length} Indexed Resources
              </div>
            </div>
          </motion.div>

          {/* Articles Interface */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/support/${categorySlug}/${article.slug}`} className="block group">
                  <div className="p-10 rounded-[3rem] bg-card border-2 border-border hover:border-primary transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1">
                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start md:items-center">
                      <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-none">
                            {article.title}
                          </h2>
                          <p className="text-muted-foreground text-base line-clamp-2 leading-relaxed max-w-3xl font-medium">
                            {article.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 opacity-50" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 opacity-50" />
                            <span>{article.views} PV</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 opacity-50" />
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-16 h-16 rounded-3xl bg-muted dark:bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all transform group-hover:translate-x-2">
                        <ChevronRight className="w-7 h-7 text-muted-foreground group-hover:text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State Terminal */}
          {articles.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-32 rounded-[4rem] bg-muted/10 border-2 border-dashed border-border"
            >
              <FileText className="w-20 h-20 text-muted-foreground/20 mx-auto mb-8" />
              <h3 className="text-2xl font-black uppercase tracking-widest text-muted-foreground">Log: 0 Resources found</h3>
              <p className="text-muted-foreground mb-12 max-w-sm mx-auto text-sm font-medium uppercase tracking-tight">
                Our documentation engine is currently re-indexing this track. System refresh expected in 24h.
              </p>
              <Link href="/support">
                <Button variant="outline" className="border-2 border-border hover:border-primary rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs">
                  Reload Modules
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

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
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getArticlesByCategory } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categoryMap: Record<
  string,
  { title: string; description: string; color: string; icon: any }
> = {
  "google-play-guidelines": {
    title: "Google Play Guidelines",
    description: "Navigate the technical requirements with precision and ensure your personal account stays compliant.",
    color: "text-blue-500",
    icon: Shield,
  },
  "free-community-testing": {
    title: "Free Community Testing",
    description: "Earn credits by helping fellow developers and build your 20-tester pool through mutual cooperation.",
    color: "text-emerald-500",
    icon: Globe,
  },
  "paid-professional-testing": {
    title: "Paid Professional Testing",
    description: "Deploy guaranteed QA cycles with professional testers to meet Google's 14-day requirement quickly.",
    color: "text-amber-500",
    icon: Star,
  },
  "wallet-account": {
    title: "Wallet & Account",
    description: "Manage your karma points, professional slots, and account security settings in one dashboard.",
    color: "text-purple-500",
    icon: Wallet,
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1],
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
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Category Not Found</h1>
          <Link href="/support">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl h-12 px-8 font-bold uppercase tracking-widest text-[10px]">
              Back to Support
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />

      <main className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-5xl relative z-10 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-8">
            <Link href="/support">
              <Button variant="ghost" className="group text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest px-0 hover:px-4 transition-all">
                <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Center
              </Button>
            </Link>

            <div className="flex flex-col gap-6 items-start pb-12 border-b border-white/[0.03]">
              <div className={cn("w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/5 shadow-2xl", categoryInfo.color)}>
                <categoryInfo.icon className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">
                  {categoryInfo.title}
                </h1>
                <p className="text-lg text-zinc-500 max-w-2xl font-medium">
                  {categoryInfo.description}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                <FileText className="w-3 h-3" />
                {articles.length} Technical Resources
              </div>
            </div>
          </motion.div>

          {/* Articles List */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/support/${categorySlug}/${article.slug}`} className="block group">
                  <div className="p-8 rounded-[2rem] bg-zinc-900/10 border border-white/[0.03] hover:bg-zinc-900/30 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors tracking-tight">
                            {article.title}
                          </h2>
                          <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed max-w-3xl">
                            {article.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{article.views} PV</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                        <ChevronRight className="w-5 h-5" />
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
              className="text-center py-24 rounded-[3rem] bg-zinc-900/10 border border-white/5"
            >
              <FileText className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-2 uppercase tracking-widest text-zinc-500">Resource Offline</h3>
              <p className="text-zinc-600 mb-10 max-w-sm mx-auto text-sm">
                We are currently indexing new technical documentation for this track. Check back in 24 hours.
              </p>
              <Link href="/support">
                <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl h-12 px-8 font-bold uppercase tracking-widest text-[10px]">
                  Browse Other Tracks
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Search,
  MessageSquare,
  Sparkles,
  AtSign,
  MessageCircle,
  Users,
  Newspaper,
  Linkedin,
  Facebook,
  MoreHorizontal,
  TrendingUp,
  Compass,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type DiscoverySourceItem = { source: string; count: number };

interface DiscoverySourceCardProps {
  data?: DiscoverySourceItem[];
  isLoading?: boolean;
}

// Brand mapping function for discovery sources
const getSourceMeta = (sourceName: string) => {
  const normalized = sourceName.toLowerCase().trim().replace(/ /g, "_");

  if (normalized.includes("youtube")) {
    return {
      label: "YouTube",
      icon: Play,
      color: "#ef4444",
      gradient: "from-red-500 to-rose-600",
      bgColor: "bg-red-500/10 dark:bg-red-500/20",
      textColor: "text-red-600 dark:text-red-400",
      insight: "Video referral traffic. Strong channel engagement and user acquisition.",
    };
  }
  if (normalized.includes("google")) {
    return {
      label: "Google Search",
      icon: Search,
      color: "#3b82f6",
      gradient: "from-blue-500 to-sky-600",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
      textColor: "text-blue-600 dark:text-blue-400",
      insight: "Organic search queries. Driving stable, high-intent discovery metrics.",
    };
  }
  if (normalized.includes("chatgpt")) {
    return {
      label: "ChatGPT",
      icon: MessageSquare,
      color: "#10b981",
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
      insight: "Conversational search referrals. Directing active developer queries.",
    };
  }
  if (normalized.includes("gemini")) {
    return {
      label: "Gemini",
      icon: Sparkles,
      color: "#8b5cf6",
      gradient: "from-violet-500 to-fuchsia-600",
      bgColor: "bg-violet-500/10 dark:bg-violet-500/20",
      textColor: "text-violet-600 dark:text-violet-400",
      insight: "Automated engine referrals. Growing share of direct traffic.",
    };
  }
  if (normalized.includes("twitter") || normalized.includes("x")) {
    return {
      label: "Twitter / X",
      icon: AtSign,
      color: "#0ea5e9",
      gradient: "from-sky-400 to-blue-500",
      bgColor: "bg-sky-500/10 dark:bg-sky-500/20",
      textColor: "text-sky-600 dark:text-sky-400",
      insight: "Social media activity. Active community engagement and sharing.",
    };
  }
  if (normalized.includes("reddit")) {
    return {
      label: "Reddit",
      icon: MessageCircle,
      color: "#f97316",
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
      textColor: "text-orange-600 dark:text-orange-400",
      insight: "Community-driven links. High target audience resonance.",
    };
  }
  if (normalized.includes("friend") || normalized.includes("colleague")) {
    return {
      label: "Friend or Colleague",
      icon: Users,
      color: "#6366f1",
      gradient: "from-indigo-500 to-violet-600",
      bgColor: "bg-indigo-500/10 dark:bg-indigo-500/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
      insight: "Direct peer referrals. Indicator of strong product satisfaction.",
    };
  }
  if (normalized.includes("blog") || normalized.includes("article")) {
    return {
      label: "Blog or Article",
      icon: Newspaper,
      color: "#d97706",
      gradient: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
      textColor: "text-amber-600 dark:text-amber-400",
      insight: "Content-driven referrals. High conversions from external media.",
    };
  }
  if (normalized.includes("linkedin")) {
    return {
      label: "LinkedIn",
      icon: Linkedin,
      color: "#0a66c2",
      gradient: "from-blue-600 to-indigo-700",
      bgColor: "bg-blue-600/10 dark:bg-blue-600/20",
      textColor: "text-blue-600 dark:text-blue-400",
      insight: "Professional network reach. Relevant conversions from industry posts.",
    };
  }
  if (normalized.includes("facebook") || normalized.includes("instagram")) {
    return {
      label: "Facebook / Instagram",
      icon: Facebook,
      color: "#db2777",
      gradient: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-500/10 dark:bg-pink-500/20",
      textColor: "text-pink-600 dark:text-pink-400",
      insight: "Social channel reach. Ad campaigns and page sharing referrals.",
    };
  }

  return {
    label: sourceName,
    icon: MoreHorizontal,
    color: "#6b7280",
    gradient: "from-slate-400 to-slate-600",
    bgColor: "bg-slate-500/10 dark:bg-slate-500/20",
    textColor: "text-slate-600 dark:text-slate-400",
    insight: "Other onboarding channels. Custom search or unspecified traffic sources.",
  };
};

export function DiscoverySourceCard({ data = [], isLoading }: DiscoverySourceCardProps) {
  const [sortBy, setSortBy] = useState<"count" | "alphabetical">("count");
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);

  // Compute stats
  const { totalResponses, processedData, topSource } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    // Process items with percentage and metadata
    const items = data.map((item) => {
      const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
      const meta = getSourceMeta(item.source);
      return {
        ...item,
        percentage: pct,
        meta,
      };
    });

    // Sort items
    if (sortBy === "count") {
      items.sort((a, b) => b.count - a.count);
    } else {
      items.sort((a, b) => a.meta.label.localeCompare(b.meta.label));
    }

    // Identify top source
    const top = data.length > 0
      ? [...items].sort((a, b) => b.count - a.count)[0]
      : null;

    return {
      totalResponses: total,
      processedData: items,
      topSource: top,
    };
  }, [data, sortBy]);

  if (isLoading) {
    return (
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl rounded-[2.5rem] p-6 h-[480px] flex flex-col justify-between">
        <div className="space-y-3">
          <Skeleton className="h-6 w-48 bg-muted" />
          <Skeleton className="h-4 w-64 bg-muted" />
        </div>
        <div className="flex gap-6 h-[300px] items-end">
          <Skeleton className="h-full w-12 bg-muted rounded-xl" />
          <Skeleton className="h-4/5 w-12 bg-muted rounded-xl" />
          <Skeleton className="h-3/5 w-12 bg-muted rounded-xl" />
          <Skeleton className="h-2/5 w-12 bg-muted rounded-xl" />
          <Skeleton className="h-1/5 w-12 bg-muted rounded-xl animate-pulse" />
        </div>
      </Card>
    );
  }

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className={cn("p-2 rounded-xl shrink-0", d.meta.bgColor)}>
            <d.meta.icon className={cn("w-4.5 h-4.5", d.meta.textColor)} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground leading-tight">{d.meta.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-black text-foreground">{d.count} responses</span>
              <span className="text-[10px] text-muted-foreground/60">•</span>
              <span className="text-xs text-primary font-bold">{d.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white/80 dark:bg-[#0c0c0e]/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl shadow-black/5 dark:shadow-black/40 rounded-[2.5rem] overflow-hidden transition-all duration-300">
      <CardHeader className="p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Compass className="w-5 h-5 text-primary animate-spin-slow" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight">
                How Users Discover Us
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground/80 mt-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Acquisition metrics from user onboarding surveys
            </CardDescription>
          </div>

          {/* Controls Panel */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Sort Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortBy("count")}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-bold transition-all",
                  sortBy === "count"
                    ? "bg-white dark:bg-[#1a1a1c] text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                )}
              >
                Top Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortBy("alphabetical")}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-bold transition-all",
                  sortBy === "alphabetical"
                    ? "bg-white dark:bg-[#1a1a1c] text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                )}
              >
                A-Z
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        {processedData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Visualizer Block */}
            <div className="lg:col-span-8 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-5 min-h-[350px] flex flex-col justify-between relative overflow-hidden">
              <div className="w-full h-full min-h-[300px] flex-1 flex flex-col justify-end">
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={processedData}
                      margin={{ top: 25, right: 10, left: -20, bottom: 0 }}
                      onMouseMove={(state) => {
                        if (state.activeLabel) {
                          setHoveredSource(state.activeLabel as string);
                        }
                      }}
                      onMouseLeave={() => setHoveredSource(null)}
                    >
                      <defs>
                        {processedData.map((d, i) => (
                          <linearGradient
                            key={`grad-${d.source}`}
                            id={`barGrad-${i}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor={d.meta.color} stopOpacity={1} />
                            <stop offset="100%" stopColor={d.meta.color} stopOpacity={0.4} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="4 6"
                        stroke="currentColor"
                        className="text-slate-200/50 dark:text-slate-800/40"
                      />
                      <XAxis
                        dataKey="source"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        fontSize={10}
                        fontWeight={600}
                        stroke="currentColor"
                        className="text-muted-foreground"
                        tickFormatter={(v) => getSourceMeta(v).label}
                      />
                      <YAxis
                        hide
                        type="number"
                        domain={[0, "dataMax + 2"]}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                          fill: "currentColor",
                          opacity: 0.04,
                        }}
                      />
                      <Bar
                        dataKey="count"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      >
                        {processedData.map((d, i) => {
                          const isHovered = hoveredSource === d.source;
                          return (
                            <Cell
                              key={`cell-${d.source}`}
                              fill={`url(#barGrad-${i})`}
                              style={{
                                filter: isHovered
                                  ? `drop-shadow(0 4px 10px ${d.meta.color}50)`
                                  : "none",
                                opacity: hoveredSource && !isHovered ? 0.6 : 1,
                                transition: "all 0.3s ease",
                              }}
                            />
                          );
                        })}
                        <LabelList
                          dataKey="count"
                          position="top"
                          fontSize={11}
                          fontWeight={800}
                          className="fill-foreground font-sans"
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sidebar Insights Block */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-5">
              {/* Overall Total Responses Card */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/[0.02] border border-primary/10 dark:border-primary/20 p-5 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-primary/10 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-700" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] tracking-widest font-black uppercase text-primary/80">
                      PARTICIPATION RATE
                    </p>
                    <h3 className="text-4xl font-black text-foreground tracking-tight mt-1.5 tabular-nums">
                      {totalResponses}
                    </h3>
                    <p className="text-[10.5px] text-muted-foreground/90 mt-1">
                      Total onboard survey responses
                    </p>
                  </div>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>

              {/* Top Source Highlight Spotlight */}
              {topSource && (
                <div className="flex-1 border border-slate-200/50 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/10 rounded-3xl p-5 flex flex-col justify-between shadow-inner relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 dark:bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase">
                        Primary Source Spotlight
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={cn("p-3 rounded-2xl shadow-lg border border-white/10 shrink-0", topSource.meta.bgColor)}>
                        {React.createElement(topSource.meta.icon, {
                          className: cn("w-6 h-6", topSource.meta.textColor),
                        })}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          {topSource.meta.label}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Leading discovery channel
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-black text-foreground tracking-tighter tabular-nums">
                          {topSource.percentage}%
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          of total audience
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800/60">
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {topSource.meta.insight}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Compass className="w-16 h-16 text-muted-foreground/25 mb-4 animate-pulse" />
            <h4 className="text-sm font-bold text-foreground">No discovery responses yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
              Acquisition metrics will become active as users submit onboarding survey feedback.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

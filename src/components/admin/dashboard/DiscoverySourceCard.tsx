"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type DiscoverySourceItem = {
  source: string;
  count: number;
  isOther?: boolean;
  breakdown?: { source: string; count: number }[];
};

interface DiscoverySourceCardProps {
  data?: DiscoverySourceItem[];
  isLoading?: boolean;
}

const SOURCE_COLORS: Record<string, string> = {
  YouTube: "#ef4444",
  "Google Search": "#3b82f6",
  ChatGPT: "#10b981",
  Gemini: "#8b5cf6",
  "Twitter / X": "#0ea5e9",
  Reddit: "#f97316",
  "Friend or Colleague": "#6366f1",
  "Blog or Article": "#d97706",
  LinkedIn: "#0a66c2",
  "Facebook / Instagram": "#db2777",
};

const OTHER_SHADES = [
  "#64748b",
  "#78716c",
  "#71717a",
  "#a1a1aa",
  "#94a3b8",
  "#a8a29e",
  "#d6d3d1",
  "#6b7280",
];

function getSourceColor(source: string): string {
  return SOURCE_COLORS[source] || "#6b7280";
}

const CustomBarShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload || height <= 0) return null;

  if (payload.isOther && payload.breakdown && payload.breakdown.length > 0) {
    const sorted = [...payload.breakdown].sort(
      (a: any, b: any) => b.count - a.count,
    );
    const total = sorted.reduce(
      (sum: number, b: any) => sum + b.count,
      0,
    );
    let cumY = y;

    return (
      <g>
        {sorted.map((seg: any, i: number) => {
          const segH = (seg.count / total) * height;
          const cy = cumY;
          cumY += segH;
          return (
            <rect
              key={i}
              x={x}
              y={cy}
              width={width}
              height={Math.max(segH, 2)}
              fill={OTHER_SHADES[i % OTHER_SHADES.length]}
              rx={i === 0 ? 4 : 0}
              ry={i === 0 ? 4 : 0}
            />
          );
        })}
        {height >= 18 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={10}
            fontWeight={700}
          >
            {total}
          </text>
        )}
      </g>
    );
  }

  const color = getSourceColor(payload.source);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        rx={4}
        ry={4}
      />
      {height >= 18 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={10}
          fontWeight={700}
        >
          {payload.count}
        </text>
      )}
    </g>
  );
};

export function DiscoverySourceCard({
  data = [],
  isLoading,
}: DiscoverySourceCardProps) {
  const [sortBy, setSortBy] = useState<"count" | "alphabetical">("count");

  const { totalResponses, processedData, topSource } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    const items = data.map((item) => {
      const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
      return { ...item, percentage: pct };
    });

    if (sortBy === "count") {
      items.sort((a, b) => b.count - a.count);
    } else {
      items.sort((a, b) => a.source.localeCompare(b.source));
    }

    const top =
      data.length > 0
        ? [...items].sort((a, b) => b.count - a.count)[0]
        : null;

    return { totalResponses: total, processedData: items, topSource: top };
  }, [data, sortBy]);

  if (isLoading) {
    return (
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
        <CardHeader className="p-6 pb-2">
          <Skeleton className="h-5 w-48 bg-muted" />
          <Skeleton className="h-4 w-64 bg-muted mt-2" />
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="flex gap-4 h-[280px] items-end">
            <Skeleton className="h-full w-10 rounded-t-lg bg-muted" />
            <Skeleton className="h-4/5 w-10 rounded-t-lg bg-muted" />
            <Skeleton className="h-3/5 w-10 rounded-t-lg bg-muted" />
            <Skeleton className="h-2/5 w-10 rounded-t-lg bg-muted" />
            <Skeleton className="h-1/5 w-10 rounded-t-lg bg-muted animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload as any;
    if (!d) return null;

    if (d.isOther && d.breakdown) {
      const sorted = [...d.breakdown].sort(
        (a: any, b: any) => b.count - a.count,
      );
      return (
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-xl shadow-2xl max-w-[220px]">
          <p className="text-xs font-bold text-foreground mb-2">
            Other ({d.count})
          </p>
          <div className="space-y-1">
            {sorted.map((seg: any, i: number) => (
              <div key={seg.source} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      OTHER_SHADES[i % OTHER_SHADES.length],
                  }}
                />
                <span className="text-[11px] text-muted-foreground truncate flex-1">
                  {seg.source}
                </span>
                <span className="text-[11px] font-bold text-foreground">
                  {seg.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const item = processedData.find((p) => p.source === d.source);
    if (!item) return null;
    const color = getSourceColor(d.source);
    return (
      <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-xl shadow-2xl">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <p className="text-xs font-bold text-foreground">{d.source}</p>
        </div>
        <div className="flex items-center gap-2 ml-[18px]">
          <span className="text-sm font-black text-foreground">
            {d.count}
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            responses
          </span>
          <span className="text-[10px] text-muted-foreground/60">|</span>
          <span className="text-xs text-primary font-bold">
            {item.percentage}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
      <CardHeader className="p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold tracking-tight">
              How Users Discover Us
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Onboarding survey responses
              {topSource && (
                <>
                  {" "}&middot; Top:{" "}
                  <span className="font-semibold text-foreground">
                    {topSource.source}
                  </span>{" "}
                  ({topSource.percentage}%)
                </>
              )}
              {" "}&middot; Total:{" "}
              <span className="font-semibold text-foreground">
                {totalResponses}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-900/80 p-1 rounded-lg border border-slate-200/40 dark:border-slate-800/40 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy("count")}
              className={cn(
                "h-7 px-2.5 rounded-md text-[11px] font-semibold transition-all",
                sortBy === "count"
                  ? "bg-white dark:bg-[#1a1a1c] text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Top
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy("alphabetical")}
              className={cn(
                "h-7 px-2.5 rounded-md text-[11px] font-semibold transition-all",
                sortBy === "alphabetical"
                  ? "bg-white dark:bg-[#1a1a1c] text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              A-Z
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        {processedData.length > 0 ? (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedData}
                margin={{ top: 20, right: 5, left: 0, bottom: 60 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 6"
                  className="stroke-slate-200/50 dark:stroke-slate-800/40"
                />
                <XAxis
                  dataKey="source"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={10}
                  fontWeight={600}
                  className="fill-muted-foreground"
                  tick={({ x, y, payload }) => (
                    <text
                      x={x}
                      y={y + 8}
                      textAnchor="end"
                      dominantBaseline="auto"
                      transform={`rotate(-45, ${x}, ${y + 8})`}
                      className="fill-muted-foreground"
                      fontSize={10}
                      fontWeight={600}
                    >
                      {payload.value}
                    </text>
                  )}
                />
                <YAxis hide type="number" domain={[0, "dataMax + 5"]} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "currentColor", opacity: 0.04 }}
                />
                <Bar
                  dataKey="count"
                  shape={<CustomBarShape />}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-bold text-foreground">
              No discovery responses yet
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
              Acquisition metrics will appear as users submit onboarding survey
              feedback.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

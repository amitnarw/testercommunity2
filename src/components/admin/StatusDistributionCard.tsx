"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusDistributionCardProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  isLoading?: boolean;
}

const BRAND_COLORS = {
  PURPLE: "#9d7bff",
  LIME: "#dcff50",
  SKY: "#4bc9ff",
  GRAY: "#3c3c3c",
};

export function StatusDistributionCard({
  data,
  isLoading,
}: StatusDistributionCardProps) {
  const [activeTab, setActiveTab] = React.useState("Week");

  if (isLoading) {
    return (
      <Card className="bg-[#1c1c1c] border-none shadow-2xl rounded-[1.5rem] p-6 h-[400px] flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 bg-white/10" />
          <Skeleton className="h-3 w-48 bg-white/10" />
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <Skeleton className="h-32 w-32 rounded-full bg-white/10" />
        </div>
      </Card>
    );
  }

  const chartData = data.map((item, index) => {
    let color = BRAND_COLORS.GRAY;
    if (item.name.toUpperCase().includes("COMPLETED") || index === 0)
      color = BRAND_COLORS.PURPLE;
    else if (item.name.toUpperCase().includes("AVAILABLE") || index === 1)
      color = BRAND_COLORS.LIME;
    else if (item.name.toUpperCase().includes("TESTING") || index === 2)
      color = BRAND_COLORS.SKY;
    else if (item.name.toUpperCase().includes("REVIEW") || index === 4)
      return { ...item, color: "url(#stripePatternSmall)" };

    return { ...item, color };
  });

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <rect x={x - 14} y={y - 8} width={28} height={16} rx={8} fill="white" />
        <text
          x={x}
          y={y + 1}
          fill="black"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "9px", fontWeight: "bold" }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  return (
    <Card className="bg-[#1c1c1c] dark:bg-[#1c1c1c] border-none shadow-xl rounded-[2rem] p-6 h-full relative overflow-hidden transition-all duration-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Transfer history
            </h3>
          </div>
          <p className="text-gray-400 text-[11px] font-medium">
            Monitor how your money is being utilized
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center relative z-10">
        {/* Legend */}
        <div className="flex flex-col gap-3 w-1/2">
          {chartData.map((item) => {
            const isStriped = item.color === "url(#stripePatternSmall)";
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 group cursor-default"
              >
                <div
                  className="h-5 w-5 rounded-md"
                  style={{
                    background: isStriped
                      ? "repeating-linear-gradient(45deg, #1c1c1c, #1c1c1c 2px, #444 2px, #444 4px)"
                      : item.color,
                  }}
                />
                <span className="text-[13px] font-bold text-gray-400 group-hover:text-white transition-colors truncate">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="h-[250px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <defs>
                <pattern
                  id="stripePatternSmall"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#2a2a2a" />
                  <rect x="0" y="0" width="8" height="4" fill="#444" />
                </pattern>
                <filter
                  id="smallShadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodOpacity="0.3"
                  />
                </filter>
              </defs>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                cornerRadius={8}
                dataKey="value"
                stroke="none"
                label={renderCustomLabel}
                labelLine={false}
                animationBegin={0}
                animationDuration={1000}
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="outline-none"
                    filter="url(#smallShadow)"
                  />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subtle depth effect */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />
    </Card>
  );
}

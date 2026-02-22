"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartTooltip, ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

export function CardDesign1({
  stats,
  isLoading,
}: {
  stats: any;
  isLoading?: boolean;
}) {
  const totalUsers = stats?.totalUsers || 0;
  const data = [
    { time: "00:00", value: totalUsers * 0.4 },
    { time: "04:00", value: totalUsers * 0.5 },
    { time: "08:00", value: totalUsers * 0.45 },
    { time: "12:00", value: totalUsers * 0.7 },
    { time: "16:00", value: totalUsers * 0.6 },
    { time: "20:00", value: totalUsers * 0.9 },
    { time: "23:59", value: totalUsers },
  ];

  return (
    <Card className="bg-white dark:bg-[#0a0a0a] border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative h-[220px] flex flex-col justify-between p-6 group transition-all duration-300">
      {/* Background Chart with Faded Edges */}
      <div
        className="absolute inset-0 z-0 opacity-20 dark:opacity-40 group-hover:opacity-40 dark:group-hover:opacity-60 transition-opacity duration-500"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={{
                stroke: "hsl(var(--primary))",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border p-2 rounded-lg shadow-xl">
                      <p className="text-primary text-xs font-bold">
                        {Math.round(Number(payload[0].value || 0))} Users
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPrimary)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#fff",
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative z-10">
        <p className="text-foreground/40 text-[10px] tracking-[0.2em] font-bold uppercase">
          COMMUNITY SIZE
        </p>
      </div>

      <div className="relative z-10 flex items-end justify-between">
        <div>
          <p className="text-primary text-[10px] font-bold mb-1">
            Total Lifetime
          </p>
          <h3 className="text-5xl font-bold text-foreground tracking-tighter tabular-nums">
            {isLoading ? (
              <Skeleton className="h-12 w-20 bg-muted" />
            ) : (
              totalUsers
            )}
          </h3>
        </div>
        <div className="bg-primary/10 text-primary text-[10px] font-bold px-4 py-1 rounded-full mb-1">
          Daily
        </div>
      </div>
    </Card>
  );
}

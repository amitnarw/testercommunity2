import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/hooks/useWalletData";

interface WalletActivityChartProps {
  data: ChartDataPoint[];
  totalPackages: number;
  totalPoints: number;
}

export function WalletActivityChart({
  data,
  totalPackages,
  totalPoints,
}: WalletActivityChartProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 md:p-8 rounded-[2.5rem] hover:bg-card/80 transition-all duration-300 group shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Wallet Activity</h3>
        </div>
        <div className="flex gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-70">
                Packages
              </p>
            </div>
            <h4 className="text-2xl font-bold tabular-nums">
              {totalPackages}
            </h4>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-70">
                Points
              </p>
            </div>
            <h4 className="text-2xl font-bold tabular-nums">
              {totalPoints}
            </h4>
          </div>
        </div>
      </div>

      <div className="h-64 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="gradient-package"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="gradient-points"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.1}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "hsl(var(--muted-foreground))",
              }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "hsl(var(--muted-foreground))",
              }}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "1.5rem",
                padding: "12px 16px",
                fontSize: "14px",
                color: "hsl(var(--foreground))",
                boxShadow:
                  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                backdropFilter: "blur(10px)",
              }}
              cursor={{
                stroke: "hsl(var(--border))",
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="package"
              name="Packages"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#gradient-package)"
              dot={{
                r: 4,
                fill: "#3b82f6",
                stroke: "hsl(var(--card))",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#3b82f6",
                stroke: "hsl(var(--card))",
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="points"
              name="Points"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#gradient-points)"
              dot={{
                r: 4,
                fill: "#10b981",
                stroke: "hsl(var(--card))",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#10b981",
                stroke: "hsl(var(--card))",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

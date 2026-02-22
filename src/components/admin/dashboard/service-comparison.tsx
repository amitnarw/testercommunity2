import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  proSubmissions: {
    label: "Pro Submissions",
    color: "#f59e0b",
  },
  communitySubmissions: {
    label: "Community Submissions",
    color: "#3b82f6",
  },
  totalUsers: {
    label: "Total Users",
    color: "#22c55e",
  },
  submissions: {
    label: "Submissions",
    color: "hsl(var(--primary))",
  },
  feedback: {
    label: "Feedback",
    color: "#8b5cf6",
  },
  newUsers: {
    label: "New Users",
    color: "#22c55e",
  },
  pro: {
    label: "Professional",
    color: "#f59e0b",
  },
  community: {
    label: "Community",
    color: "#3b82f6",
  },
};

export function ServiceComparisonChart({
  serviceComparison,
  isLoading,
}: {
  serviceComparison: any[];
  isLoading: boolean;
}) {
  return (
    <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 rounded-3xl">
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2 text-base">
          Pro vs Community Comparison
        </CardTitle>
        <CardDescription className="text-sm">
          Comparing Professional and Community services
        </CardDescription>
      </CardHeader>
      <CardContent className="pr-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full bg-white/20" />
            <Skeleton className="h-8 w-full bg-white/20" />
            <Skeleton className="h-8 w-full bg-white/20" />
          </div>
        ) : serviceComparison.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={serviceComparison}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={9}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="monotone"
                  dataKey="pro"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="community"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            No data available
          </div>
        )}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-xs text-muted-foreground">Professional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-xs text-muted-foreground">Community</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

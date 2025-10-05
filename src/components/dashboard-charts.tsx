
'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Sector, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { chartData, pieChartData } from '@/lib/data.tsx'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'

const initialChartData = chartData;

export default function DashboardCharts() {
  const [activeChart, setActiveChart] = React.useState("pie");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const id = React.useId()

  const onPieEnter = React.useCallback(
    (_: any, index: number) => {
      setActiveIndex(index)
    },
    [setActiveIndex]
  )

  return (
    <div className="w-full">
        <ChartContainer
            config={{
                reports: {
                label: "New Reports",
                color: "hsl(var(--chart-1))",
                },
                resolved: {
                label: "Resolved",
                color: "hsl(var(--chart-2))",
                },
            }}
            className="min-h-[250px] w-full"
            >
            <BarChart data={initialChartData} accessibilityLayer margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="reports" fill="var(--color-reports)" radius={4} />
                <Bar dataKey="resolved" fill="var(--color-resolved)" radius={4} />
            </BarChart>
        </ChartContainer>
    </div>
  )
}

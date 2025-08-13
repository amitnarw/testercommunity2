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
import { chartData, pieChartData } from '@/lib/data'
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
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-xl">
            <CardHeader>
            <CardTitle>Bug Reports Overview</CardTitle>
            <CardDescription>A monthly overview of new bug reports vs resolved issues.</CardDescription>
            </CardHeader>
            <CardContent>
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
                className="min-h-[300px] w-full"
                >
                <BarChart data={initialChartData} accessibilityLayer>
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
            </CardContent>
        </Card>

        <Card className="rounded-xl">
            <CardHeader>
            <CardTitle>Bugs by Category</CardTitle>
            <CardDescription>Distribution of bug reports across different categories.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={{
                        bugs: {
                            label: "Bugs",
                        },
                        ui: {
                            label: "UI/UX",
                            color: "hsl(var(--chart-1))",
                        },
                        functional: {
                            label: "Functional",
                            color: "hsl(var(--chart-2))",
                        },
                        performance: {
                            label: "Performance",
                            color: "hsl(var(--chart-3))",
                        },
                        security: {
                            label: "Security",
                            color: "hsl(var(--chart-4))",
                        },
                        other: {
                            label: "Other",
                            color: "hsl(var(--chart-5))",
                        },
                    }}
                    className="mx-auto aspect-square max-h-[350px]"
                >
                    <PieChart>
                         <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                            />
                        <Pie
                        data={pieChartData}
                        dataKey="bugs"
                        nameKey="category"
                        innerRadius={60}
                        strokeWidth={5}
                        activeIndex={activeIndex}
                        activeShape={(props) => {
                            const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props as PieSectorDataItem;
                            return (
                                <g>
                                    <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold font-body">
                                        {payload.category}
                                    </text>
                                    <Sector
                                        cx={cx}
                                        cy={cy}
                                        innerRadius={innerRadius}
                                        outerRadius={outerRadius}
                                        startAngle={startAngle}
                                        endAngle={endAngle}
                                        fill={fill}
                                    />
                                </g>
                            )
                        }}
                        onMouseEnter={onPieEnter}
                        >
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  )
}

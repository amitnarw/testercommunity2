
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, DollarSign, Briefcase } from "lucide-react";
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartData = [
  { month: "Jan", earnings: 1860 },
  { month: "Feb", earnings: 3050 },
  { month: "Mar", earnings: 2370 },
  { month: "Apr", earnings: 730 },
  { month: "May", earnings: 2090 },
  { month: "Jun", earnings: 2140 },
]
const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "hsl(var(--chart-1))",
  },
}

export default function ProfessionalDashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Pro Tester Dashboard</h2>
            <p className="text-muted-foreground">Your central hub for professional testing projects.</p>
        </div>
         <Button asChild>
            <Link href="/tester/projects">
                <Briefcase className="mr-2 h-4 w-4" /> View All Projects
            </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,52,310</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">+18 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">3 pending invitations</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                 <CardDescription>Your earnings for the last 6 months.</CardDescription>
              </CardHeader>
              <CardContent>
                 <ChartContainer config={chartConfig} className="min-h-60 w-full">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
        </div>
    </div>
  );
}

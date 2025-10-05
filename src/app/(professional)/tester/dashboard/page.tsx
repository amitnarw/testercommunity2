
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, DollarSign, Briefcase, Bell, Package } from "lucide-react";
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/data";

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

const activeProjects = projects.filter(p => p.status === "In Testing");
const availableProjects = projects.filter(p => p.status === "In Review");
const testsCompleted = projects.filter(p => p.status === "Completed").length;


const recentActivity = [
    { id: 1, type: "payment", description: "Payment for 'Project Phoenix' processed.", date: "2024-08-20" },
    { id: 2, type: "completion", description: "Testing for 'Nexus Browser' completed.", date: "2024-08-18" },
    { id: 3, type: "invitation", description: "You were invited to test 'Odyssey Social'.", date: "2024-08-17" },
];

const ActivityIcon = ({ type }: { type: string }) => {
    switch (type) {
        case "payment": return <DollarSign className="w-4 h-4 text-green-500" />;
        case "completion": return <CheckCircle className="w-4 h-4 text-blue-500" />;
        case "invitation": return <Briefcase className="w-4 h-4 text-purple-500" />;
        default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
}

const BentoCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-card rounded-2xl p-4 flex flex-col justify-between ${className}`}>
        {children}
    </div>
);


export default function ProfessionalDashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Pro Tester Dashboard</h2>
            <p className="text-muted-foreground">Your central hub for professional testing projects.</p>
        </div>
         <Button asChild>
            <Link href="/professional/tester/projects">
                <Briefcase className="mr-2 h-4 w-4" /> View All Projects
            </Link>
        </Button>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BentoCard className="col-span-2 lg:col-span-2 bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-sm font-medium text-white/80">Lifetime Earnings</CardTitle>
                    <DollarSign className="h-4 w-4 text-white/80" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="text-4xl font-bold text-white">₹4,52,310</div>
                    <p className="text-xs text-white/80">+20.1% from last month</p>
                </CardContent>
            </BentoCard>
            <BentoCard>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="text-4xl font-bold">+{testsCompleted}</div>
                    <p className="text-xs text-muted-foreground">+5 from last month</p>
                </CardContent>
            </BentoCard>
             <BentoCard>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="text-4xl font-bold">{activeProjects.length}</div>
                    <p className="text-xs text-muted-foreground">in progress</p>
                </CardContent>
            </BentoCard>
             <BentoCard className="col-span-2 lg:col-span-2">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-sm font-medium">Available Projects</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="text-4xl font-bold">{availableProjects.length}</div>
                    <p className="text-xs text-muted-foreground">invitations waiting for you</p>
                </CardContent>
            </BentoCard>
             <Card className="col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                 <CardDescription>Your earnings for the last 6 months.</CardDescription>
              </CardHeader>
              <CardContent>
                 <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-5 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            {recentActivity.map(activity => (
                                <TableRow key={activity.id}>
                                    <TableCell className="w-10">
                                        <div className="p-2 bg-secondary rounded-full">
                                            <ActivityIcon type={activity.type} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm">{activity.description}</p>
                                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

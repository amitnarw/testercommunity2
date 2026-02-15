
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, DollarSign, Briefcase, Bell, Package, Activity } from "lucide-react";
import Link from 'next/link';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
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
    { id: 1, type: "payment", description: "Payment for 'Project Phoenix' processed.", date: "2025-10-05T10:31:39Z" },
    { id: 2, type: "completion", description: "Testing for 'Nexus Browser' completed.", date: "2025-10-05T10:31:39Z" },
    { id: 3, type: "invitation", description: "You were invited to test 'Odyssey Social'.", date: "2025-10-05T10:31:39Z" },
    { id: 4, type: "payment", description: "Payment for 'Project Phoenix' processed.", date: "2025-10-05T10:31:39Z" },
    { id: 5, type: "completion", description: "Testing for 'Nexus Browser' completed.", date: "2025-10-05T10:31:39Z" },
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
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-0 sm:pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">Tester Dashboard</h2>
                    <p className="text-muted-foreground">Your central hub for professional testing projects.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <BentoCard className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
                    <CardHeader className="p-0 pb-2.5">
                        <CardTitle className="text-sm font-medium text-white/80">Lifetime Earnings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-1">
                        <div className="text-3xl font-bold text-white">₹4,52,310</div>
                        <p className="text-xs text-white/80">+20.1% from last month</p>
                    </CardContent>
                </BentoCard>

                <BentoCard className="!flex-row gap-4 !py-2">
                    <Card className="shadow-none w-full">
                        <CardHeader className="p-0 pb-1">
                            <CardTitle className="text-xs sm:text-sm font-medium">Tests Completed</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1 bg-secondary rounded-xl">
                            <div className="text-3xl font-bold">+{testsCompleted}</div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">+5 from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none w-full">
                        <CardHeader className="p-0 pb-1">
                            <CardTitle className="text-xs sm:text-sm font-medium">Active Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1 bg-secondary rounded-xl">
                            <div className="text-3xl font-bold">{activeProjects.length}</div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">in progress</p>
                        </CardContent>
                    </Card>
                </BentoCard>

                <BentoCard className="bg-card/0 !p-0 !flex-row !justify-center gap-4">
                    <Card className="w-full p-4 shadow-none">
                        <CardHeader className="p-0 pb-1">
                            <CardTitle className="text-xs sm:text-sm font-medium">Available Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-1">
                            <div className="text-3xl font-bold">{availableProjects.length}</div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">waiting for you</p>
                        </CardContent>
                    </Card>
                    <Button asChild className="h-full w-full">
                        <Link href="/tester/projects" className="flex flex-col gap-2">
                            <div className="rounded-full bg-card p-2 !h-9 !w-9 sm:!h-12 sm:!w-12 flex items-center justify-center">
                                <Briefcase className="text-primary" size={30} />
                            </div>
                            <span className="text-xs sm:text-sm">View All Projects</span>
                        </Link>
                    </Button>
                </BentoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Earnings Overview</CardTitle>
                        <CardDescription>Your earnings for the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Activity</CardTitle>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/tester/activities">View All <ArrowRight className="ml-1 w-4 h-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-1.5">
                            {recentActivity.map(activity => (
                                <div key={activity.id} className="bg-secondary !rounded-xl flex flex-row items-center gap-4 p-4">
                                    <div className="p-2 bg-card rounded-full">
                                        <ActivityIcon type={activity.type} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm">{activity.description}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(activity.date)?.toLocaleDateString("en-IN", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

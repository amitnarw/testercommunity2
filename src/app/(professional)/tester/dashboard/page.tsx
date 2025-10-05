
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, DollarSign, Briefcase, Bell } from "lucide-react";
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

const activeProjects = [
    {
        id: 1,
        name: "QuantumLeap CRM",
        icon: "https://play-lh.googleusercontent.com/3aWGqSf3T_p3F6wc8FFvcZcnjWlxpZdNaqFVEvPwQ1gTOPkVoZwq6cYvfK9eCkwCXbRY=s96-rw",
        dataAiHint: "design logo",
        payout: 7500,
        endDate: "2024-09-10"
    }
];

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


export default function ProfessionalDashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Pro Tester Dashboard</h2>
            <p className="text-muted-foreground">Your central hub for professional testing projects.</p>
        </div>
         <Button asChild>
            <Link href="/professional/projects">
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
             <Card>
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
        <div className="lg:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Projects you are currently testing.</CardDescription>
                </CardHeader>
                <CardContent>
                    {activeProjects.map(project => (
                        <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                             <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={project.icon} data-ai-hint={project.dataAiHint} />
                                    <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{project.name}</p>
                                    <p className="text-xs text-muted-foreground">Ends {project.endDate}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/professional/projects/${project.id}`}>
                                    View <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
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

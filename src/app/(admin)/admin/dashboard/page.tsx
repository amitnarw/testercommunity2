

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, Bug, UserCheck, ArrowRight, Briefcase, Users2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts"

const recentProfessionalSubmissions = [
    { id: 2, name: "Project Phoenix", developer: "Wayne Enterprises", date: "2024-08-14", status: "Approved" },
    { id: 4, name: "Odyssey Social", developer: "Globex Corporation", date: "2024-08-11", status: "Approved" },
];

const recentCommunitySubmissions = [
    { id: 1, name: "QuantumLeap CRM", developer: "Stark Industries", date: "2024-08-15", status: "In Review" },
    { id: 3, name: "Nexus Browser", developer: "Cyberdyne Systems", date: "2024-08-12", status: "Rejected" },
];


const proChartData = [
  { month: "January", desktop: 100 },
  { month: "February", desktop: 150 },
  { month: "March", desktop: 120 },
  { month: "April", desktop: 50 },
  { month: "May", desktop: 180 },
  { month: "June", desktop: 200 },
]

const communityChartData = [
  { month: "January", desktop: 86 },
  { month: "February", desktop: 155 },
  { month: "March", desktop: 117 },
  { month: "April", desktop: 23 },
  { month: "May", desktop: 29 },
  { month: "June", desktop: 14 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
}


export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
            <h2 className="text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">Admin Dashboard</h2>
            <p className="text-muted-foreground">Oversee and manage the inTesters platform.</p>
        </div>
      </div>
      
      {/* Platform-wide Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bugs Squashed</CardTitle>
                <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">5,231</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Testers</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">96</div>
                <p className="text-xs text-muted-foreground">+5 since last month</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Professional Testing Card */}
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Briefcase className="w-8 h-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl">Professional Testing</CardTitle>
                        <CardDescription>Managed testing by vetted professionals.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid gap-4 grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pro Submissions</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">18</div>
                            <p className="text-xs text-muted-foreground">4 awaiting review</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Pro Testers</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">86</div>
                             <p className="text-xs text-muted-foreground">+5 since last month</p>
                        </CardContent>
                    </Card>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Recent Pro Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>App</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentProfessionalSubmissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell>{submission.name}</TableCell>
                                        <TableCell><Badge variant={submission.status === 'Rejected' ? 'destructive' : 'secondary'} className={submission.status === 'Approved' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}>{submission.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/submissions/${submission.id}`}>View <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Pro User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-60 w-full">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={proChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="desktop" fill="hsl(var(--primary))" radius={8} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>

        {/* Community Testing Card */}
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Users2 className="w-8 h-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl">Community Testing</CardTitle>
                        <CardDescription>Free, reciprocal testing by the community.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid gap-4 grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Community Submissions</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">6 awaiting review</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Community Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,159</div>
                            <p className="text-xs text-muted-foreground">+15.1% from last month</p>
                        </CardContent>
                    </Card>
                </div>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Recent Community Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>App</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentCommunitySubmissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell>{submission.name}</TableCell>
                                        <TableCell><Badge variant={submission.status === 'Rejected' ? 'destructive' : 'secondary'} className={submission.status === 'Approved' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}>{submission.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/submissions/${submission.id}`}>View <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Community User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-60 w-full">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={communityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="desktop" fill="hsl(var(--primary))" radius={8} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

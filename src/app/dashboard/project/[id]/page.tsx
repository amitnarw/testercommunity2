
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bug, CheckCircle, Clock, Percent, ShieldCheck, User, Users, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const getStatusConfig = (status: string) => {
    switch (status) {
        case "In Testing":
            return { badgeVariant: "destructive", icon: <Clock className="w-4 h-4" /> };
        case "Completed":
            return { badgeVariant: "secondary", icon: <CheckCircle className="w-4 h-4 text-green-500" /> };
        case "Archived":
            return { badgeVariant: "outline", icon: <ShieldCheck className="w-4 h-4" /> };
        default:
            return { badgeVariant: "secondary", icon: <Clock className="w-4 h-4" /> };
    }
}

const getFeedbackIcon = (type: string) => {
    switch (type) {
        case "Bug": return <Bug className="w-4 h-4 text-red-500" />;
        case "Suggestion": return <MessageSquare className="w-4 h-4 text-blue-500" />;
        case "Praise": return <CheckCircle className="w-4 h-4 text-green-500" />;
        default: return <MessageSquare className="w-4 h-4" />;
    }
};

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id.toString() === params.id);

  if (!project) {
    notFound();
  }
  
  const statusConfig = getStatusConfig(project.status);

  return (
    <div className="bg-secondary/50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-12">
            <header className="mb-8 max-w-5xl mx-auto">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
                </Button>
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <Image src={project.icon} alt={project.name} width={100} height={100} className="rounded-2xl border bg-background" data-ai-hint={project.dataAiHint} />
                    <div className="flex-grow">
                        <h1 className="text-4xl font-bold">{project.name}</h1>
                        <p className="text-muted-foreground mt-1">{project.packageName}</p>
                        <div className="flex items-center gap-4 mt-2">
                             <Badge variant={statusConfig.badgeVariant as any} className="flex items-center gap-1.5 pr-3">
                                {statusConfig.icon}
                                {project.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground">Started: {project.startedFrom}</p>
                        </div>
                    </div>
                </div>
                 <p className="text-muted-foreground mt-4 max-w-3xl">{project.description}</p>
            </header>

            <main className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Testers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{project.testersCompleted} / {project.testersStarted}</div>
                            <p className="text-xs text-muted-foreground">Completed / Started</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Crash-Free Rate</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{project.crashFreeRate}%</div>
                            <p className="text-xs text-muted-foreground">Across all testing sessions</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Top Bug Category</CardTitle>
                            <Bug className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{project.topBugs[0].type}</div>
                            <p className="text-xs text-muted-foreground">{project.topBugs[0].count} reports in this category</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Days in Testing</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{project.totalDays}</div>
                            <p className="text-xs text-muted-foreground">Avg. {project.avgTestersPerDay.toFixed(1)} testers/day</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bug Report Trend</CardTitle>
                                <CardDescription>Number of new bugs reported per day.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ChartContainer config={{ bugs: { label: "Bugs", color: "hsl(var(--primary))" } }} className="h-[250px] w-full">
                                    <BarChart accessibilityLayer data={project.chartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="bugs" fill="var(--color-bugs)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1">
                        <Card>
                             <CardHeader>
                                <CardTitle>Recent Feedback</CardTitle>
                                <CardDescription>Latest reports from testers.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Tester</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {project.feedback.slice(0, 5).map(fb => (
                                            <TableRow key={fb.id}>
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    {getFeedbackIcon(fb.type)}
                                                    {fb.type}
                                                </TableCell>
                                                <TableCell>{fb.tester}</TableCell>
                                                <TableCell>{fb.date}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    </div>
  )
}

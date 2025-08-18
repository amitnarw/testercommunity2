
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bug, CheckCircle, Clock, Percent, ShieldCheck, User, Users, MessageSquare, AlertTriangle, Star, Smartphone, BarChart, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
        case "Praise": return <Star className="w-4 h-4 text-amber-500" />;
        default: return <MessageSquare className="w-4 h-4" />;
    }
};

const getSeverityBadge = (severity: string) => {
    switch (severity) {
        case 'Critical': return <Badge variant="destructive" className="bg-red-700 hover:bg-red-800">{severity}</Badge>;
        case 'High': return <Badge variant="destructive" className="bg-red-500/80 hover:bg-red-600">{severity}</Badge>;
        case 'Medium': return <Badge variant="secondary" className="bg-amber-500/80 hover:bg-amber-600 text-white">{severity}</Badge>;
        case 'Low': return <Badge variant="secondary" className="bg-yellow-500/80 hover:bg-yellow-600 text-white">{severity}</Badge>;
        default: return <Badge variant="outline">{severity}</Badge>;
    }
};


export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id.toString() === params.id);

  if (!project) {
    notFound();
  }
  
  const statusConfig = getStatusConfig(project.status);
  const totalTesters = project.deviceCoverage.reduce((acc, dev) => acc + dev.testers, 0);

  return (
    <div className="bg-secondary/50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-12">
            <header className="mb-8 max-w-7xl mx-auto">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
                </Button>
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <Image src={project.icon} alt={project.name} width={100} height={100} className="rounded-2xl border bg-background" data-ai-hint={project.dataAiHint} />
                    <div className="flex-grow">
                        <div className="flex items-center gap-4">
                             <h1 className="text-4xl font-bold">{project.name}</h1>
                             <Badge variant={statusConfig.badgeVariant as any} className="flex items-center gap-1.5 pr-3 text-base mt-1">
                                {statusConfig.icon}
                                {project.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 font-mono">{project.packageName}</p>
                        <p className="text-muted-foreground mt-4 max-w-3xl">{project.description}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stability</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{project.crashFreeRate}%</p>
                            <p className="text-xs text-muted-foreground">Crash-Free Sessions</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Performance</CardTitle>
                             <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{project.performanceMetrics.avgStartupTime}</p>
                            <p className="text-xs text-muted-foreground">Avg. Startup Time</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{project.feedbackBreakdown.total}</p>
                             <p className="text-xs text-muted-foreground">{project.feedbackBreakdown.critical} Critical / {project.feedbackBreakdown.high} High</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Testers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{project.testersCompleted} / {project.testersStarted}</p>
                            <p className="text-xs text-muted-foreground">Completed / Enrolled</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                    <Card className="lg:col-span-1">
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5"/> Device Coverage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {project.deviceCoverage.map(device => (
                               <div key={device.device}>
                                   <div className="flex justify-between items-center mb-1">
                                       <span className="text-sm font-medium">{device.device}</span>
                                       <span className="text-sm text-muted-foreground">{device.testers} Testers</span>
                                   </div>
                                   <Progress value={(device.testers / totalTesters) * 100} />
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-1">
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5"/> OS Version Coverage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {project.osCoverage.map(os => (
                               <div key={os.version}>
                                   <div className="flex justify-between items-center mb-1">
                                       <span className="text-sm font-medium">{os.version}</span>
                                       <span className="text-sm text-muted-foreground">{os.testers} Testers</span>
                                   </div>
                                   <Progress value={(os.testers / totalTesters) * 100} className="[&>div]:bg-green-500" />
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-1">
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5"/> Top Geographies</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                               {project.topGeographies.map(geo => (
                                   <li key={geo.country} className="flex items-center justify-between">
                                       <span className="text-sm font-medium flex items-center gap-2">{geo.flag} {geo.country}</span>
                                       <span className="text-sm text-muted-foreground">{geo.testers} Testers</span>
                                   </li>
                               ))}
                           </ul>
                        </CardContent>
                    </Card>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Feedback Log</CardTitle>
                        <CardDescription>All feedback submitted by testers for this project.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Type</TableHead>
                                    <TableHead className="w-[120px]">Severity</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead className="w-[120px]">Status</TableHead>
                                    <TableHead className="w-[150px]">Tester</TableHead>
                                    <TableHead className="text-right w-[100px]">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {project.feedback.map(fb => (
                                    <TableRow key={fb.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            {getFeedbackIcon(fb.type)}
                                            {fb.type}
                                        </TableCell>
                                        <TableCell>{getSeverityBadge(fb.severity)}</TableCell>
                                        <TableCell className="text-muted-foreground">{fb.comment}</TableCell>
                                        <TableCell>
                                            <Badge variant={fb.status === 'Resolved' || fb.status === 'Closed' ? 'secondary' : 'outline'}>{fb.status}</Badge>
                                        </TableCell>
                                        <TableCell>{fb.tester}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{fb.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    </div>
  )
}

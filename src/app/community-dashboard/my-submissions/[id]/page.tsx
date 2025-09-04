
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projects as allProjects } from '@/lib/data'; // Using project data as it's richer
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, CheckCircle, Clock, Smartphone, MessageSquare, Star, BarChart, MapPin, LayoutGrid, List, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useState } from 'react';
import type { ProjectFeedback } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { format } from 'date-fns';
import { BackButton } from '@/components/back-button';


const FEEDBACK_PER_PAGE = 5;

const getStatusConfig = (status: string) => {
    switch (status) {
        case "In Testing":
            return { badgeVariant: "destructive", icon: <Clock className="w-4 h-4" /> };
        case "Completed":
            return { badgeVariant: "secondary", icon: <CheckCircle className="w-4 h-4 text-green-500" /> };
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


export default function CommunitySubmissionDetailsPage({ params }: { params: { id: string } }) {
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [activeTab, setActiveTab] = useState('bug');
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');

  // We'll use the rich `projects` data for this detail view
  const project = allProjects.find(p => p.id.toString() === params.id);

  if (!project) {
    notFound();
  }
  
  const statusConfig = getStatusConfig(project.status);

  const filteredFeedback = project.feedback.filter(fb => {
    return fb.type.toLowerCase() === activeTab;
  });

  const totalFeedbackPages = Math.ceil(filteredFeedback.length / FEEDBACK_PER_PAGE);
  const feedbackStartIndex = (feedbackPage - 1) * FEEDBACK_PER_PAGE;
  const feedbackEndIndex = feedbackStartIndex + FEEDBACK_PER_PAGE;
  const currentFeedback = filteredFeedback.slice(feedbackStartIndex, feedbackEndIndex);

  const handleFeedbackPageChange = (page: number) => {
    if (page < 1 || page > totalFeedbackPages) return;
    setFeedbackPage(page);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFeedbackPage(1);
  }

  return (
    <div className="bg-secondary/50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-12">
            <header className="mb-8 max-w-7xl mx-auto">
                <BackButton href="/community-dashboard/my-submissions" className="mb-4" />
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
                        <p className="text-muted-foreground mt-1 font-mono text-sm">Community Testing</p>
                        <p className="text-muted-foreground mt-4 max-w-3xl">{project.description}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <CardTitle className="text-sm font-medium">Testers Engaged</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{project.testersStarted}</p>
                            <p className="text-xs text-muted-foreground">Testers have started</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Points Cost</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{(project.testersCompleted * 80).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Across {project.testersCompleted} completed tests</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Time in Test</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{project.totalDays} / 14</p>
                            <p className="text-xs text-muted-foreground">Days completed</p>
                        </CardContent>
                    </Card>
                </div>
                
                 <Card>
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Detailed Feedback Log</CardTitle>
                            <CardDescription>All feedback submitted by testers for this project.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                           <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                                <LayoutGrid className="w-4 h-4" />
                                <span className="sr-only">List View</span>
                           </Button>
                            <Button variant={viewMode === 'table' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('table')}>
                                <List className="w-4 h-4" />
                                <span className="sr-only">Table View</span>
                           </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="bug" onValueChange={handleTabChange} className="w-full">
                            <TabsList>
                                <TabsTrigger value="bug">Bugs ({project.feedback.filter(fb => fb.type === 'Bug').length})</TabsTrigger>
                                <TabsTrigger value="suggestion">Suggestions ({project.feedback.filter(fb => fb.type === 'Suggestion').length})</TabsTrigger>
                                <TabsTrigger value="praise">Praise ({project.feedback.filter(fb => fb.type === 'Praise').length})</TabsTrigger>
                            </TabsList>
                            <TabsContent value={activeTab} className="mt-4">
                                {viewMode === 'table' ? (
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
                                            {currentFeedback.length > 0 ? currentFeedback.map(fb => (
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
                                                    <TableCell className="text-right text-muted-foreground">{format(new Date(fb.date), 'dd MMM yyyy')}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                        No {activeTab} feedback yet.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentFeedback.length > 0 ? currentFeedback.map(fb => (
                                            <Card key={fb.id} className="p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="font-medium flex items-center gap-2">
                                                        {getFeedbackIcon(fb.type)}
                                                        {fb.type}
                                                    </div>
                                                    {getSeverityBadge(fb.severity)}
                                                </div>
                                                <p className="text-muted-foreground text-sm">{fb.comment}</p>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                                                    <div>
                                                        <span className="font-semibold text-foreground">{fb.tester}</span> / {format(new Date(fb.date), 'dd MMM yyyy')}
                                                    </div>
                                                     <Badge variant={fb.status === 'Resolved' || fb.status === 'Closed' ? 'secondary' : 'outline'}>{fb.status}</Badge>
                                                </div>
                                            </Card>
                                        )) : (
                                             <div className="col-span-full text-center h-24 flex items-center justify-center text-muted-foreground">
                                                No {activeTab} feedback yet.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {totalFeedbackPages > 1 && (
                                    <Pagination className="mt-8">
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious 
                                                    href="#" 
                                                    onClick={(e) => { e.preventDefault(); handleFeedbackPageChange(feedbackPage - 1); }}
                                                    className={feedbackPage === 1 ? 'pointer-events-none opacity-50' : undefined}
                                                />
                                            </PaginationItem>
                                            {Array.from({ length: totalFeedbackPages }, (_, i) => i + 1).map(page => (
                                                <PaginationItem key={page}>
                                                    <PaginationLink 
                                                        href="#" 
                                                        isActive={feedbackPage === page}
                                                        onClick={(e) => { e.preventDefault(); handleFeedbackPageChange(page); }}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            <PaginationItem>
                                                <PaginationNext 
                                                    href="#" 
                                                    onClick={(e) => { e.preventDefault(); handleFeedbackPageChange(feedbackPage + 1); }}
                                                    className={feedbackPage === totalFeedbackPages ? 'pointer-events-none opacity-50' : undefined}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>
        </div>
    </div>
  )
}

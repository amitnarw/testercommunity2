
'use client';

import Image from 'next/image';
import { projects as allProjects } from '@/lib/data'; // Using project data as it's richer
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, CheckCircle, Clock, Smartphone, MessageSquare, Star, BarChart, MapPin, LayoutGrid, List, Users, ChevronLeft, ChevronRight, Lightbulb, PartyPopper } from 'lucide-react';
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
import type { Project, ProjectFeedback } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { BackButton } from '@/components/back-button';
import { AppPagination } from '@/components/app-pagination';
import { motion } from 'framer-motion';


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
        case "Suggestion": return <Lightbulb className="w-4 h-4 text-amber-500" />;
        case "Praise": return <PartyPopper className="w-4 h-4 text-green-500" />;
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

export default function SubmissionDetailsClient({ project }: { project: Project }) {
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const statusConfig = getStatusConfig(project.status);

  const filteredFeedback = project.feedback;

  const totalFeedbackPages = Math.ceil(filteredFeedback.length / FEEDBACK_PER_PAGE);
  const feedbackStartIndex = (feedbackPage - 1) * FEEDBACK_PER_PAGE;
  const feedbackEndIndex = feedbackStartIndex + FEEDBACK_PER_PAGE;
  const currentFeedback = filteredFeedback.slice(feedbackStartIndex, feedbackEndIndex);

  const handleFeedbackPageChange = (page: number) => {
    if (page < 1 || page > totalFeedbackPages) return;
    setFeedbackPage(page);
  };

  const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.2 }
      }
  };

  const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring' } }
  };

  const feedbackBreakdown = {
      bugs: project.feedback.filter(fb => fb.type === 'Bug').length,
      suggestions: project.feedback.filter(fb => fb.type === 'Suggestion').length,
      praise: project.feedback.filter(fb => fb.type === 'Praise').length,
      totalTesters: project.testersCompleted,
  };


  return (
    <div className="bg-secondary/50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-12">
            <header className="mb-8 max-w-7xl mx-auto">
                <div className="sticky top-0 z-30 pt-6 pb-4 bg-secondary/50">
                    <BackButton href="/community-dashboard/my-submissions" />
                </div>
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
                
                 {project.status === 'Completed' && (
                     <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-card p-3 sm:p-6 pt-4 rounded-2xl col-span-2 row-start-2 flex flex-col justify-between relative overflow-hidden"
                    >
                        <h3 className="text-xl sm:text-2xl font-semibold mb-3 bg-gradient-to-b from-primary to-primary/50 text-transparent bg-clip-text">Feedback Summary</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                            <div className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground p-5 rounded-lg">
                                <p className="text-xs">Total Testers</p>
                                <p className="text-4xl font-bold">{feedbackBreakdown?.totalTesters}</p>
                            </div>
                            <div className="bg-gradient-to-bl from-red-500/20 to-red-500/10 p-5 rounded-lg relative overflow-hidden">
                                <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-red-500">
                                    <Bug />
                                </div>
                                <p className="text-xs text-muted-foreground">Bugs</p>
                                <p className="text-4xl font-bold">{feedbackBreakdown.bugs}</p>
                            </div>
                            <div className="bg-gradient-to-bl from-yellow-500/20 to-yellow-500/10 p-5 rounded-lg relative overflow-hidden">
                                <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-yellow-500">
                                    <Lightbulb />
                                </div>
                                <p className="text-xs text-muted-foreground">Suggestions</p>
                                <p className="text-4xl font-bold">{feedbackBreakdown.suggestions}</p>
                            </div>
                            <div className="bg-gradient-to-bl from-green-500/20 to-green-500/10 p-5 rounded-lg relative overflow-hidden">
                                <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-90 text-green-500">
                                    <PartyPopper />
                                </div>
                                <p className="text-xs text-muted-foreground">Praise</p>
                                <p className="text-4xl font-bold">{feedbackBreakdown.praise}</p>
                            </div>
                        </div>
                    </motion.div>
                 )}

                 <div className="bg-card/50 rounded-2xl p-4 sm:p-6 sm:pt-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                         <div>
                            <h2 className="text-xl sm:text-2xl font-bold">Detailed Feedback Log</h2>
                            <p className="text-sm sm:text-base text-muted-foreground">All feedback submitted by testers for this project.</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                                <List className="w-4 h-4" />
                            </Button>
                            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                                <LayoutGrid className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                     {currentFeedback.length > 0 ? (
                        <>
                            {viewMode === 'list' ? (
                                <div className="space-y-3">
                                    {currentFeedback.map((fb) => (
                                       <Card key={fb.id} className={`bg-gradient-to-tl ${fb.type === "Bug" ? "from-red-500/20" : fb.type === "Suggestion" ? "from-yellow-500/20" : "from-green-500/20"} ${fb.type === "Bug" ? "to-red-500/5" : fb.type === "Suggestion" ? "to-yellow-500/5" : "to-green-500/5"} p-4 pt-2 pr-2 shadow-none border-0 relative overflow-hidden pl-5`}>
                                            <div className="flex items-start flex-col gap-0">
                                                <div className="absolute scale-[2.5] rotate-45 top-2 left-1 opacity-5 dark:opacity-10">
                                                    {getFeedbackIcon(fb.type)}
                                                </div>
                                                <div className="flex flex-row items-center justify-between w-full">
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-semibold">{fb.type}</p>
                                                        {getSeverityBadge(fb.severity)}
                                                    </div>
                                                    <Badge variant={fb.status === 'Resolved' || fb.status === 'Closed' ? 'secondary' : 'outline'}>{fb.status}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">{fb.comment}</p>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t w-full mt-3">
                                                    <div>
                                                        <span className="font-semibold text-foreground">{fb.tester}</span>
                                                    </div>
                                                    <span>{format(new Date(fb.date), 'dd MMM yyyy')}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                                    {currentFeedback.map((fb) => (
                                         <Card key={fb.id} className={`bg-gradient-to-bl ${fb.type === "Bug" ? "from-red-500/20" : fb.type === "Suggestion" ? "from-yellow-500/20" : "from-green-500/20"} ${fb.type === "Bug" ? "to-red-500/10" : fb.type === "Suggestion" ? "to-yellow-500/10" : "to-green-500/10"} p-4 pr-2 shadow-none border-0 h-full flex flex-col relative overflow-hidden`}>
                                            <CardHeader className="p-0 flex-row items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-full absolute opacity-10 scale-[3] -right-1 -top-1 -rotate-45">
                                                         {getFeedbackIcon(fb.type)}
                                                    </div>
                                                    <CardTitle className="text-base">{fb.type}</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0 pt-2 flex-grow">
                                                <p className="text-sm text-muted-foreground line-clamp-3">{fb.comment}</p>
                                            </CardContent>
                                            <CardFooter className="p-0 flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{fb.tester}</span>
                                                {getSeverityBadge(fb.severity)}
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                            <AppPagination 
                                currentPage={feedbackPage}
                                totalPages={totalFeedbackPages}
                                onPageChange={handleFeedbackPageChange}
                            />
                        </>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground bg-secondary/50 rounded-lg">
                            <p>No feedback has been submitted for this app yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    </div>
  )
}


'use client';

import Image from 'next/image';
import { projects as allProjects } from '@/lib/data'; // Using project data as it's richer
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, CheckCircle, Clock, Smartphone, MessageSquare, Star, BarChart, MapPin, LayoutGrid, List, Users, ChevronLeft, ChevronRight, Lightbulb, PartyPopper, Search, ClipboardList } from 'lucide-react';
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
import DeveloperInstructions from '@/components/developerInstructions';


const FEEDBACK_PER_PAGE = 5;

const getStatusConfig = (status: string) => {
    switch (status) {
        case "In Testing":
            return { badgeVariant: "destructive", icon: <Clock className="w-5 h-5" /> };
        case "Completed":
            return { badgeVariant: "secondary", icon: <CheckCircle className="w-5 h-5" /> };
        case "In Review":
            return { badgeVariant: "secondary", icon: <Search className="w-5 h-5" /> };
        default:
            return { badgeVariant: "secondary", icon: <Clock className="w-5 h-5" /> };
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
    if (severity === 'N/A') return null;
    switch (severity) {
        case 'Critical': return <Badge variant="destructive" className="bg-red-700 hover:bg-red-800 text-[10px] sm:text-xs p-0 px-1 sm:px-2 sm:py-0.5">{severity}</Badge>;
        case 'High': return <Badge variant="destructive" className="bg-red-500/80 hover:bg-red-600 text-[10px] sm:text-xs p-0 px-1 sm:px-2 sm:py-0.5">{severity}</Badge>;
        case 'Medium': return <Badge variant="secondary" className="bg-amber-500/80 hover:bg-amber-600 text-white text-[10px] sm:text-xs p-0 px-1 sm:px-2 sm:py-0.5">{severity}</Badge>;
        case 'Low': return <Badge variant="secondary" className="bg-yellow-500/80 hover:bg-yellow-600 text-white text-[10px] sm:text-xs p-0 px-1 sm:px-2 sm:py-0.5">{severity}</Badge>;
        default: return <Badge variant="outline">{severity}</Badge>;
    }
};

export default function SubmissionDetailsClient({ project }: { project: Project }) {
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const statusConfig = getStatusConfig(project.status);
    const isReview = project.status === 'In Review';
    const isCompleted = project.status === 'Completed';

    const filteredFeedback = isReview ? [] : project.feedback;

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
        bugs: isReview ? 0 : project.feedback.filter(fb => fb.type === 'Bug').length,
        suggestions: isReview ? 0 : project.feedback.filter(fb => fb.type === 'Suggestion').length,
        praise: isReview ? 0 : project.feedback.filter(fb => fb.type === 'Praise').length,
        totalTesters: isReview ? 0 : project.testersCompleted,
    };


    return (
        <div className="bg-[#f8fafc] dark:bg-[#0f151e] text-foreground min-h-screen">
            <div className="container mx-auto px-4 md:px-6">

                <main className="max-w-7xl mx-auto space-y-8">
                    <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 w-1/2">
                        <BackButton href="/community-dashboard/my-submissions" />
                    </div>
                    <header className="mb-8">
                        <div className="grid grid-cols-4 gap-8 sm:gap-4">
                            <div className='flex flex-row items-start justify-start gap-5 col-span-4 sm:col-span-3'>
                                <div className='min-w-20 h-20 sm:min-w-32 sm:h-32 relative'>
                                    <Image src={project.icon} alt={project.name} fill className="absolute rounded-2xl bg-background shadow-xl shadow-gray-500/10" data-ai-hint={project.dataAiHint} />
                                </div>
                                <div>
                                    <div className="flex items-start sm:items-center flex-col sm:flex-row justify-between sm:justify-start gap-0 sm:gap-4">
                                        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent leading-[unset]">{project.name}</h1>
                                        <Badge variant="outline" className="text-sm sm:text-lg border-none bg-gradient-to-b from-primary to-primary/50 !text-white text-normal px-5">{project.category}</Badge>
                                    </div>

                                    <div className='hidden sm:block mt-4 max-w-3xl'>
                                        <p className="text-muted-foreground line-clamp-2">{project.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='block sm:hidden col-span-4 w-full'>
                                <p className="text-muted-foreground w-full !line-clamp-2">{project.description}</p>
                            </div>

                            <div className="flex flex-col items-start justify-center gap-2 col-span-4 sm:col-span-1">
                                <p className='text-black dark:text-white font-bold'>STATUS</p>
                                <p className={`flex flex-row items-center gap-4 justify-center w-full text-lg sm:text-2xl font-bold rounded-xl p-3 ${project.status === "In Testing" ? "bg-gradient-to-br from-red-500/60 to-red-500/20 dark:from-red-500/30 dark:to-red-500/5" : project.status === "Completed" ? "bg-gradient-to-br from-green-500/60 to-green-500/20 dark:from-green-500/30 dark:to-green-500/5" : "bg-gradient-to-br from-yellow-500/60 to-yellow-500/20 dark:from-yellow-500/30 dark:to-yellow-500/5"} ${project.status === "In Testing" ? "text-red-800 dark:text-red-500" : project.status === "Completed" ? "text-green-800 dark:text-green-500" : "text-yellow-800 dark:text-yellow-500"}`}>
                                    <span>{statusConfig.icon}</span>
                                    <span>{project.status}</span>
                                </p>
                            </div>

                        </div>
                    </header>

                    <div className='relative flex flex-col gap-10 !mt-14'>
                        {isReview && (
                            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-20 rounded-2xl flex flex-col items-center justify-center">
                                <div className="bg-secondary/80 p-4 rounded-full mb-4">
                                    <Search className="w-12 h-12 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">In Review</h2>
                                <p className="text-muted-foreground max-w-sm text-center">Our team is currently reviewing this submission. Testing data and feedback will appear here once the app is published.</p>
                            </div>
                        )}
                        <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 text-center", isReview && "pointer-events-none")}>
                            <div className='flex flex-row gap-1 items-center justify-center rounded-2xl overflow-hidden'>
                                <div className="bg-gradient-to-tl from-primary/20 to-primary text-primary-foreground p-5 h-full w-full flex flex-col justify-center gap-1">
                                    <p className="text-xs">Total Testers</p>
                                    <p className="text-4xl sm:text-5xl font-bold">{feedbackBreakdown?.totalTesters}</p>
                                </div>
                                <div className="bg-gradient-to-tr from-primary/20 to-primary text-primary-foreground p-5 h-full w-full flex flex-col justify-center gap-1">
                                    <p className="text-xs">Total Days</p>
                                    <p className="text-4xl sm:text-5xl font-bold">{project.totalDays}</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 items-center justify-center bg-card rounded-2xl p-3'>
                                <p className='text-xs sm:text-sm'>Feedback</p>
                                <div className='flex flex-row gap-2 items-center justify-center w-full'>
                                    <div className="bg-gradient-to-bl from-red-500/20 to-red-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full">
                                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-red-500">
                                            <Bug />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">Bugs</p>
                                        <p className="text-3xl sm:text-4xl font-bold">{feedbackBreakdown.bugs}</p>
                                    </div>
                                    <div className="bg-gradient-to-bl from-yellow-500/20 to-yellow-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full">
                                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-yellow-500">
                                            <Lightbulb />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">Suggestions</p>
                                        <p className="text-3xl sm:text-4xl font-bold">{feedbackBreakdown.suggestions}</p>
                                    </div>
                                    <div className="bg-gradient-to-bl from-green-500/20 to-green-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full">
                                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-90 text-green-500">
                                            <PartyPopper />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">Praise</p>
                                        <p className="text-3xl sm:text-4xl font-bold">{feedbackBreakdown.praise}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-row gap-2 items-center jutify-center'>
                                <div className="bg-card p-3 pt-4 rounded-2xl flex flex-col justify-center h-full w-full">
                                    <p className="text-xs sm:text-sm mb-3">Points Cost</p>
                                    <p className="text-2xl sm:text-4xl font-bold bg-secondary rounded-lg h-full w-full flex flex items-center justify-center">{project.pointsCost.toLocaleString()}</p>
                                </div>
                                <div className="bg-card p-3 pt-4 rounded-2xl flex flex-col justify-center h-full w-full">
                                    <p className="text-xs sm:text-sm mb-3">Android Version</p>
                                    <p className="text-2xl sm:text-4xl py-2 sm:py-0 font-bold bg-secondary rounded-lg h-full w-full flex flex items-center justify-center">{project.androidVersion}</p>
                                </div>
                            </div>
                        </div>

                        <DeveloperInstructions title='Instructions for Testers' instruction={`"${project.testingInstructions}"`} mt={8} />

                        <div className={cn("bg-card/50 rounded-2xl p-4 sm:p-6 sm:pt-4", isReview && "pointer-events-none")}>
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
                                                <Card key={fb.id} className={`bg-gradient-to-tl ${fb.type === "Bug" ? "from-red-500/20" : fb.type === "Suggestion" ? "from-yellow-500/20" : "from-green-500/20"} ${fb.type === "Bug" ? "to-red-500/5" : fb.type === "Suggestion" ? "to-yellow-500/5" : "to-green-500/5"} p-0 pt-2 shadow-none border-0 relative overflow-hidden`}>
                                                    <div className="flex items-start flex-col gap-0 pt-4 pr-2 pl-5">
                                                        <div className="absolute scale-[2.5] rotate-45 top-2 left-1 opacity-5 dark:opacity-10">
                                                            {getFeedbackIcon(fb.type)}
                                                        </div>
                                                        <div className="flex flex-row items-center justify-between w-full">
                                                            <div className="flex items-center gap-3">
                                                                <p className="font-semibold">{fb.type}</p>
                                                                {getSeverityBadge(fb.severity)}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">{fb.comment}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground w-full mt-3 bg-black/5 dark:bg-white/10 px-5 py-1">
                                                        {fb.screenshot ? (
                                                            <div className="mt-3 cursor-pointer h-10 w-5 relative" onClick={() => setFullscreenImage(fb.screenshot)}>
                                                                <Image src={fb.screenshot} alt="Feedback screenshot" fill className="absolute rounded-sm border object-cover" />
                                                            </div>
                                                        ) : <div />}
                                                        <div className='flex flex-col sm:flex-row gap-0 sm:gap-5 items-end'>
                                                            <div>
                                                                <span className="font-semibold text-foreground">{fb.tester}</span>
                                                            </div>
                                                            <span className='text-[10px]'>{format(new Date(fb.date), 'dd MMM yyyy')}</span>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                                            {currentFeedback.map((fb) => (
                                                <Card key={fb.id} className={`bg-gradient-to-bl ${fb.type === "Bug" ? "from-red-500/20" : fb.type === "Suggestion" ? "from-yellow-500/20" : "from-green-500/20"} ${fb.type === "Bug" ? "to-red-500/10" : fb.type === "Suggestion" ? "to-yellow-500/10" : "to-green-500/10"} p-4 py-2 pr-2 shadow-none border-0 h-full flex flex-col relative overflow-hidden`}>
                                                    <CardHeader className="p-0 flex-row items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-3 rounded-full absolute opacity-10 scale-[3] -right-1 -top-1 ${fb.type === "Praise" ? "-rotate-90" : "-rotate-45"}`}>
                                                                {getFeedbackIcon(fb.type)}
                                                            </div>
                                                            <CardTitle className="text-base">{fb.type}</CardTitle>
                                                        </div>
                                                        {getSeverityBadge(fb.severity)}
                                                    </CardHeader>
                                                    <CardContent className="p-0 pt-2 flex-grow">
                                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{fb.comment}</p>
                                                    </CardContent>
                                                    <CardFooter className="p-0 flex items-center justify-between text-xs text-muted-foreground pt-2 mt-2 border-t border-black/20 dark:border-white/20">
                                                         {fb.screenshot ? (
                                                            <div className="mt-3 cursor-pointer h-10 w-5 relative" onClick={() => setFullscreenImage(fb.screenshot)}>
                                                                <Image src={fb.screenshot} alt="Feedback screenshot" fill className="absolute rounded-sm border object-cover" />
                                                            </div>
                                                        ) : <div />}
                                                        <div className='flex flex-col sm:flex-row gap-0 sm:gap-5 items-end'>
                                                            <div>
                                                                <span className="font-semibold text-foreground text-[10px] sm:text-[12px]">{fb.tester}</span>
                                                            </div>
                                                            <span className='text-[8px] sm:text-[10px]'>{format(new Date(fb.date), 'dd MMM yyyy')}</span>
                                                        </div>
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
                    </div>
                </main>
            </div>
        </div>
    )

    
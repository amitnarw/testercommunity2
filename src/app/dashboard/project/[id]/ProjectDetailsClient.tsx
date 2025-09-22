

'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { projects as allProjects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, CheckCircle, Clock, Users, MessageSquare, Star, Smartphone, BarChart, MapPin, LayoutGrid, List, Copy, ExternalLink, User, Info, ClipboardList, ChevronLeft, ChevronRight, XCircle, Search, AlertTriangle, Expand, X, PartyPopper, Lightbulb } from 'lucide-react';
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
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useState } from 'react';
import type { Project, ProjectFeedback } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/back-button';
import { AppPagination } from '@/components/app-pagination';
import AppInfoHeader from '@/components/app-info-header';


const FEEDBACK_PER_PAGE = 10;

const getStatusConfig = (status: string) => {
    switch (status) {
        case "In Testing":
            return { badgeVariant: "destructive", icon: <Clock className="w-4 h-4" />, color: 'text-destructive' };
        case "Completed":
            return { badgeVariant: "secondary", icon: <CheckCircle className="w-4 h-4 text-green-500" />, color: "text-green-500" };
        case "Rejected":
            return { badgeVariant: "destructive", icon: <XCircle className="w-4 h-4" />, color: "text-destructive" };
        case "In Review":
            return { badgeVariant: "secondary", icon: <Search className="w-4 h-4" />, color: "text-muted-foreground" };
        default:
            return { badgeVariant: "secondary", icon: <Clock className="w-4 h-4" />, color: "text-muted-foreground" };
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

const InfoCard = ({ icon, title, children, className }: { icon: React.ReactNode, title: string, children: React.ReactNode, className?: string }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        className={cn("rounded-2xl border bg-card text-card-foreground p-6 shadow-sm", className)}>
        <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">{icon}</div>
            <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <div>
            {children}
        </div>
    </motion.div>
);

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border text-sm">
                <p className="font-bold">{`${payload[0].name}`}</p>
                <p className="text-muted-foreground">{`Testers: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};


export default function ProjectDetailsClient({ project }: { project: Project }) {
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [activeTab, setActiveTab] = useState('bug');
    const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const statusConfig = getStatusConfig(project.status);
    const completionPercentage = (project.testersCompleted / project.testersStarted) * 100;
    const currentTestDay = Math.min(project.totalDays, 14);
    const isUnderReviewOrRejected = project.status === 'In Review' || project.status === 'Rejected';

    const filteredFeedback = isUnderReviewOrRejected ? [] : project.feedback.filter(fb => {
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
        setFeedbackPage(1); // Reset to first page on tab change
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to clipboard!",
            description: text,
        })
    }

    const osData = project.osCoverage.map(os => ({ name: os.version, value: os.testers }));
    const deviceData = project.deviceCoverage.map(d => ({ name: d.device, value: d.testers }));
    const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

    const pageVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };
    
    const feedbackBreakdown = {
        bugs: isUnderReviewOrRejected ? 0 : project.feedback.filter(fb => fb.type === 'Bug').length,
        suggestions: isUnderReviewOrRejected ? 0 : project.feedback.filter(fb => fb.type === 'Suggestion').length,
        praise: isUnderReviewOrRejected ? 0 : project.feedback.filter(fb => fb.type === 'Praise').length,
    };


    return (
        <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen">
            <div className="container px-4 md:px-6">
                <motion.div initial="hidden" animate="visible" variants={pageVariants} className='max-w-7xl mx-auto'>

                    <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 w-1/2">
                        <BackButton href="/dashboard" />
                    </div>

                    <AppInfoHeader logo={project.icon} name={project.name} dataAiHint={project.dataAiHint} category={project.category} description={project.description} status={project.status} statusConfig={statusConfig} />

                    {project.status === 'Rejected' && project.rejectionReason && (
                        <motion.section variants={itemVariants} className="bg-destructive/10 border-2 border-dashed border-destructive/10 rounded-2xl p-6 relative overflow-hidden mt-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-destructive/5 p-3 sm:bg-destructive/10 sm:p-3 rounded-full text-destructive absolute sm:static top-2 right-0 sm:top-auto sm:right-auto scale-[3] sm:scale-100">
                                    <AlertTriangle className="w-8 h-8 text-destructive/20 sm:text-destructive" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-destructive dark:text-red-500">{project.rejectionReason.title}</h2>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <p className="text-destructive/80 dark:text-red-500/80 leading-relaxed flex-1">{project.rejectionReason.description}</p>
                                {project.rejectionReason.imageUrl && (
                                    <div className="relative rounded-lg overflow-hidden group cursor-pointer w-full md:w-1/3" onClick={() => setFullscreenImage(project?.rejectionReason?.imageUrl!)}>
                                        <Image
                                            src={project.rejectionReason.imageUrl}
                                            alt={project.rejectionReason.title}
                                            width={600}
                                            height={400}
                                            className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint={project.rejectionReason.dataAiHint}
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Expand className="w-10 h-10 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    )}


                    <div className={`relative ${isUnderReviewOrRejected ? "blur-md pointer-events-none" : ""}`}>
                        <motion.div
                            variants={{
                                visible: { transition: { staggerChildren: 0.15 } }
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                            
                            <InfoCard icon={<Users className="w-5 h-5" />} title="Active Testers" className='lg:col-span-1'>
                                <p className="text-4xl font-bold">{project.testersStarted - project.testersCompleted}</p>
                                <p className="text-xs text-muted-foreground">{project.testersCompleted} of {project.testersStarted} testers have completed the test.</p>
                                <Progress value={(project.testersCompleted / project.testersStarted) * 100} className="mt-2 h-2" />
                            </InfoCard>

                            <InfoCard icon={<MessageSquare className="w-5 h-5" />} title="Feedback Breakdown" className='lg:col-span-2'>
                                <div className='grid grid-cols-3 gap-2'>
                                     <div className="bg-gradient-to-bl from-red-500/20 to-red-500/10 p-5 rounded-lg relative overflow-hidden w-full text-center">
                                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-red-500">
                                            <Bug />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Bugs</p>
                                        <p className="text-4xl font-bold">{feedbackBreakdown.bugs}</p>
                                    </div>
                                    <div className="bg-gradient-to-bl from-yellow-500/20 to-yellow-500/10 p-5 rounded-lg relative overflow-hidden w-full text-center">
                                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-yellow-500">
                                            <Lightbulb />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Suggestions</p>
                                        <p className="text-4xl font-bold">{feedbackBreakdown.suggestions}</p>
                                    </div>
                                    <div className="bg-gradient-to-bl from-green-500/20 to-green-500/10 p-5 rounded-lg relative overflow-hidden w-full text-center">
                                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-90 text-green-500">
                                            <PartyPopper />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Praise</p>
                                        <p className="text-4xl font-bold">{feedbackBreakdown.praise}</p>
                                    </div>
                                </div>
                            </InfoCard>
                            
                            <InfoCard icon={<Star className="w-5 h-5" />} title="Overall Rating" className='lg:col-span-1'>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-bold">{project.overallRating.toFixed(1)}</p>
                                    <p className="text-muted-foreground">/ 5.0</p>
                                </div>
                                <div className="flex mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("w-5 h-5", i < Math.round(project.overallRating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                                    ))}
                                </div>
                            </InfoCard>
                            
                            <InfoCard icon={<Info className="w-5 h-5" />} title="App Information">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Package Name</span>
                                        <span className="font-mono text-foreground truncate">{project.packageName}</span>
                                    </div>
                                    <div className="flex flex-col items-start gap-2">
                                        <span className="text-muted-foreground">Play Store Link</span>
                                        <div className="flex gap-2 w-full">
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => copyToClipboard(`https://play.google.com/store/apps/details?id=${project.packageName}`)}>
                                                <Copy className="mr-2 h-4 w-4" /> Copy
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1" asChild>
                                                <a href={`https://play.google.com/store/apps/details?id=${project.packageName}`} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="mr-2 h-4 w-4" /> Open
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </InfoCard>

                            <InfoCard icon={<ClipboardList className="w-5 h-5" />} title="Instructions for Testers" className='lg:col-span-3'>
                                <p className="text-sm text-muted-foreground italic">
                                    "{project.testingInstructions}"
                                </p>
                            </InfoCard>
                        </motion.div>

                        <main className="w-full mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <motion.div variants={itemVariants} className="lg:col-span-2">
                                <Card className="bg-card">
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
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="w-[120px]">Type</TableHead>
                                                                    <TableHead className="w-[120px]">Severity</TableHead>
                                                                    <TableHead>Comment</TableHead>
                                                                    <TableHead className="w-[150px]">Tester</TableHead>
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
                                                                        <TableCell>{fb.tester}</TableCell>
                                                                    </TableRow>
                                                                )) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                                                            No {activeTab} feedback yet for this project.
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {currentFeedback.length > 0 ? currentFeedback.map(fb => (
                                                            <Card key={fb.id} className="p-4 space-y-3 bg-secondary/50 hover:shadow-md transition-shadow">
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
                                                            <div className="text-center h-24 flex items-center justify-center text-muted-foreground">
                                                                No {activeTab} feedback yet.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <AppPagination
                                                    currentPage={feedbackPage}
                                                    totalPages={totalFeedbackPages}
                                                    onPageChange={handleFeedbackPageChange}
                                                />
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-primary" /> Tested Devices</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 text-sm">
                                            {project.deviceCoverage.map(d => (
                                                 <li key={d.device} className="flex items-center justify-between">
                                                    <span className="font-semibold">{d.device}</span>
                                                    <span className="font-mono text-muted-foreground">{d.testers} testers</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5 text-primary" /> OS Version</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={osData} cx="50%" cy="50%" labelLine={false} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                                                    {osData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Top Geographies</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 text-sm">
                                            {project.topGeographies.map(geo => (
                                                <li key={geo.country} className="flex items-center justify-between">
                                                    <span className="flex items-center gap-2">{geo.flag} {geo.country}</span>
                                                    <span className="font-mono text-muted-foreground">{geo.testers} testers</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </main>
                    </div>
                </motion.div>
                {fullscreenImage && (
                    <div
                        className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-50"
                            onClick={() => setFullscreenImage(null)}
                        >
                            <X className="w-8 h-8" />
                            <span className="sr-only">Close</span>
                        </Button>
                        <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
                            <Image
                                src={fullscreenImage}
                                alt="Fullscreen view"
                                layout="fill"
                                objectFit="contain"
                                className="animate-in zoom-in-95"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

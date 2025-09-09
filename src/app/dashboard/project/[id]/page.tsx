

'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { projects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, CheckCircle, Clock, Users, MessageSquare, Star, Smartphone, BarChart, MapPin, LayoutGrid, List, Copy, ExternalLink, User, Info,ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import type { ProjectFeedback } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/back-button';


const FEEDBACK_PER_PAGE = 10;

const getStatusConfig = (status: string) => {
    switch (status) {
        case "In Testing":
            return { badgeVariant: "destructive", icon: <Clock className="w-4 h-4" />, color: 'text-destructive' };
        case "Completed":
            return { badgeVariant: "secondary", icon: <CheckCircle className="w-4 h-4 text-green-500" />, color: "text-green-500" };
        case "Archived":
            return { badgeVariant: "outline", icon: <CheckCircle className="w-4 h-4" />, color: "text-muted-foreground" };
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


export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [activeTab, setActiveTab] = useState('bug');
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');

  const projectId = params.id;
  const project = projects.find(p => p.id.toString() === projectId);

  if (!project) {
    notFound();
  }
  
  const statusConfig = getStatusConfig(project.status);
  const completionPercentage = (project.testersCompleted / project.testersStarted) * 100;
  const currentTestDay = Math.min(project.totalDays, 14);

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
  
  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    if (totalFeedbackPages <= 5) {
        for (let i = 1; i <= totalFeedbackPages; i++) {
            range.push(i);
        }
    } else {
        if (feedbackPage > 2) {
            range.push(1);
            if (feedbackPage > 3) range.push('...');
        }
        
        let start = Math.max(1, feedbackPage - 1);
        let end = Math.min(totalFeedbackPages, feedbackPage + 1);

        if(feedbackPage === 1) end = 3;
        if(feedbackPage === totalFeedbackPages) start = totalFeedbackPages - 2;

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        if (feedbackPage < totalFeedbackPages - 1) {
            if (feedbackPage < totalFeedbackPages - 2) range.push('...');
            range.push(totalFeedbackPages);
        }
    }
    return range.slice(0, 3);
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


  return (
    <div className="bg-secondary/30 min-h-screen">
        <div className="container px-4 md:px-6 py-12">
            <motion.div initial="hidden" animate="visible" variants={pageVariants}>
                <motion.div variants={itemVariants}>
                    <BackButton href="/dashboard" className="mb-4" />
                    <div className="rounded-2xl overflow-hidden shadow-lg border-border/50 bg-card p-6 flex flex-col md:flex-row items-start gap-6">
                        <Image src={project.icon} alt={project.name} width={100} height={100} className="rounded-2xl border bg-background" data-ai-hint={project.dataAiHint} />
                        <div className="flex-grow">
                            <Badge variant={statusConfig.badgeVariant as any} className={cn("flex items-center gap-1.5 w-fit", statusConfig.color)}>
                                {statusConfig.icon}
                                {project.status}
                            </Badge>
                            <h1 className="text-4xl font-bold mt-2">{project.name}</h1>
                            <p className="text-muted-foreground mt-1">{project.description}</p>
                        </div>
                        <div className='flex flex-row gap-5'>
                            <div className="text-center">
                                <p className="text-4xl font-bold text-primary">{currentTestDay}</p>
                                <p className="text-xs text-muted-foreground">Day of 14</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold">{project.testersStarted - project.testersCompleted}</p>
                                <p className="text-xs text-muted-foreground">Testers Active</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    variants={{
                        visible: { transition: { staggerChildren: 0.15 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
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
                    <InfoCard icon={<User className="w-5 h-5" />} title="Developer Information">
                         <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" data-ai-hint="man smiling" />
                                <AvatarFallback>DV</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold">Demo User</p>
                                <p className="text-sm text-muted-foreground">demo@inTesters.com</p>
                            </div>
                        </div>
                    </InfoCard>
                     <InfoCard icon={<ClipboardList className="w-5 h-5" />} title="Instructions for Testers">
                        <p className="text-sm text-muted-foreground italic">
                            "Please focus on the new checkout flow. We've added support for UPI payments and would like feedback on the user experience and any potential bugs during the transaction process. Also, check for stability on Android 12 devices."
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

                                        {totalFeedbackPages > 1 && (
                                            <Pagination className="mt-6">
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleFeedbackPageChange(feedbackPage - 1)}
                                                            disabled={feedbackPage === 1}
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>
                                                    </PaginationItem>
                                                    {getPaginationRange().map((page, index) => (
                                                        <PaginationItem key={index}>
                                                            {typeof page === 'number' ? (
                                                                <PaginationLink
                                                                    href="#"
                                                                    isActive={feedbackPage === page}
                                                                    onClick={(e) => { e.preventDefault(); handleFeedbackPageChange(page); }}
                                                                >
                                                                    {page}
                                                                </PaginationLink>
                                                            ) : (
                                                                <span className="px-4 py-2">...</span>
                                                            )}
                                                        </PaginationItem>
                                                    ))}
                                                    <PaginationItem>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleFeedbackPageChange(feedbackPage + 1)}
                                                            disabled={feedbackPage === totalFeedbackPages}
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </motion.div>
                     <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-primary"/> Device Coverage</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={deviceData} cx="50%" cy="50%" labelLine={false} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                                            {deviceData.map((entry, index) => (
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
                                <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5 text-primary"/> OS Version</CardTitle>
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
                                <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Top Geographies</CardTitle>
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
            </motion.div>
        </div>
    </div>
  );
}

    

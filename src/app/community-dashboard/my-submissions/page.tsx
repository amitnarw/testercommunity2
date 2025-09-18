
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { PlusCircle, FileClock, CheckCircle, Clock, Search, Star, XCircle } from 'lucide-react'
import Link from 'next/link';
import { useState } from 'react';
import { projects as allProjects } from '@/lib/data';
import type { Project } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackButton } from '@/components/back-button';
import { AppPagination } from '@/components/app-pagination';
import { motion } from 'framer-motion';

const PROJECTS_PER_PAGE = 6;

const getStatusConfig = (status: Project['status']) => {
    switch (status) {
        case "In Review":
            return { icon: <Search className="w-3 h-3" />, description: "Our team is reviewing your submission." };
        case "In Testing":
            return { icon: <Clock className="w-3 h-3" />, description: "Community members are actively testing your app." };
        case "Completed":
            return { icon: <CheckCircle className="w-3 h-3" />, description: "Test cycle complete! Check your feedback." };
        case "Rejected":
            return { icon: <XCircle className="w-3 h-3" />, description: "Submission rejected. Check review notes." };
        default:
            return { icon: <FileClock className="w-3 h-3" />, description: "Your app is published and awaiting testers." };
    }
}

const ProjectCard = ({ project }: { project: Project }) => {
    const statusConfig = getStatusConfig(project.status as Project['status']);
    const isReviewOrDraft = project.status === "In Review" || project.status === "Draft" || project.status === "Rejected";

    return (
        <Card key={project.id} className="group relative overflow-hidden rounded-2xl bg-background hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border-0">
            <Link href={`/community-dashboard/my-submissions/${project.id}`} className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-start gap-4 p-5">
                    <Image src={project.icon} alt={project.name} width={48} height={48} className="rounded-lg border bg-secondary" data-ai-hint={project.dataAiHint} />
                    <div className="flex-grow overflow-hidden">
                        <CardTitle className="text-base">{project.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{project.packageName}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto flex-shrink-0 absolute sm:static top-1 right-2 text-[10px] sm:text-xs">{project.category}</Badge>
                </CardHeader>
                <CardContent className="p-5 pt-0 flex-grow relative">
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">{project.description}</p>
                </CardContent>
                <CardFooter className="p-3 bg-secondary/50 m-2 rounded-lg mt-auto flex-col items-start gap-3">
                     <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-full bg-background", 
                            project.status === 'In Testing' ? 'text-destructive' 
                            : project.status === 'Completed' ? 'text-green-600' 
                            : project.status === 'Rejected' ? 'text-red-500'
                            : 'text-muted-foreground'
                        )}>
                            {statusConfig.icon}
                        </div>
                        <div>
                             <p className="text-xs text-muted-foreground mt-1">
                                {isReviewOrDraft 
                                    ? statusConfig.description
                                    : `${project.testersCompleted} of ${project.testersStarted} testers completed.`
                                }
                             </p>
                        </div>
                    </div>
                    <div className="flex justify-between w-full text-xs text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500" />
                            <span className="font-semibold text-foreground">{project.pointsCost.toLocaleString()} Pts</span>
                        </div>
                        <div className="flex items-center gap-1">
                             <Clock className="w-3 h-3" />
                             <span>{project.totalDays} Days</span>
                        </div>
                         <div className="flex items-center gap-1">
                             <span>Android {project.androidVersion}</span>
                        </div>
                    </div>
                </CardFooter>
            </Link>
        </Card>
    );
}

const EmptyState = () => (
    <div className="col-span-full text-center py-20 bg-background rounded-2xl">
        <FileClock className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Submissions Here</h3>
        <p className="mt-2 text-sm text-muted-foreground">This tab is empty. Check other tabs or submit a new app!</p>
        <Button asChild className="mt-6">
            <Link href="/community-dashboard/submit">Submit Your First App</Link>
        </Button>
    </div>
);

const PaginatedProjectList = ({ projects }: { projects: Project[] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    const currentProjects = projects.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <>
            {currentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
                </div>
            ) : (
                <EmptyState />
            )}
            <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    );
};


export default function MySubmissionsPage() {
    const inReviewApps = allProjects.filter(p => p.status === "In Review");
    const inTestingApps = allProjects.filter(p => p.status === "In Testing");
    const completedApps = allProjects.filter(p => p.status === "Completed");
    const rejectedApps = allProjects.filter(p => p.status === "Rejected");

    const [mainTab, setMainTab] = useState('pending');
    const [pendingSubTab, setPendingSubTab] = useState('in-review');

    const mainTabs = [
        { label: 'Pending', value: 'pending', count: inReviewApps.length + rejectedApps.length },
        { label: 'Testing', value: 'testing', count: inTestingApps.length },
        { label: 'Completed', value: 'completed', count: completedApps.length },
    ];
    
    const pendingTabs = [
        { label: 'In Review', value: 'in-review', count: inReviewApps.length },
        { label: 'Rejected', value: 'rejected', count: rejectedApps.length },
    ];

    return (
        <>
            <div className="min-h-screen bg-secondary/50">
                <div className="container mx-auto px-4 md:px-6">
                    <header className="mb-8 pt-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                            <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8">
                                <BackButton href="/community-dashboard" />
                            </div>
                            <div className='flex flex-row items-center justify-between gap-4 w-full'>
                                <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-primary to-primary/10 bg-clip-text text-transparent">My Submissions</h1>
                                <Button asChild className='bg-gradient-to-b from-primary to-primary/40 text-primary-foreground px-3 h-8 sm:p-auto sm:h-10'>
                                    <Link href="/community-dashboard/submit">
                                        <PlusCircle className="h-4 w-4 absolute sm:static top-0 sm:top-auto left-0 sm:left-auto scale-[2] sm:scale-100 text-white/20 sm:text-white" />
                                        <span className='hidden sm:block'>Submit New App</span>
                                        <span className='sm:hidden block'>Submit</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </header>

                    <main>
                        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
                            <TabsList className="relative grid w-full grid-cols-3 bg-muted p-1 rounded-full">
                                {mainTabs.map((tab) => {
                                    const isSelected = mainTab === tab.value;
                                    return (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className={`relative px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 ${isSelected ? 'text-foreground' : 'hover:bg-background/50'}`}
                                        >
                                            {isSelected && (
                                                <motion.span
                                                    layoutId="bubble"
                                                    className="absolute inset-0 z-10 bg-background rounded-full"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <span className="relative z-20">
                                                {tab.label} ({tab.count})
                                            </span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                            <TabsContent value="pending" className="mt-6">
                                <div className="flex justify-start mb-6">
                                    <div className="flex items-center gap-2 p-1 bg-muted rounded-full">
                                        {pendingTabs.map((tab) => (
                                            <Button
                                                key={tab.value}
                                                variant={pendingSubTab === tab.value ? 'default' : 'ghost'}
                                                onClick={() => setPendingSubTab(tab.value)}
                                                className="rounded-full px-4 py-1.5 text-sm h-auto"
                                            >
                                                {tab.label} ({tab.count})
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                {pendingSubTab === 'in-review' && <PaginatedProjectList projects={inReviewApps} />}
                                {pendingSubTab === 'rejected' && <PaginatedProjectList projects={rejectedApps} />}
                            </TabsContent>
                            <TabsContent value="testing" className="mt-6">
                                <PaginatedProjectList projects={inTestingApps} />
                            </TabsContent>
                            <TabsContent value="completed" className="mt-6">
                                <PaginatedProjectList projects={completedApps} />
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </>
    )
}


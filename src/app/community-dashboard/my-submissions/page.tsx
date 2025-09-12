
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { PlusCircle, FileClock, CheckCircle, Clock, ArrowRight, Search, FileCheck, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link';
import { useState } from 'react';
import { projects as allProjects } from '@/lib/data';
import type { Project } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { BackButton } from '@/components/back-button';
import { AppPagination } from '@/components/app-pagination';
import { motion } from 'framer-motion';

const PROJECTS_PER_PAGE = 6;

const getStatusConfig = (status: Project['status']) => {
    switch (status) {
        case "In Review":
            return { badgeVariant: "secondary", icon: <Search className="w-3 h-3" />, description: "Our team is reviewing your submission." };
        case "In Testing":
            return { badgeVariant: "destructive", icon: <Clock className="w-3 h-3" />, description: "Community members are actively testing your app." };
        case "Completed":
            return { badgeVariant: "default", className: "bg-green-600 hover:bg-green-700", icon: <CheckCircle className="w-3 h-3" />, description: "Test cycle complete! Check your feedback." };
        default:
            return { badgeVariant: "outline", icon: <FileClock className="w-3 h-3" />, description: "Your app is published and awaiting testers." };
    }
}

const ProjectCard = ({ project }: { project: Project }) => {
    const statusConfig = getStatusConfig(project.status as Project['status']);
    return (
        <Card key={project.id} className="group relative overflow-hidden rounded-2xl bg-background hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border-0">
            <Link href={`/community-dashboard/my-submissions/${project.id}`} className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-start gap-4 p-5">
                    <Image src={project.icon} alt={project.name} width={48} height={48} className="rounded-lg border bg-secondary" data-ai-hint={project.dataAiHint} />
                    <div className="flex-grow">
                        <CardTitle className="text-base">{project.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{project.packageName}</p>
                    </div>
                    <ArrowRight className="absolute top-4 right-4 text-muted-foreground/30 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
                </CardHeader>
                <CardContent className="p-5 pt-0 flex-grow relative">
                    <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent"></div>
                </CardContent>
                <CardFooter className="p-3 bg-secondary/50 m-2 rounded-lg mt-auto">
                    <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-full bg-background", statusConfig.className)}>
                            {statusConfig.icon}
                        </div>
                        <div>
                            <Badge variant={statusConfig.badgeVariant as any} className={cn("text-xs font-semibold", statusConfig.className)}>
                                {project.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{statusConfig.description}</p>
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
        <p className="mt-2 text-sm text-muted-foreground">Submit your first app to get it tested by the community.</p>
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
    const publishedApps = allProjects.filter(p => ["In Testing", "Completed"].includes(p.status));

    const [selectedTab, setSelectedTab] = useState('in-review');
    const tabs = [
        { label: 'In Review', value: 'in-review', count: inReviewApps.length },
        { label: 'Published', value: 'published', count: publishedApps.length }
    ];

    return (
        <>
            <div className="min-h-screen bg-secondary/50">
                <div className="container mx-auto px-4 md:px-6">
                    <header className="mb-8 pt-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8">
                                <BackButton href="/community-dashboard" />
                            </div>
                            <div className='flex flex-row items-center justify-between gap-4 w-full'>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/10 bg-clip-text text-transparent">My Submissions</h1>
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
                        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                            <TabsList className="relative grid w-full grid-cols-2 bg-muted p-1 rounded-full">
                                {tabs.map((tab) => {
                                    const isSelected = selectedTab === tab.value;

                                    return (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className={`relative px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 ${isSelected ? 'text-foreground' : 'hover:bg-background/50'
                                                }`}
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
                            <TabsContent value="in-review" className="mt-6">
                                <PaginatedProjectList projects={inReviewApps} />
                            </TabsContent>
                            <TabsContent value="published" className="mt-6">
                                <PaginatedProjectList projects={publishedApps} />
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </>
    )
}

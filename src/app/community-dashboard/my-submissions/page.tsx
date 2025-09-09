
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { PlusCircle, FileClock, CheckCircle, Clock, ArrowRight, Search, FileCheck, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link';
import { useState } from 'react';
import { projects as allProjects } from '@/lib/data';
import type { Project } from '@/lib/types';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { BackButton } from '@/components/back-button';

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
        <Card key={project.id} className="group relative overflow-hidden rounded-2xl bg-background hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
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

    const getPaginationRange = () => {
        const range: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            if (currentPage > 2) {
                range.push(1);
                if (currentPage > 3) range.push('...');
            }
            
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages, currentPage + 1);
    
            if(currentPage === 1) end = 3;
            if(currentPage === totalPages) start = totalPages - 2;
    
            for (let i = start; i <= end; i++) {
                range.push(i);
            }
    
            if (currentPage < totalPages - 1) {
                if (currentPage < totalPages - 2) range.push('...');
                range.push(totalPages);
            }
        }
        return range.slice(0, 3);
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
            {totalPages > 1 && (
                <Pagination className="mt-12">
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className='md:hidden'
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                             <Button
                                variant="outline"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className='hidden md:inline-flex'
                            >
                                Previous
                            </Button>
                        </PaginationItem>
                        {getPaginationRange().map((page, index) => (
                            <PaginationItem key={index}>
                                {typeof page === 'number' ? (
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === page}
                                        onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
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
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className='md:hidden'
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className='hidden md:inline-flex'
                            >
                                Next
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
};


export default function MySubmissionsPage() {
    const inReviewApps = allProjects.filter(p => p.status === "In Review");
    const publishedApps = allProjects.filter(p => ["In Testing", "Completed"].includes(p.status));

    return (
        <>
            <div className="min-h-screen bg-secondary/50">
                <div className="container mx-auto px-4 md:px-6">
                    <header className="mb-8 pt-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className='flex flex-row gap-4 items-center justify-center'>
                                <BackButton href="/community-dashboard" />
                                <h1 className="text-xl font-bold">My Submissions</h1>
                            </div>
                            <Button asChild className='bg-gradient-to-b from-primary to-primary/40 text-primary-foreground'>
                                <Link href="/community-dashboard/submit">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Submit a New App
                                </Link>
                            </Button>
                        </div>
                    </header>

                    <main>
                        <Tabs defaultValue="in-review" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="in-review">In Review ({inReviewApps.length})</TabsTrigger>
                                <TabsTrigger value="published">Published ({publishedApps.length})</TabsTrigger>
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


'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { PlusCircle, FileClock, CheckCircle, Clock, ArrowRight, Search } from 'lucide-react'
import Link from 'next/link';
import { useState } from 'react';
import { projects as allProjects } from '@/lib/data';
import type { Project } from '@/lib/types';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
                <CardContent className="p-5 pt-0 flex-grow">
                   <p className="text-sm text-muted-foreground h-12 line-clamp-2">{project.description}</p>
                   {project.status === "In Review" && project.reviewNotes && (
                       <div className="mt-2 p-3 bg-secondary/50 rounded-lg text-xs">
                           <p className="font-semibold text-foreground">Review Notes:</p>
                           <p className="text-muted-foreground">{project.reviewNotes}</p>
                       </div>
                   )}
                </CardContent>
                <CardFooter className="p-3 bg-secondary/50 m-2 rounded-lg">
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
             {totalPages > 1 && (
                <Pagination className="mt-12">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                            <PaginationLink 
                                href="#" 
                                isActive={currentPage === page}
                                onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
                        />
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
        <div className="container mx-auto px-4 md:px-6 py-12">
          <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">My Submissions</h1>
              <p className="text-muted-foreground">Track the progress of apps you've submitted for community testing.</p>
            </div>
            <Button asChild>
                <Link href="/community-dashboard/submit">
                  <PlusCircle className="mr-2 h-4 w-4" /> Submit a New App
                </Link>
            </Button>
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

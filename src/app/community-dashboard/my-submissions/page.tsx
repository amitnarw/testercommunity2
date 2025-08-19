
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { PlusCircle, Gem } from 'lucide-react'
import Link from 'next/link';
import { useState } from 'react';
import { projects as allProjects } from '@/lib/data';
import type { Project } from '@/lib/types';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';


const PROJECTS_PER_PAGE = 6;

const getStatusConfig = (status: string) => {
    switch (status) {
        case "In Testing":
            return {
                badgeVariant: "destructive",
            };
        case "Completed":
            return {
                badgeVariant: "secondary",
            };
        case "Archived":
            return {
                badgeVariant: "outline",
            };
        default:
            return {
                badgeVariant: "secondary",
            };
    }
}

const Metric = ({ label, value }: { label: string, value: string | number }) => (
    <div className="bg-secondary/50 rounded-lg p-3 text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);


export default function MySubmissionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const myCommunityApps = allProjects.slice(0, 2); // Assume first 2 projects are community submissions

  const totalPages = Math.ceil(myCommunityApps.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = myCommunityApps.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <div className="min-h-screen bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">My Community Submissions</h1>
              <p className="text-muted-foreground">Track the progress of apps you've submitted for community testing.</p>
            </div>
            <Button asChild>
                <Link href="/community-dashboard/submit">
                  <PlusCircle className="mr-2 h-4 w-4" /> Submit a New App
                </Link>
            </Button>
          </header>

            <Card className="rounded-xl border-0 bg-transparent shadow-sm">
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-0">
                    {currentProjects.length > 0 ? currentProjects.map((project) => {
                        const statusConfig = getStatusConfig(project.status);
                        return (
                            <div key={project.id} className="group relative">
                                <Link href={`/community-dashboard/my-submissions/${project.id}`}>
                                    <div className="rounded-2xl overflow-hidden bg-background hover:bg-secondary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                                        <CardHeader className="flex flex-row items-start justify-between gap-4 p-5">
                                            <div className="flex items-center gap-4">
                                                <Image src={project.icon} alt={project.name} width={48} height={48} className="rounded-lg border bg-secondary" data-ai-hint={project.dataAiHint} />
                                                <div>
                                                    <CardTitle className="text-base">{project.name}</CardTitle>
                                                    <p className="text-xs text-muted-foreground">{project.packageName}</p>
                                                </div>
                                            </div>

                                            <div className="absolute -top-11 -right-10 bg-primary/20 rounded-full flex items-center justify-center pointer-events-none group-hover:scale-110 group-hover:bg-primary/80 transition-transform p-12 duration-500">
                                                <ArrowRight className="absolute top-12 right-12 text-primary group-hover:text-primary-foreground group-hover:-rotate-45 duration-300" size={24} />
                                            </div>
                                        </CardHeader>

                                        <CardContent className="p-5 pt-0 space-y-5 flex-grow">
                                             <div className="flex flex-row items-center gap-2">
                                                <Badge variant={statusConfig.badgeVariant as any} className="text-xs">{project.status}</Badge>
                                                <Badge variant="outline" className="text-xs font-light">Started from: {project.startedFrom}</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Metric label="Testers Engaged" value={project.testersStarted} />
                                                <Metric label="Feedback Received" value={project.feedbackBreakdown.total} />
                                            </div>
                                        </CardContent>
                                    </div>
                                </Link>
                            </div>
                        )
                    }) : (
                        <div className="col-span-full text-center py-20 bg-background rounded-2xl">
                             <p className="text-muted-foreground">You haven't submitted any apps to the community yet.</p>
                             <Button asChild className="mt-4">
                                <Link href="/community-dashboard/submit">Submit Your First App</Link>
                             </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {totalPages > 1 && (
                <Pagination className="mt-8">
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
        </div>
      </div>
    </>
  )
}

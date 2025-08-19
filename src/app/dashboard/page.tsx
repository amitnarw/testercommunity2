
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { PlusCircle, Gem } from 'lucide-react'
import { ProjectList } from '@/components/project-list';
import Link from 'next/link';
import { Package, FlaskConical, CheckCircle2, Coins } from 'lucide-react';
import { useState } from 'react';
import { projects as allProjects } from '@/lib/data';
import type { Project } from '@/lib/types';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';


const PROJECTS_PER_PAGE = 6;

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = allProjects.slice(startIndex, endIndex);

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
              <h1 className="text-4xl font-bold">Developer Dashboard</h1>
              <p className="text-muted-foreground">Manage your apps and testing projects.</p>
            </div>
            <div className='flex items-center gap-2'>
              <Button asChild>
                <Link href="/dashboard/add-app">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New App
                </Link>
              </Button>
              <Button variant="outline" asChild>
                  <Link href="/pricing">
                      <Gem className="mr-2 h-4 w-4" /> Add More Points
                  </Link>
              </Button>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Apps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allProjects.length}</div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allProjects.filter(p => p.status === 'In Testing').length}</div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allProjects.filter(p => p.status === 'Completed').length}</div>
              </CardContent>
            </Card>
             <Card className="rounded-xl border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
              <ProjectList projects={currentProjects} />
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
      </div>
    </>
  )
}

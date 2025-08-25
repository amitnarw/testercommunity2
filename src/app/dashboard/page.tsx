
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { PlusCircle, Gem } from 'lucide-react'
import { ProjectList } from '@/components/project-list';
import Link from 'next/link';
import { Star, Activity } from 'lucide-react';
import { useState } from 'react';
import { projects as allProjects } from '@/lib/data';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';


const PROJECTS_PER_PAGE = 6;

const BentoCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-card rounded-2xl p-4 flex flex-col justify-between ${className}`}>
    {children}
  </div>
);

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
        <div className="container mx-auto px-4 md:px-6">
          <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent">Developer Dashboard</h1>
              <p className="text-muted-foreground">Manage your apps and testing projects.</p>
            </div>
          </header>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">

            <div className='flex flex-col gap-2 bg-card col-span-2 rounded-xl py-4 px-3'>
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><Activity className="w-4 h-4" /> Performance</CardTitle>
              <BentoCard className='grid gap-2 grid-cols-3 !p-0'>
                <Card className="rounded-xl border-0 bg-secondary px-3 py-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Apps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-0'>
                    <div className="text-2xl font-bold">{allProjects.length}</div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-0 bg-secondary px-3 py-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      In Testing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-0'>
                    <div className="text-2xl font-bold">{allProjects.filter(p => p.status === 'In Testing').length}</div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-0 bg-secondary px-3 py-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                  </CardHeader>
                  <CardContent className='p-0'>
                    <div className="text-2xl font-bold">{allProjects.filter(p => p.status === 'Completed').length}</div>
                  </CardContent>
                </Card>
              </BentoCard>

            </div>

            <Card className="rounded-xl border-0 bg-gradient-to-br from-primary to-primary/40 relative overflow-hidden col-span-1">
              <Star size={100} className='text-white/20 absolute -top-5 -right-5 rotate-45' />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">
                  Available Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">1,250</div>
              </CardContent>
            </Card>

            <BentoCard className='grid gap-2 grid-cols-1'>
              <Button asChild className='w-full h-full bg-gradient-to-br from-primary to-primary/40'>
                <Link href="/dashboard/add-app">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New App
                </Link>
              </Button>
              <Button variant="outline" asChild className='w-full h-full'>
                <Link href="/pricing">
                  <Gem className="mr-2 h-4 w-4" /> Add More Points
                </Link>
              </Button>
            </BentoCard>

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

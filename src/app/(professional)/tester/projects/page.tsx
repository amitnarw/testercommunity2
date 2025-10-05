
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import { projects } from '@/lib/data';
import type { Project } from "@/lib/types";
import { useState } from "react";
import { AppPagination } from "@/components/app-pagination";

const PROJECTS_PER_PAGE = 3;

const assignedProjects = projects.filter(p => p.status === "In Testing" || p.status === "Completed");
const availableProjects = projects.filter(p => p.status === "In Review");

const ProjectRow = ({ project }: { project: Project }) => {
    const isAssigned = assignedProjects.some(p => p.id === project.id);
    const earnings = project.pointsCost * 5; // Example conversion

    return (
        <div key={project.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={project.icon} data-ai-hint={project.dataAiHint} />
                    <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground truncate w-40">{project.packageName}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm text-right">
                    <p className="font-semibold text-primary">₹{earnings.toLocaleString('en-IN')}</p>
                </div>

                {isAssigned ? (
                    <Button variant="outline" size="icon" asChild>
                        <Link href="#">
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                ) : (
                    <Button variant="default" size="sm">
                        Apply
                    </Button>
                )}
            </div>
        </div>
    );
};

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
            <div className="space-y-4">
              {currentProjects.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </div>
            <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    );
}

export default function ProfessionalProjectsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">Manage your assigned projects and find new opportunities.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Assigned Projects</CardTitle>
            <CardDescription>
              These are the projects currently assigned to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PaginatedProjectList projects={assignedProjects} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Projects</CardTitle>
            <CardDescription>
              New projects from companies looking for your expertise.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PaginatedProjectList projects={availableProjects} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import { projects } from '@/lib/data';
import type { Project } from "@/lib/types";
import { useState } from "react";
import { AppPagination } from "@/components/app-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

const PROJECTS_PER_PAGE = 3;

const assignedProjects = projects.filter(p => p.status === "In Testing" || p.status === "Completed");
const availableProjects = projects.filter(p => p.status === "In Review");

const ProjectRow = ({ project }: { project: Project }) => {
    const isAssigned = assignedProjects.some(p => p.id === project.id);
    const earnings = project.pointsCost * 5; // Example conversion

    return (
        <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-secondary gap-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={project.icon} data-ai-hint={project.dataAiHint} />
                    <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground truncate w-40 sm:w-auto">{project.packageName}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-center">
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
    
    if (projects.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No projects in this category.</p>
    }

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
    const [activeTab, setActiveTab] = useState('assigned');

    const tabs = [
        { label: 'Assigned', value: 'assigned', count: assignedProjects.length },
        { label: 'Available', value: 'available', count: availableProjects.length },
    ];
    
  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">Manage your assigned projects and find new opportunities.</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="relative grid w-full grid-cols-2 bg-muted p-1 rounded-lg h-auto mb-6">
                     {tabs.map((tab) => {
                        const isSelected = activeTab === tab.value;
                        return (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`relative px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 ${isSelected ? 'text-foreground' : 'hover:bg-background/50'}`}
                            >
                                {isSelected && (
                                    <motion.span
                                        layoutId="pro-project-bubble"
                                        className="absolute inset-0 z-10 bg-background rounded-lg"
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

                <TabsContent value="assigned">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle>Assigned Projects</CardTitle>
                        <CardDescription>
                          These are the projects currently assigned to you.
                        </CardDescription>
                    </CardHeader>
                     <PaginatedProjectList projects={assignedProjects} />
                </TabsContent>
                <TabsContent value="available">
                     <CardHeader className="p-0 mb-4">
                        <CardTitle>Available Projects</CardTitle>
                        <CardDescription>
                          New projects from companies looking for your expertise.
                        </CardDescription>
                    </CardHeader>
                    <PaginatedProjectList projects={availableProjects} />
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

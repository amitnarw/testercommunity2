
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";

const PROJECTS_PER_PAGE = 4;

const ongoingProjects = projects.filter(p => p.status === "In Testing");
const availableProjects = projects.filter(p => p.status === "In Review" || p.status === "Completed");

const ProjectCard = ({ project, isOngoing }: { project: Project, isOngoing: boolean }) => {
    const earnings = project.pointsCost * 5; // Example conversion
    const daysCompleted = Math.floor(project.totalDays * (project.testersCompleted / project.testersStarted));

    return (
        <Card key={project.id} className="flex flex-col h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <Link href={`/tester/projects/${project.id}`}>
                <CardHeader className="flex flex-row items-start gap-4 p-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={project.icon} data-ai-hint={project.dataAiHint} />
                        <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base">{project.name}</CardTitle>
                        <CardDescription>{project.category}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                    {isOngoing && (
                        <div className="w-full">
                            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>Day {daysCompleted} / {project.totalDays}</span>
                            </div>
                            <Progress value={(daysCompleted / project.totalDays) * 100} className="h-2" />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="p-4 bg-gradient-to-t from-primary/20 to-primary/0 flex items-center justify-between">
                    <div className="text-sm text-right">
                        <p className="text-muted-foreground text-xs">Payout</p>
                        <p className="font-semibold text-primary">₹{earnings.toLocaleString('en-IN')}</p>
                    </div>
                    {isOngoing ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link href="#">
                                Continue Testing <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    ) : (
                        <Button variant="default" size="sm">
                            Apply
                        </Button>
                    )}
                </CardFooter>
            </Link>
        </Card>
    );
};

const PaginatedProjectList = ({ projects, isOngoing }: { projects: Project[], isOngoing: boolean }) => {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} isOngoing={isOngoing} />
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
    const [activeTab, setActiveTab] = useState('ongoing');

    const tabs = [
        { label: 'Ongoing', value: 'ongoing', count: ongoingProjects.length },
        { label: 'Available', value: 'available', count: availableProjects.length },
    ];
    
  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-0 sm:pt-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">Manage your assigned projects and find new opportunities.</p>
        </div>
      </div>
      
      <div>
        <CardContent className="p-0">
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

                <TabsContent value="ongoing">
                     <PaginatedProjectList projects={ongoingProjects} isOngoing={true} />
                </TabsContent>
                <TabsContent value="available">
                    <PaginatedProjectList projects={availableProjects} isOngoing={false} />
                </TabsContent>
            </Tabs>
        </CardContent>
      </div>
    </div>
  );
}

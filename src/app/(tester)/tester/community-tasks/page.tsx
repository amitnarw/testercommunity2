"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { TesterProjectResponse } from "@/lib/types";
import { useState } from "react";
import { AppPagination } from "@/components/app-pagination";
import { Progress } from "@/components/ui/progress";
import { useTesterProjects } from "@/hooks/useTester";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const PROJECTS_PER_PAGE = 6;

const TaskCard = ({ project }: { project: TesterProjectResponse }) => {
  const router = useRouter();

  const isOngoing =
    project.appStatus === "IN_TESTING" &&
    project.testerStatus === "IN_PROGRESS";

  const isCompleted = project.testerStatus === "COMPLETED";

  const openProjectDetails = (id: number) => {
    router.push(`/tester/projects/${id}`)
  }

  return (
    <Card
      key={project.id}
      className="flex flex-col h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={() => openProjectDetails(project.id)}
    >
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={project.appLogo} />
          <AvatarFallback>{project.appName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base">{project.appName}</CardTitle>
          <CardDescription>{project.category}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        {isOngoing && (
          <div className="w-full">
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>
                Day {project.daysCompleted} / {project.totalDay}
              </span>
            </div>
            <Progress
              value={(project.daysCompleted / project.totalDay) * 100}
              className="h-2"
            />
          </div>
        )}
        {isCompleted && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Completed</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-gradient-to-t from-amber-500/20 to-amber-500/0 flex items-center justify-between">
        <div></div>
        {isOngoing ? (
          <Button variant="outline" size="sm" asChild>
            <span>
              Continue Testing <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Button>
        ) : (
          <Button variant="default" size="sm">
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const TasksSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card
        key={i}
        className="flex flex-col h-full overflow-hidden rounded-2xl"
      >
        <CardHeader className="flex flex-row items-start gap-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <Skeleton className="h-2 w-full" />
        </CardContent>
        <CardFooter className="p-4 flex items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-28" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

const PaginatedTaskList = ({
  projects,
}: {
  projects: TesterProjectResponse[];
}) => {
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
    return (
      <p className="text-muted-foreground text-center py-8">
        No community tasks assigned to you yet.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentProjects.map((project) => (
          <TaskCard key={project.id} project={project} />
        ))}
      </div>
      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default function CommunityTasksPage() {
  const { data: projects, isLoading, isError, error } = useTesterProjects(undefined, "FREE");

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-0 sm:pt-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-amber-500 to-amber-500/40 bg-clip-text text-transparent leading-0 pb-[2px]">
            Community Tasks
          </h2>
          <p className="text-muted-foreground">
            Admin-assigned community apps for testing.
          </p>
        </div>
      </div>

      <div>
        <CardContent className="p-0">
          {isLoading ? (
            <TasksSkeleton />
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-500">
                Failed to load tasks: {error?.message}
              </p>
            </div>
          ) : (
            <PaginatedTaskList projects={projects || []} />
          )}
        </CardContent>
      </div>
    </div>
  );
}

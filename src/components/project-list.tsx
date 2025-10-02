

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "./ui/badge";
import Image from "next/image";
import { ArrowRight, FileWarning } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import type { Project } from "@/lib/types";
import { Button } from "./ui/button";

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
        case "Rejected":
            return {
                badgeVariant: "destructive",
            };
        case "Draft":
             return {
                badgeVariant: "secondary",
            };
        default:
            return {
                badgeVariant: "secondary",
            };
    }
}

const Metric = ({ label, value }: { label: string, value: string | number }) => (
    <div className="bg-secondary/50 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
    </div>
);


export function ProjectList({ projects }: { projects: Project[] }) {
    if (projects.length === 0) {
        return (
            <Card className="rounded-xl border-dashed bg-transparent shadow-sm flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                    <FileWarning className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Projects Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">There are no projects in this category.</p>
                </div>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
                const statusConfig = getStatusConfig(project.status);
                const isDraft = project.status === 'Draft';
                return (
                    <div key={project.id} className="group relative">
                        <Link href={isDraft ? `/dashboard/add-app/form?draft_id=${project.id}` : `/dashboard/project/${project.id}`}>
                            <div className="rounded-2xl overflow-hidden bg-background hover:bg-secondary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                                <CardHeader className="flex flex-row items-start justify-between gap-4 p-3 sm:p-5">
                                    <div className="flex items-center gap-4">
                                        <Image src={project.icon} alt={project.name} width={48} height={48} className="rounded-lg border bg-secondary" data-ai-hint={project.dataAiHint} />
                                        <div>
                                            <CardTitle className="text-base">{project.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{project.packageName}</p>
                                        </div>
                                    </div>

                                    <div className="absolute -top-11 -right-10 bg-gradient-to-bl from-primary/40 to-primary/0 rounded-full flex items-center justify-center pointer-events-none group-hover:scale-110 group-hover:from-primary group-hover:to-primary/20 transition-transform p-12 duration-500">
                                        <ArrowRight className="absolute top-12 right-12 text-primary group-hover:text-primary-foreground group-hover:-rotate-45 duration-300" size={24} />
                                    </div>
                                </CardHeader>

                                <CardContent className="p-3 sm:p-5 pt-0 space-y-5 flex-grow">
                                    <div className="flex flex-row items-center gap-2">
                                        <Badge variant={statusConfig.badgeVariant as any} className="text-xs">{project.status}</Badge>
                                        {!isDraft && <Badge variant="outline" className="text-xs font-light">Started from: {project.startedFrom}</Badge>}
                                    </div>
                                    {isDraft ? (
                                        <div className="text-center py-8">
                                            <p className="text-sm text-muted-foreground">This project is a draft.</p>
                                            <Button variant="link" className="mt-2">Complete Submission</Button>
                                        </div>
                                    ) : (
                                         <div className="grid grid-cols-2 gap-4">
                                            <Metric label="Testers Started" value={project.testersStarted} />
                                            <Metric label="Testers Completed" value={project.testersCompleted} />
                                        </div>
                                    )}
                                </CardContent>
                                {!isDraft && (
                                     <CardFooter className="px-5 pb-5 text-xs text-muted-foreground flex justify-between">
                                        <span>Days in test: <span className="font-bold text-foreground">{project.totalDays}</span></span>
                                        <span>Avg. testers/day: <span className="font-bold text-foreground">{project.avgTestersPerDay.toFixed(1)}</span></span>
                                    </CardFooter>
                                )}
                            </div>
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}
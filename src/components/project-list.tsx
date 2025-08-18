
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
import { MoreVertical, FileText, ArrowRight, Smartphone, Users, Bug, AlertTriangle, Timer, CheckCircle, FolderArchive } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { projects } from "@/lib/data";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

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


export function ProjectList() {
  return (
    <Card className="rounded-xl border-0">
        <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>An overview of your apps currently being tested or completed.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
                const statusConfig = getStatusConfig(project.status);
                return (
                    <Link href="#" key={project.name} className="group block h-full">
                        <div className="rounded-2xl overflow-hidden bg-background border-0 hover:bg-secondary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg h-full flex flex-col relative">
                           <div className="absolute top-4 right-4 h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                                <ArrowRight className="h-5 w-5 text-primary" />
                            </div>
                            <CardHeader className="flex flex-row items-start justify-between gap-4 p-5">
                                <div className="flex items-center gap-4">
                                    <Image src={project.icon} alt={project.name} width={48} height={48} className="rounded-lg border bg-secondary" data-ai-hint={project.dataAiHint} />
                                    <div>
                                        <CardTitle className="text-base">{project.name}</CardTitle>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Badge variant={statusConfig.badgeVariant as any} className="text-xs">{project.status}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 space-y-5 flex-grow">
                                <Separator />
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-secondary/50 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground">Testers</p>
                                        <p className="text-xl font-bold">{project.testerCount}</p>
                                    </div>
                                    <div className="bg-secondary/50 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground">Reports</p>
                                        <p className="text-xl font-bold">{project.reports}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </Link>
                )
            })}
        </CardContent>
    </Card>
  )
}

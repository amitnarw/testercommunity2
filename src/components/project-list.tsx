
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
                icon: <Timer className="text-destructive" />,
                badgeVariant: "destructive",
            };
        case "Completed":
            return {
                icon: <CheckCircle className="text-green-500" />,
                badgeVariant: "secondary",
            };
        case "Archived":
             return {
                icon: <FolderArchive className="text-muted-foreground" />,
                badgeVariant: "outline",
            };
        default:
            return {
                icon: <Timer className="text-muted-foreground" />,
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
                    <div key={project.name} className="group relative rounded-2xl overflow-hidden bg-background border hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
                         <CardHeader className="flex flex-row items-start justify-between gap-4 p-5">
                            <div className="flex items-center gap-4">
                                <Image src={project.icon} alt={project.name} width={48} height={48} className="rounded-lg border bg-secondary" data-ai-hint={project.dataAiHint} />
                                <div>
                                    <CardTitle className="text-base">{project.name}</CardTitle>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        {statusConfig.icon}
                                        <Badge variant={statusConfig.badgeVariant as any} className="text-xs">{project.status}</Badge>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="#">View Report <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 space-y-5">
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-medium text-muted-foreground">Test Timeline</span>
                                        <span className="text-xs font-bold">{project.timeline.daysLeft} days left</span>
                                    </div>
                                    <Progress value={project.timeline.progress} className="h-2"/>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {project.testers.slice(0, 3).map((tester, index) => (
                                                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                                    <AvatarImage src={tester.avatarUrl} data-ai-hint={tester.dataAiHint}/>
                                                    <AvatarFallback>{tester.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{project.testers.length} testers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs font-medium">{project.reports} reports</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />
                            
                             <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-secondary/50 rounded-lg p-2">
                                    <p className="text-xs text-muted-foreground">Crash Rate</p>
                                    <p className="text-lg font-bold">{project.crashRate}%</p>
                                </div>
                                 <div className="bg-secondary/50 rounded-lg p-2">
                                    <p className="text-xs text-muted-foreground">Top Bug</p>
                                    <p className="text-base font-semibold truncate">{project.topBugCategory}</p>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                )
            })}
        </CardContent>
    </Card>
  )
}

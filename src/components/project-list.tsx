
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
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { projects } from "@/lib/data";
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

const Metric = ({ label, value }: { label: string, value: string | number }) => (
    <div className="bg-secondary/50 rounded-lg p-3 text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);


export function ProjectList() {
    return (
        <Card className="rounded-xl border-0 bg-transparent shadow-none">
            <CardHeader>
                <CardTitle>Your Projects</CardTitle>
                <CardDescription>An overview of your apps currently being tested or completed.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    return (
                        <div key={project.name} className="group relative">
                            <Link href="#">
                                <div className="rounded-2xl overflow-hidden bg-background border-0 hover:bg-secondary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                                    <CardHeader className="flex flex-row items-start justify-between gap-4 p-5">
                                        <div className="flex items-center gap-4">
                                            <Image src={project.icon} alt={project.name} width={48} height={48} className="rounded-lg border bg-secondary" data-ai-hint={project.dataAiHint} />
                                            <div>
                                                <CardTitle className="text-base">{project.name}</CardTitle>
                                                <p className="text-xs text-muted-foreground">{project.packageName}</p>
                                            </div>
                                        </div>

                                        <div className="absolute -top-9 -right-7 bg-primary/20 rounded-full flex items-center justify-center pointer-events-none group-hover:scale-110 group-hover:bg-primary/80 transition-transform p-10">
                                            <ArrowRight className="text-primary group-hover:text-primary-foreground absolute top-10 right-10" size={24} />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-5 pt-0 space-y-5 flex-grow">
                                        <div className="flex flex-row items-center gap-2">
                                            <Badge variant={statusConfig.badgeVariant as any} className="text-xs">{project.status}</Badge>
                                            <Badge variant="outline" className="text-xs font-light">Started from: 22 Aug 2025</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Metric label="Testers Started" value={project.testersStarted} />
                                            <Metric label="Testers Completed" value={project.testersCompleted} />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-5 pb-5 text-xs text-muted-foreground flex justify-between">
                                        <span>Days in test: <span className="font-bold text-foreground">{project.totalDays}</span></span>
                                        <span>Avg. testers/day: <span className="font-bold text-foreground">{project.avgTestersPerDay.toFixed(1)}</span></span>
                                    </CardFooter>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

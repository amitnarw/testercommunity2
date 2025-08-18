
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
import { MoreVertical, FileText } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const projects = [
  {
    name: "Project Phoenix",
    icon: "https://placehold.co/40x40.png",
    dataAiHint: "phoenix bird",
    status: "In Testing",
    reports: 42,
  },
  {
    name: "SocialConnect App",
    icon: "https://placehold.co/40x40.png",
    dataAiHint: "social media",
    status: "In Testing",
    reports: 15,
  },
  {
    name: "E-commerce Platform",
    icon: "https://placehold.co/40x40.png",
    dataAiHint: "shopping cart",
    status: "Completed",
    reports: 128,
  },
  {
    name: "HealthTracker API",
    icon: "https://placehold.co/40x40.png",
    dataAiHint: "heartbeat chart",
    status: "Completed",
    reports: 76,
  },
    {
    name: "IndieGame 'Starlight'",
    icon: "https://placehold.co/40x40.png",
    dataAiHint: "pixel art star",
    status: "Completed",
    reports: 210,
  },
]

export function ProjectList() {
  return (
    <Card className="rounded-xl">
        <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>An overview of your apps currently being tested or completed.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <Card key={project.name} className="flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-start justify-between gap-4 p-4">
                        <div className="flex items-center gap-4">
                             <Image src={project.icon} alt={project.name} width={48} height={48} className="rounded-lg border" data-ai-hint={project.dataAiHint} />
                             <div>
                                <CardTitle className="text-base">{project.name}</CardTitle>
                                <Badge variant={project.status === "In Testing" ? "destructive" : "secondary"} className="mt-1">{project.status}</Badge>
                             </div>
                        </div>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-grow p-4 pt-0">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-secondary/50 rounded-lg">
                            <FileText className="h-4 w-4" />
                            <span>{project.reports} reports received</span>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-secondary/30 p-2">
                        <Button variant="ghost" className="w-full h-auto py-2" asChild>
                            <Link href="#">View Details</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </CardContent>
    </Card>
  )
}

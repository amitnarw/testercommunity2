
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { Button } from "./ui/button";

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
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[300px]">App</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project) => (
                    <TableRow key={project.name}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                                <Image src={project.icon} alt={project.name} width={40} height={40} className="rounded-md" data-ai-hint={project.dataAiHint} />
                                <span>{project.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={project.status === "In Testing" ? "destructive" : "secondary"}>
                                {project.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{project.reports}</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
      </CardContent>
    </Card>
  )
}

    
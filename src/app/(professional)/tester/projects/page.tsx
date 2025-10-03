
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import Link from 'next/link';

const assignedProjects = [
    { id: 1, name: "Project Phoenix", company: "Stark Industries", earnings: 5000, status: "In Progress", daysLeft: 5, icon: "/logo-1.png", dataAiHint: "phoenix bird" },
    { id: 2, name: "QuantumLeap CRM", company: "Wayne Enterprises", earnings: 7500, status: "Pending", daysLeft: 14, icon: "/logo-2.png", dataAiHint: "quantum atom" },
    { id: 3, name: "Nexus Browser", company: "Cyberdyne Systems", earnings: 6000, status: "Completed", daysLeft: 0, icon: "/logo-3.png", dataAiHint: "network globe" },
];

const availableProjects = [
    { id: 4, name: "Odyssey Social", company: "Globex Corporation", earnings: 8000, expertise: "Social Media", icon: "/logo-1.png", dataAiHint: "compass logo" },
    { id: 5, name: "Visionary OS", company: "Omni Consumer Products", earnings: 12000, expertise: "OS Testing", icon: "/logo-2.png", dataAiHint: "eye logo" },
    { id: 6, name: "Starlight Editor", company: "Oscorp", earnings: 9500, expertise: "Performance", icon: "/logo-3.png", dataAiHint: "starburst logo" },
]

export default function ProfessionalProjectsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">Manage your assigned projects and find new opportunities.</p>
        </div>
      </div>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Assigned Projects</CardTitle>
            <CardDescription>
              These are the projects currently assigned to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedProjects.map((project) => (
                <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-secondary">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <Avatar className="h-10 w-10">
                          <AvatarImage src={project.icon} data-ai-hint={project.dataAiHint} />
                          <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-semibold">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                        <Badge variant={project.status === "Completed" ? "secondary" : "default"} className="py-1 px-3 rounded-lg">
                            {project.status === 'In Progress' && <Clock className="mr-2 h-3 w-3" />}
                            {project.status === 'Completed' && <CheckCircle className="mr-2 h-3 w-3" />}
                            {project.status}
                        </Badge>
                        <div className="text-sm text-right sm:text-left">
                            <p className="font-semibold text-primary">₹{project.earnings.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-muted-foreground">Payout</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="#">
                                View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Projects</CardTitle>
            <CardDescription>
              New projects from companies looking for your expertise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableProjects.map((project) => (
                 <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-secondary">
                   <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <Avatar className="h-10 w-10">
                          <AvatarImage src={project.icon} data-ai-hint={project.dataAiHint} />
                          <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-semibold">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.company}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                        <Badge variant="outline" className="py-1 px-3 rounded-lg">{project.expertise}</Badge>
                        <div className="text-sm text-right sm:text-left">
                            <p className="font-semibold text-primary">₹{project.earnings.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-muted-foreground">Payout</p>
                        </div>
                        <Button variant="default" size="sm">
                            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

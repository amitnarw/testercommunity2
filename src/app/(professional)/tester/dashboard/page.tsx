
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, DollarSign, Search, Briefcase } from "lucide-react";
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartData = [
  { month: "Jan", earnings: 1860 },
  { month: "Feb", earnings: 3050 },
  { month: "Mar", earnings: 2370 },
  { month: "Apr", earnings: 730 },
  { month: "May", earnings: 2090 },
  { month: "Jun", earnings: 2140 },
]
const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "hsl(var(--chart-1))",
  },
}

const assignedProjects = [
    { id: 1, name: "Project Phoenix", company: "Stark Industries", earnings: 5000, status: "In Progress", daysLeft: 5, icon: "/logo-1.png", dataAiHint: "phoenix bird" },
    { id: 2, name: "QuantumLeap CRM", company: "Wayne Enterprises", earnings: 7500, status: "Pending", daysLeft: 14, icon: "/logo-2.png", dataAiHint: "quantum atom" },
    { id: 3, name: "Nexus Browser", company: "Cyberdyne Systems", earnings: 6000, status: "Completed", daysLeft: 0, icon: "/logo-3.png", dataAiHint: "network globe" },
];

const availableProjects = [
    { id: 4, name: "Odyssey Social", company: "Globex Corporation", earnings: 8000, expertise: "Social Media", icon: "/logo-1.png", dataAiHint: "compass logo" },
    { id: 5, name: "Visionary OS", company: "Omni Consumer Products", earnings: 12000, expertise: "OS Testing", icon: "/logo-2.png", dataAiHint: "eye logo" },
]

export default function ProfessionalDashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Pro Tester Dashboard</h2>
            <p className="text-muted-foreground">Your central hub for professional testing projects.</p>
        </div>
         <Button asChild>
            <Link href="/professional/projects">
                <Briefcase className="mr-2 h-4 w-4" /> View All Projects
            </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,52,310</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">+18 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">3 pending invitations</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <Card className="lg:col-span-3">
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
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                 <CardDescription>Your earnings for the last 6 months.</CardDescription>
              </CardHeader>
              <CardContent>
                 <ChartContainer config={chartConfig} className="min-h-60 w-full">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
        </div>

      <div>
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

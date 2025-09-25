
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, DollarSign } from "lucide-react";

const assignedProjects = [
    { id: 1, name: "Project Phoenix", company: "Stark Industries", earnings: 50, status: "In Progress", daysLeft: 5, icon: "/logo-1.png", dataAiHint: "phoenix bird" },
    { id: 2, name: "QuantumLeap CRM", company: "Wayne Enterprises", earnings: 75, status: "Pending", daysLeft: 14, icon: "/logo-2.png", dataAiHint: "quantum atom" },
    { id: 3, name: "Nexus Browser", company: "Cyberdyne Systems", earnings: 60, status: "Completed", daysLeft: 0, icon: "/logo-3.png", dataAiHint: "network globe" },
];

export default function ProfessionalDashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Pro Tester Dashboard</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231.89</div>
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
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
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

      <div>
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
                <div key={project.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                   <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                          <AvatarImage src={project.icon} data-ai-hint={project.dataAiHint} />
                          <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-semibold">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.company}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                        <Badge variant={project.status === "Completed" ? "secondary" : "default"}>{project.status}</Badge>
                        <div className="text-sm">
                            <p className="font-semibold text-primary">₹{project.earnings}</p>
                            <p className="text-xs text-muted-foreground">Payout</p>
                        </div>
                        <Button variant="outline" size="sm">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
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

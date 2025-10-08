
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bell, Briefcase, CheckCircle, DollarSign, ListFilter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const allActivities = [
    { id: 1, type: "payment", description: "Payment for 'Project Phoenix' processed.", date: "2024-08-01T10:30:00Z" },
    { id: 2, type: "completion", description: "Testing for 'Nexus Browser' completed.", date: "2024-07-28T15:00:00Z" },
    { id: 3, type: "invitation", description: "You were invited to test 'Odyssey Social'.", date: "2024-07-25T09:00:00Z" },
    { id: 4, type: "payment", description: "Payment for 'Visionary OS' processed.", date: "2024-07-15T11:00:00Z" },
    { id: 5, type: "completion", description: "Testing for 'Helios Platform' completed.", date: "2024-07-10T18:00:00Z" },
    { id: 6, type: "invitation", description: "Invitation to test 'Starlight Editor'.", date: "2024-07-08T14:30:00Z" },
    { id: 7, type: "payment", description: "Payment for 'QuantumLeap CRM' processed.", date: "2024-07-01T12:00:00Z" },
    { id: 8, type: "completion", description: "Testing for 'Project Chimera' completed.", date: "2024-06-25T16:45:00Z" },
];

const ActivityIcon = ({ type }: { type: string }) => {
    switch (type) {
        case "payment": return <DollarSign className="w-5 h-5 text-green-500" />;
        case "completion": return <CheckCircle className="w-5 h-5 text-blue-500" />;
        case "invitation": return <Briefcase className="w-5 h-5 text-purple-500" />;
        default: return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
};

export default function ProfessionalActivitiesPage() {
    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-0 sm:pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Activities</h2>
                    <p className="text-muted-foreground">A complete log of your professional testing activities.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search activities..." className="pl-8 w-full md:w-[300px]" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <ListFilter className="h-4 w-4" /> Filter by Type
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Payments</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Completions</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Invitations</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]"></TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allActivities.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell>
                                        <div className="p-2 bg-secondary rounded-full inline-flex">
                                            <ActivityIcon type={activity.type} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{activity.description}</TableCell>
                                    <TableCell>{new Date(activity.date).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">{activity.type}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

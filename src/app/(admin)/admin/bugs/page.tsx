
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Bug, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const bugReports = [
    { id: 1, bug: "App crashes on launch", app: "QuantumLeap CRM", reporter: "Peter Parker", date: "2024-08-20", severity: "Critical", status: "New" },
    { id: 2, bug: "Cannot upload profile picture", app: "Odyssey Social", reporter: "Diana Prince", date: "2024-08-19", severity: "High", status: "In Progress" },
    { id: 3, bug: "Incorrect price calculation in cart", app: "Nexus Browser", reporter: "Clark Kent", date: "2024-08-18", severity: "Medium", status: "Resolved" },
    { id: 4, bug: "UI elements overlap on tablet", app: "Project Phoenix", reporter: "Bruce Wayne", date: "2024-08-17", severity: "Low", status: "Resolved" },
    { id: 5, bug: "Slow loading of main feed", app: "Odyssey Social", reporter: "Tony Stark", date: "2024-08-16", severity: "High", status: "New" },
];

const SeverityBadge = ({ severity }: { severity: string }) => {
    switch (severity) {
        case 'Critical': return <Badge variant="destructive" className="bg-red-700 hover:bg-red-800">{severity}</Badge>;
        case 'High': return <Badge variant="destructive">{severity}</Badge>;
        case 'Medium': return <Badge variant="secondary" className="bg-amber-500/80 hover:bg-amber-600 text-white">{severity}</Badge>;
        case 'Low': return <Badge variant="secondary" className="bg-yellow-500/80 hover:bg-yellow-600 text-white">{severity}</Badge>;
        default: return <Badge variant="outline">{severity}</Badge>;
    }
};

export default function AdminBugReportsPage() {
    const [filter, setFilter] = useState('All');
    const filteredBugs = bugReports.filter(b => filter === 'All' || b.status === filter);

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bug Reports</h2>
                    <p className="text-muted-foreground">Triage, assign, and track all reported issues.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Reports</CardTitle>
                        <Bug className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bugReports.filter(b => b.status === 'New').length}</div>
                        <p className="text-xs text-muted-foreground">Awaiting triage</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Bugs</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bugReports.filter(b => b.severity === 'Critical').length}</div>
                        <p className="text-xs text-muted-foreground">Require immediate attention</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved This Week</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+5 from last week</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search bug reports..." className="pl-8 w-full md:w-[300px]" />
                        </div>
                        <Tabs defaultValue="All" onValueChange={setFilter} className="w-full md:w-auto">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="All">All</TabsTrigger>
                                <TabsTrigger value="New">New</TabsTrigger>
                                <TabsTrigger value="In Progress">In Progress</TabsTrigger>
                                <TabsTrigger value="Resolved">Resolved</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bug Summary</TableHead>
                                <TableHead className="hidden sm:table-cell">Application</TableHead>
                                <TableHead className="hidden md:table-cell">Reporter</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBugs.map(bug => (
                                <TableRow key={bug.id}>
                                    <TableCell className="font-medium">{bug.bug}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{bug.app}</TableCell>
                                    <TableCell className="hidden md:table-cell">{bug.reporter}</TableCell>
                                    <TableCell>
                                        <SeverityBadge severity={bug.severity} />
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={bug.status === 'Resolved' ? 'secondary' : 'outline'}
                                            className={bug.status === 'Resolved' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                                        >
                                            {bug.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Assign to Developer</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Close Report</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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

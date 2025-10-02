
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Lightbulb, PlusCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const suggestionItems = [
    { id: 1, user: "Tony Stark", role: "Developer", suggestion: "Add a 'duplicate project' button to easily re-run tests.", date: "2024-08-20", status: "Received" },
    { id: 2, user: "Harley Quinn", role: "Tester", suggestion: "Gamify the bug reporting process with points for quality.", date: "2024-08-19", status: "Planned" },
    { id: 3, user: "Bruce Wayne", role: "Developer", suggestion: "Integrate with GitHub Actions to trigger tests on PR.", date: "2024-08-18", status: "In Development" },
    { id: 4, user: "Diana Prince", role: "Tester", suggestion: "Show tester leaderboards for the month.", date: "2024-08-17", status: "Shipped" },
    { id: 5, user: "Peter Parker", role: "Tester", suggestion: "Add a way to directly message developers from a bug report.", date: "2024-08-16", status: "Received" },
];

export default function AdminSuggestionsPage() {
    const [filter, setFilter] = useState('All');
    const filteredSuggestions = suggestionItems.filter(s => filter === 'All' || s.status === filter);

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Feature Suggestions</h2>
                    <p className="text-muted-foreground">Manage new feature ideas and suggestions from the community.</p>
                </div>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Suggestion Manually
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search suggestions..." className="pl-8 w-full md:w-[300px]" />
                        </div>
                        <Tabs defaultValue="All" onValueChange={setFilter} className="w-full md:w-auto">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="All">All</TabsTrigger>
                                <TabsTrigger value="Received">Received</TabsTrigger>
                                <TabsTrigger value="Planned">Planned</TabsTrigger>
                                <TabsTrigger value="In Development">In Dev</TabsTrigger>
                                <TabsTrigger value="Shipped">Shipped</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden sm:table-cell">Role</TableHead>
                                <TableHead className="hidden md:table-cell w-2/5">Suggestion</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSuggestions.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.user}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                         <Badge variant={item.role === "Developer" ? "default" : "secondary"}>{item.role}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">{item.suggestion}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={item.status === 'Shipped' ? 'secondary' : 'outline'}
                                            className={item.status === 'Shipped' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                                        >
                                            {item.status}
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
                                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Delete Suggestion</DropdownMenuItem>
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

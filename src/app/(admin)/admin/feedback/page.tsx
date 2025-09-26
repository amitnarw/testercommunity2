
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, MessageSquare, PlusCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const feedbackItems = [
    { id: 1, user: "Peter Parker", role: "Tester", feedback: "The dashboard loading speed is a bit slow on mobile.", date: "2024-08-20", status: "New" },
    { id: 2, user: "Diana Prince", role: "Tester", feedback: "Would be great to have a dark mode for the community hub.", date: "2024-08-19", status: "Implemented" },
    { id: 3, user: "Clark Kent", role: "Developer", feedback: "The submission form timed out once, lost all my data.", date: "2024-08-18", status: "Under Review" },
    { id: 4, user: "Bruce Wayne", role: "Developer", feedback: "The analytics chart on the project page is very helpful!", date: "2024-08-17", status: "Reviewed" },
    { id: 5, user: "Tony Stark", role: "Developer", feedback: "API documentation for integrations would be a game-changer.", date: "2024-08-16", status: "New" },
];

export default function AdminFeedbackPage() {
    const [filter, setFilter] = useState('All');
    const filteredFeedback = feedbackItems.filter(f => filter === 'All' || f.status === filter);

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Platform Feedback</h2>
                    <p className="text-muted-foreground">Review and manage feedback submitted by users about the inTesters platform.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Feedback Manually
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search feedback..." className="pl-8 w-full md:w-[300px]" />
                        </div>
                        <Tabs defaultValue="All" onValueChange={setFilter} className="w-full md:w-auto">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="All">All</TabsTrigger>
                                <TabsTrigger value="New">New</TabsTrigger>
                                <TabsTrigger value="Under Review">In Review</TabsTrigger>
                                <TabsTrigger value="Reviewed">Reviewed</TabsTrigger>
                                <TabsTrigger value="Implemented">Implemented</TabsTrigger>
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
                                <TableHead className="hidden md:table-cell w-2/5">Feedback</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFeedback.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.user}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                         <Badge variant={item.role === "Developer" ? "default" : "secondary"}>{item.role}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">{item.feedback}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={item.status === 'Implemented' ? 'secondary' : 'outline'}
                                            className={item.status === 'Implemented' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
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
                                                <DropdownMenuItem>Change Status</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Delete Feedback</DropdownMenuItem>
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


'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal } from "lucide-react";
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const submissions = [
    { id: 1, name: "QuantumLeap CRM", developer: "Stark Industries", date: "2024-08-15", status: "In Review", type: "Community" },
    { id: 2, name: "Project Phoenix", developer: "Wayne Enterprises", date: "2024-08-14", status: "Approved", type: "Professional" },
    { id: 3, name: "Nexus Browser", developer: "Cyberdyne Systems", date: "2024-08-12", status: "Rejected", type: "Community" },
    { id: 4, name: "Odyssey Social", developer: "Globex Corporation", date: "2024-08-11", status: "Approved", type: "Professional" },
    { id: 5, name: "Starlight Editor", developer: "Oscorp", date: "2024-08-10", status: "In Review", type: "Community" },
    { id: 6, name: "Helios Platform", developer: "Tyrell Corporation", date: "2024-08-09", status: "Approved", type: "Community" },
];

export default function AdminSubmissionsPage() {
    const [filter, setFilter] = useState('All');

    const filteredSubmissions = submissions.filter(s => filter === 'All' || s.status === filter);

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Submissions</h2>
                    <p className="text-muted-foreground">Review, approve, or reject developer app submissions.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search submissions..." className="pl-8 w-full md:w-[300px]" />
                        </div>
                         <Tabs defaultValue="All" onValueChange={setFilter} className="w-full md:w-auto">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="All">All</TabsTrigger>
                                <TabsTrigger value="In Review">Pending</TabsTrigger>
                                <TabsTrigger value="Approved">Approved</TabsTrigger>
                                <TabsTrigger value="Rejected">Rejected</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Application</TableHead>
                                <TableHead className="hidden sm:table-cell">Developer</TableHead>
                                <TableHead className="hidden md:table-cell">Submission Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubmissions.map(submission => (
                                <TableRow key={submission.id}>
                                    <TableCell className="font-medium">{submission.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{submission.developer}</TableCell>
                                    <TableCell className="hidden md:table-cell">{submission.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={submission.type === "Professional" ? "default" : "secondary"}>{submission.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={submission.status === 'Rejected' ? 'destructive' : 'secondary'}
                                            className={submission.status === 'Approved' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                                        >
                                            {submission.status}
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
                                                <Link href={`/admin/submissions/${submission.id}`}>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem>Mark as Urgent</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Archive</DropdownMenuItem>
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

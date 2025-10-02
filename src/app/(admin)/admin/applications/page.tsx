
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal } from "lucide-react";
import Link from 'next/link';

const applications = [
    { id: 1, name: "Maria Garcia", email: "maria@example.com", date: "2024-08-20", experience: "3-5 years", expertise: ["Manual", "Usability"] },
    { id: 2, name: "David Kim", email: "david@example.com", date: "2024-08-19", experience: "5+ years", expertise: ["Automation", "Performance", "API"] },
    { id: 3, name: "Alex Johnson", email: "alex@example.com", date: "2024-08-18", experience: "1-3 years", expertise: ["Manual"] },
    { id: 4, name: "Priya Patel", email: "priya@example.com", date: "2024-08-17", experience: "3-5 years", expertise: ["Security", "Manual"] },
    { id: 5, name: "Michael Chen", email: "michael@example.com", date: "2024-08-16", experience: "5+ years", expertise: ["Automation", "API", "Performance"] },
];

export default function AdminApplicationsPage() {
    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tester Applications</h2>
                    <p className="text-muted-foreground">Review and process applications from prospective professional testers.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search applications..." className="pl-8 w-full md:w-[300px]" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Applicant</TableHead>
                                <TableHead className="hidden sm:table-cell">Email</TableHead>
                                <TableHead className="hidden md:table-cell">Submitted</TableHead>
                                <TableHead>Experience</TableHead>
                                <TableHead>Expertise</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map(app => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{app.email}</TableCell>
                                    <TableCell className="hidden md:table-cell">{app.date}</TableCell>
                                    <TableCell>{app.experience}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {app.expertise.map(e => <Badge key={e} variant="secondary">{e}</Badge>)}
                                        </div>
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
                                                <Link href="#">
                                                    <DropdownMenuItem>View Application</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem className="text-green-600 focus:text-green-600 focus:bg-green-500/10">Approve</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Reject</DropdownMenuItem>
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

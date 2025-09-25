
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const users = [
    { id: 1, name: "Tony Stark", email: "tony@stark.io", role: "Developer", status: "Active", avatar: "https://i.pravatar.cc/150?u=tony" },
    { id: 2, name: "Bruce Wayne", email: "bruce@wayne.com", role: "Developer", status: "Active", avatar: "https://i.pravatar.cc/150?u=bruce" },
    { id: 3, name: "Peter Parker", email: "peter@dailybugle.com", role: "Tester", status: "Active", avatar: "https://i.pravatar.cc/150?u=peter" },
    { id: 4, name: "Diana Prince", email: "diana@them.com", role: "Tester", status: "Inactive", avatar: "https://i.pravatar.cc/150?u=diana" },
    { id: 5, name: "Clark Kent", email: "clark@dailyplanet.com", role: "Tester", status: "Active", avatar: "https://i.pravatar.cc/150?u=clark" },
    { id: 6, name: "Harley Quinn", email: "harleen@arkham.net", role: "Admin", status: "Banned", avatar: "https://i.pravatar.cc/150?u=harley" },
];

export default function AdminUsersPage() {
    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">View, manage, and take action on user accounts.</p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Add New User
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search users by name or email..." className="pl-8 w-full md:w-[300px]" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                    <TableCell>
                                         <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.status === 'Banned' ? 'destructive' : 'secondary'}
                                            className={user.status === 'Active' ? 'bg-green-500/20 text-green-700' : ''}
                                        >
                                            {user.status}
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
                                                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                                                <DropdownMenuItem>View Activity</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10">Ban User</DropdownMenuItem>
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


'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, UserPlus, Shield, UserCog, Briefcase, Users2, CheckCircle, Ban, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const usersData = [
    { id: 1, name: "Tony Stark", email: "tony@stark.io", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?u=tony", testingPaths: ["Professional"] },
    { id: 2, name: "Bruce Wayne", email: "bruce@wayne.com", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?u=bruce", testingPaths: ["Professional", "Community"] },
];

const testersData = [
    { id: 3, name: "Peter Parker", email: "peter@dailybugle.com", role: "Tester", status: "Active", avatar: "https://i.pravatar.cc/150?u=peter", testingPaths: ["Community"] },
    { id: 4, name: "Diana Prince", email: "diana@them.com", role: "Tester", status: "Inactive", avatar: "https://i.pravatar.cc/150?u=diana", testingPaths: ["Community"] },
    { id: 5, name: "Clark Kent", email: "clark@dailyplanet.com", role: "Tester", status: "Active", avatar: "https://i.pravatar.cc/150?u=clark", testingPaths: ["Community", "Professional"] },
    { id: 6, name: "Harley Quinn", email: "harleen@arkham.net", role: "Tester", status: "Banned", avatar: "https://i.pravatar.cc/150?u=harley", testingPaths: ["Community"] },
];

const staffData = [
    { id: 7, name: "Nick Fury", email: "nick@shield.org", role: "Super Admin", status: "Active", avatar: "https://i.pravatar.cc/150?u=nick", testingPaths: [] },
    { id: 8, name: "Maria Hill", email: "maria@shield.org", role: "Admin", status: "Active", avatar: "https://i.pravatar.cc/150?u=maria", testingPaths: [] },
    { id: 9, name: "Phil Coulson", email: "phil@shield.org", role: "Moderator", status: "Active", avatar: "https://i.pravatar.cc/150?u=phil", testingPaths: [] },
]

type User = typeof usersData[0];

const UserTable = ({ users, onEdit, onStatusChange, onDelete }: { users: User[], onEdit: (user: User) => void, onStatusChange: (user: User) => void, onDelete: (user: User) => void }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden lg:table-cell">Testing Paths</TableHead>
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
                         <Badge variant={user.role === "User" || user.role === "Tester" ? "secondary" : "default"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        <div className="flex gap-1">
                        {user.testingPaths.map(path => (
                            <Badge key={path} variant="outline" className="flex items-center gap-1.5">
                                {path === 'Professional' ? <Briefcase className="w-3 h-3" /> : <Users2 className="w-3 h-3" />}
                                {path}
                            </Badge>
                        ))}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge
                            variant={user.status === 'Banned' || user.status === 'Inactive' ? 'destructive' : 'secondary'}
                            className={user.status === 'Active' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
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
                                <Link href={`/admin/users/${user.id}`}><DropdownMenuItem>View Details</DropdownMenuItem></Link>
                                <DropdownMenuItem onClick={() => onEdit(user)}>Edit Role</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onStatusChange(user)}>Change Status</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => onDelete(user)}>Delete User</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);


export default function AdminUsersPage() {
    const [userRole, setUserRole] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        const role = document.cookie.split('; ').find(row => row.startsWith('userRole='))?.split('=')[1] || '';
        setUserRole(decodeURIComponent(role));
    }, []);

    const isSuperAdmin = userRole === 'Super Admin';

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };
    
    const handleStatusChange = (user: User) => {
        setSelectedUser(user);
        setIsStatusModalOpen(true);
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    }
    
    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">View, manage, and take action on all user accounts.</p>
                </div>
                <Button><UserPlus className="mr-2 h-4 w-4" /> Add New User</Button>
            </div>
            
            <Tabs defaultValue="users" className="w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search users..." className="pl-8 w-full md:w-[300px]" />
                    </div>
                    <TabsList className="grid w-full md:w-auto grid-cols-3">
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="testers">Testers</TabsTrigger>
                        <TabsTrigger value="staff">Staff</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="users" className="mt-4">
                     <Card>
                        <CardContent className="pt-6">
                           <UserTable users={usersData} onEdit={handleEdit} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="testers" className="mt-4">
                     <Card>
                        <CardContent className="pt-6">
                           <UserTable users={testersData as any} onEdit={handleEdit} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="staff" className="mt-4">
                     <Card>
                        <CardContent className="pt-6">
                           <UserTable users={staffData as any} onEdit={handleEdit} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

             {/* Edit Role Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Role for {selectedUser?.name}</DialogTitle>
                        <DialogDescription>
                            Change the user's role. This will affect their permissions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                         <Select defaultValue={selectedUser?.role}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="User">User</SelectItem>
                                <SelectItem value="Tester">Tester</SelectItem>
                                <SelectItem value="Moderator">Moderator</SelectItem>
                                <SelectItem value="Admin" disabled={!isSuperAdmin}>Admin {!isSuperAdmin && "(Super Admin only)"}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsEditModalOpen(false)}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Status Modal */}
            <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Status for {selectedUser?.name}</DialogTitle>
                        <DialogDescription>
                            Update the user's account status. Banning a user will prevent them from logging in.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex flex-col gap-4">
                        <Button 
                            variant={selectedUser?.status === 'Active' ? 'outline' : 'default'}
                            className="w-full justify-start gap-2"
                        >
                            <CheckCircle className="h-4 w-4" /> Activate Account
                        </Button>
                        <Button 
                            variant={selectedUser?.status === 'Banned' ? 'destructive' : 'outline'} 
                            className="w-full justify-start gap-2"
                        >
                            <Ban className="h-4 w-4" /> Ban Account
                        </Button>
                     </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             {/* Delete User Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {selectedUser?.name}?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the user's account and all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => setIsDeleteModalOpen(false)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}

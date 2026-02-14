'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, CheckCircle, Ban, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { AppPagination } from '@/components/app-pagination';
import { useAllUsers, useUserCounts, useUpdateUserStatus, useUpdateUserRole } from '@/hooks/useAdmin';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 5;

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
    return (
        <Badge
            variant={status === 'Banned' || status === 'Inactive' ? 'destructive' : 'secondary'}
            className={status === 'Active' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
        >
            {status}
        </Badge>
    );
}

// Role Badge Component
function RoleBadge({ role }: { role: string }) {
    // Helper function to format role name for display
    const formatRoleName = (roleName: string): string => {
        const roleDisplayNames: Record<string, string> = {
            'super_admin': 'Super Admin',
            'admin': 'Admin',
            'moderator': 'Moderator',
            'support': 'Support',
            'tester': 'Tester',
            'user': 'User',
        };
        return roleDisplayNames[roleName] || roleName;
    };

    const getRoleStyles = () => {
        switch (role) {
            case 'super_admin':
                return 'bg-purple-500/20 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
            case 'admin':
                return 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
            case 'moderator':
                return 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
            case 'support':
                return 'bg-pink-500/20 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400';
            case 'tester':
                return 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400';
            default:
                return 'bg-secondary text-secondary-foreground';
        }
    };

    return (
        <Badge variant="outline" className={getRoleStyles()}>
            {formatRoleName(role)}
        </Badge>
    );
}

// Skeleton Row Component
const SkeletonRow = () => (
    <TableRow>
        <TableCell>
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 md:hidden" />
                </div>
            </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">
            <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell>
            <Skeleton className="h-5 w-16" />
        </TableCell>
        <TableCell>
            <Skeleton className="h-5 w-14" />
        </TableCell>
        <TableCell className="text-right">
            <Skeleton className="h-8 w-8 rounded-md ml-auto" />
        </TableCell>
    </TableRow>
);

// User Table Component
const UserTable = ({ users, onEdit, onStatusChange, isLoading }: { 
    users: any[]; 
    onEdit: (user: any) => void; 
    onStatusChange: (user: any) => void;
    isLoading: boolean;
}) => {
    if (isLoading) {
        return (
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
                    {[...Array(5)].map((_, i) => (
                        <SkeletonRow key={i} />
                    ))}
                </TableBody>
            </Table>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No users found.
            </div>
        );
    }

    return (
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
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.image} />
                                    <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">{user.name}</span>
                                    <span className="text-xs text-muted-foreground md:hidden">{user.email}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                        <TableCell>
                            <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>
                            <StatusBadge status={user.status} />
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
                                    <Link href={`/admin/users/${user.id}`}>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem onClick={() => onEdit(user)}>Edit Role</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onStatusChange(user)}>Change Status</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    
    const [userRole, setUserRole] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch users data - pass role filter to API
    const { data: usersData, isLoading } = useAllUsers({
        role: activeTab === 'all' ? undefined : activeTab,
        search: searchQuery || undefined,
    });

    // Fetch counts
    const { data: countsData } = useUserCounts();

    // Mutations
    const updateStatusMutation = useUpdateUserStatus({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useAllUsers'] });
            queryClient.invalidateQueries({ queryKey: ['useUserCounts'] });
            setIsStatusModalOpen(false);
        },
    });

    const updateRoleMutation = useUpdateUserRole({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useAllUsers'] });
            queryClient.invalidateQueries({ queryKey: ['useUserCounts'] });
            setIsEditModalOpen(false);
        },
    });

    useEffect(() => {
        const role = document.cookie.split('; ').find(row => row.startsWith('userRole='))?.split('=')[1] || '';
        setUserRole(decodeURIComponent(role));
    }, []);

    const isSuperAdmin = userRole === 'Super Admin';

    const users = usersData || [];
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleStatusChange = (user: any) => {
        setSelectedUser(user);
        setIsStatusModalOpen(true);
    };

    const handleStatusUpdate = (status: string) => {
        if (selectedUser) {
            updateStatusMutation.mutate({
                id: selectedUser.id,
                status,
                banReason: status === 'Banned' ? 'Banned by admin' : undefined,
            });
        }
    };

    const handleRoleUpdate = (role: string) => {
        if (selectedUser) {
            updateRoleMutation.mutate({
                id: selectedUser.id,
                role,
            });
        }
    };

    return (
        <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">User Management</h2>
                    <p className="text-muted-foreground">View, manage, and take action on all user accounts.</p>
                </div>
            </div>

            <Tabs value={activeTab} className="w-full" onValueChange={(value) => {
                setActiveTab(value);
                setCurrentPage(1);
            }}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search users..." 
                            className="pl-8 w-full md:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <TabsList className="w-full md:w-auto flex gap-1">
                        <TabsTrigger value="all">All ({countsData?.All || 0})</TabsTrigger>
                        <TabsTrigger value="super_admin">Super Admins ({countsData?.super_admin || 0})</TabsTrigger>
                        <TabsTrigger value="admin">Admins ({countsData?.admin || 0})</TabsTrigger>
                        <TabsTrigger value="moderator">Moderators ({countsData?.moderator || 0})</TabsTrigger>
                        <TabsTrigger value="support">Support ({countsData?.support || 0})</TabsTrigger>
                        <TabsTrigger value="tester">Testers ({countsData?.tester || 0})</TabsTrigger>
                        <TabsTrigger value="user">Users ({countsData?.user || 0})</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value={activeTab} className="mt-4 grid grid-cols-1">
                    <div className="overflow-x-auto">
                        <Card>
                            <CardContent className="p-0">
                                <UserTable 
                                    users={paginatedUsers} 
                                    onEdit={handleEdit} 
                                    onStatusChange={handleStatusChange}
                                    isLoading={isLoading}
                                />
                            </CardContent>
                        </Card>
                    </div>
                    {!isLoading && paginatedUsers.length > 0 && (
                        <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    )}
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
                        <Select defaultValue={selectedUser?.role} onValueChange={handleRoleUpdate}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="tester">Tester</SelectItem>
                                <SelectItem value="support">Support</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="admin" disabled={!isSuperAdmin}>Admin {!isSuperAdmin && "(Super Admin only)"}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button 
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={updateRoleMutation.isPending}
                        >
                            {updateRoleMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
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
                            onClick={() => handleStatusUpdate('Active')}
                            disabled={updateStatusMutation.isPending}
                        >
                            <CheckCircle className="h-4 w-4" /> Activate Account
                        </Button>
                        <Button
                            variant={selectedUser?.status === 'Banned' ? 'destructive' : 'outline'}
                            className="w-full justify-start gap-2"
                            onClick={() => handleStatusUpdate('Banned')}
                            disabled={updateStatusMutation.isPending}
                        >
                            <Ban className="h-4 w-4" /> Ban Account
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

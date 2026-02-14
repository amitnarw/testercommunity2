'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Bell, Send, Loader2, PlusCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAllNotifications, useNotificationCounts, useDeleteNotification, useBroadcastNotification, useCreateNotification } from '@/hooks/useAdmin';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

// Notification Type Badge Component
function NotificationTypeBadge({ type }: { type: string }) {
    const getTypeStyles = () => {
        switch (type) {
            case "NEW_TEST":
                return "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/30";
            case "FEEDBACK_RECEIVED":
                return "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30";
            case "BUG_REPORT":
                return "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30";
            case "POINTS_AWARDED":
                return "bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/30";
            case "TEST_COMPLETED":
                return "bg-purple-500/20 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-500/30";
            case "APP_SUBMISSION":
                return "bg-cyan-500/20 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-500/30";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    };

    return (
        <Badge variant="outline" className={cn("font-medium border text-xs", getTypeStyles())}>
            {type?.replace(/_/g, " ")}
        </Badge>
    );
}

export default function AdminNotificationsPage() {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState("");
    const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
    const [broadcastData, setBroadcastData] = useState({
        title: '',
        description: '',
        type: 'OTHER',
        url: '',
    });

    // Fetch notifications
    const { data: notificationsData, isLoading, error } = useAllNotifications({
        type: filter === 'All' ? undefined : filter,
    });

    // Fetch counts
    const { data: countsData } = useNotificationCounts();

    // Mutations
    const deleteMutation = useDeleteNotification({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useAllNotifications'] });
            queryClient.invalidateQueries({ queryKey: ['useNotificationCounts'] });
        },
    });

    const broadcastMutation = useBroadcastNotification({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useAllNotifications'] });
            queryClient.invalidateQueries({ queryKey: ['useNotificationCounts'] });
            setIsBroadcastModalOpen(false);
            setBroadcastData({ title: '', description: '', type: 'OTHER', url: '' });
        },
    });

    const notifications = notificationsData || [];

    // Filter by search query
    const filteredNotifications = notifications.filter((n: any) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const title = n.title?.toLowerCase() || "";
        const description = n.description?.toLowerCase() || "";
        return title.includes(query) || description.includes(query);
    });

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this notification?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleBroadcast = () => {
        if (!broadcastData.title || !broadcastData.description) {
            alert("Title and description are required");
            return;
        }
        broadcastMutation.mutate(broadcastData);
    };

    return (
        <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
                        Notifications
                    </h2>
                    <p className="text-sm sm:text-md text-muted-foreground">
                        Manage and broadcast notifications to users.
                    </p>
                </div>
                <Button onClick={() => setIsBroadcastModalOpen(true)}>
                    <Send className="mr-2 h-4 w-4" /> Broadcast Notification
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total</CardDescription>
                        <CardTitle className="text-2xl">{countsData?.All || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>New Tests</CardDescription>
                        <CardTitle className="text-2xl">{countsData?.NEW_TEST || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Feedback</CardDescription>
                        <CardTitle className="text-2xl">{countsData?.FEEDBACK_RECEIVED || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Bug Reports</CardDescription>
                        <CardTitle className="text-2xl">{countsData?.BUG_REPORT || 0}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardHeader className="p-2 sm:p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search notifications..."
                                className="pl-8 w-full md:w-[300px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Tabs defaultValue="All" onValueChange={setFilter} className="w-full md:w-auto">
                            <TabsList className="w-full overflow-x-auto grid grid-cols-5">
                                <TabsTrigger value="All" className='text-xs sm:text-sm'>All</TabsTrigger>
                                <TabsTrigger value="NEW_TEST" className='text-xs sm:text-sm'>Tests</TabsTrigger>
                                <TabsTrigger value="FEEDBACK_RECEIVED" className='text-xs sm:text-sm'>Feedback</TabsTrigger>
                                <TabsTrigger value="BUG_REPORT" className='text-xs sm:text-sm'>Bugs</TabsTrigger>
                                <TabsTrigger value="OTHER" className='text-xs sm:text-sm'>Other</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-destructive">
                            Error loading notifications. Please try again.
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No notifications found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">S.N.</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Description</TableHead>
                                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredNotifications.map((notification: any, index: number) => (
                                    <TableRow key={notification.id}>
                                        <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{notification.title}</span>
                                                <span className="text-xs text-muted-foreground md:hidden line-clamp-2">
                                                    {notification.description}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <span className="text-muted-foreground line-clamp-2">
                                                {notification.description}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <NotificationTypeBadge type={notification.type} />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                notification.isActive 
                                                    ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" 
                                                    : "bg-gray-500/20 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400"
                                            )}>
                                                {notification.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(notification.createdAt).toLocaleDateString()}
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
                                                    {notification.url && (
                                                        <DropdownMenuItem asChild>
                                                            <a href={notification.url} target="_blank" rel="noopener noreferrer">
                                                                View Link
                                                            </a>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                        onClick={() => handleDelete(notification.id)}
                                                    >
                                                        Delete Notification
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Broadcast Modal */}
            <Dialog open={isBroadcastModalOpen} onOpenChange={setIsBroadcastModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Broadcast Notification</DialogTitle>
                        <DialogDescription>
                            Send a notification to all users on the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Notification title"
                                value={broadcastData.title}
                                onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Notification description"
                                value={broadcastData.description}
                                onChange={(e) => setBroadcastData({ ...broadcastData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={broadcastData.type}
                                onChange={(e) => setBroadcastData({ ...broadcastData, type: e.target.value })}
                            >
                                <option value="OTHER">Other</option>
                                <option value="NEW_TEST">New Test</option>
                                <option value="FEEDBACK_RECEIVED">Feedback Received</option>
                                <option value="BUG_REPORT">Bug Report</option>
                                <option value="POINTS_AWARDED">Points Awarded</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="url">URL (Optional)</Label>
                            <Input
                                id="url"
                                placeholder="https://example.com"
                                value={broadcastData.url}
                                onChange={(e) => setBroadcastData({ ...broadcastData, url: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsBroadcastModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleBroadcast} disabled={broadcastMutation.isPending}>
                            {broadcastMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Broadcast
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

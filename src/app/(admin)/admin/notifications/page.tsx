'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send, Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useAllNotifications, useNotificationCounts, useDeleteNotification, useCreateNotification, useNotificationTypes, useAllUsers } from '@/hooks/useAdmin';
import { useQueryClient } from '@tanstack/react-query';
import { FeedbackModal } from '@/components/feedback-modal';
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
            case "POINTS_DEDUCTED":
                return "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30";
            case "TEST_COMPLETED":
                return "bg-purple-500/20 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-500/30";
            case "APP_APPROVED":
                return "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30";
            case "APP_REJECTED":
                return "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30";
            case "TEST_INVITATION":
                return "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/30";
            case "GENERAL_MESSAGE":
                return "bg-gray-500/20 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 border-gray-500/30";
            case "REMINDER":
                return "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-500/30";
            case "ANNOUNCEMENT":
                return "bg-indigo-500/20 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-500/30";
            case "ACCOUNT_UPDATE":
                return "bg-cyan-500/20 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-500/30";
            case "INSUFFICIENT_BALANCE":
                return "bg-orange-500/20 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-500/30";
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
    const [deleteModalState, setDeleteModalState] = useState<{ open: boolean; notificationId: number | null }>({ open: false, notificationId: null });
    const [broadcastData, setBroadcastData] = useState({
        title: '',
        description: '',
        type: 'OTHER',
        url: '',
    });
    const [targetType, setTargetType] = useState<string>('all');
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [feedbackModal, setFeedbackModal] = useState<{
        open: boolean;
        status: 'success' | 'error' | 'warning' | 'info' | 'loading';
        title: string;
        description: string;
        primaryAction?: { label: string; onClick: () => void };
        secondaryAction?: { label: string; onClick: () => void };
    }>({ open: false, status: 'info', title: '', description: '' });

    // Fetch notifications
    const { data: notificationsData, isLoading, error } = useAllNotifications({
        type: filter === 'All' ? undefined : filter,
    });

    // Fetch counts
    const { data: countsData } = useNotificationCounts();

    // Fetch notification types
    const { data: notificationTypes, isLoading: isLoadingTypes } = useNotificationTypes();

    // Fetch users for single user targeting
    const { data: usersData, isLoading: isLoadingUsers } = useAllUsers();

    // Mutations
    const deleteMutation = useDeleteNotification({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useAllNotifications'] });
            queryClient.invalidateQueries({ queryKey: ['useNotificationCounts'] });
            setDeleteModalState({ open: false, notificationId: null });
            setFeedbackModal({
                open: true,
                status: "success",
                title: "Notification Deleted",
                description: "The notification has been deleted successfully.",
                primaryAction: { label: "OK", onClick: () => setFeedbackModal(prev => ({ ...prev, open: false })) },
            });
        },
        onError: (error: any) => {
            setDeleteModalState({ open: false, notificationId: null });
            setFeedbackModal({
                open: true,
                status: "error",
                title: "Delete Failed",
                description: error?.message || "Something went wrong. Please try again.",
                primaryAction: { label: "OK", onClick: () => setFeedbackModal(prev => ({ ...prev, open: false })) },
            });
        },
    });

    const createMutation = useCreateNotification({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useAllNotifications'] });
            queryClient.invalidateQueries({ queryKey: ['useNotificationCounts'] });
            setIsBroadcastModalOpen(false);
            setBroadcastData({ title: '', description: '', type: 'OTHER', url: '' });
            setTargetType('all');
            setSelectedUserId('');
            setFeedbackModal({
                open: true,
                status: "success",
                title: "Notification Sent!",
                description: "Your notification has been sent successfully.",
                primaryAction: { label: "OK", onClick: () => setFeedbackModal(prev => ({ ...prev, open: false })) },
            });
        },
        onError: (error: any) => {
            setFeedbackModal({
                open: true,
                status: "error",
                title: "Failed to Send",
                description: error?.message || "Something went wrong. Please try again.",
                primaryAction: { label: "OK", onClick: () => setFeedbackModal(prev => ({ ...prev, open: false })) },
            });
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
        setDeleteModalState({ open: true, notificationId: id });
    };

    const handleBroadcast = () => {
        if (!broadcastData.title || !broadcastData.description) {
            alert("Title and description are required");
            return;
        }
        if (targetType === 'single' && !selectedUserId) {
            alert("Please select a user");
            return;
        }
        const payload = {
            ...broadcastData,
            userId: targetType === 'single' ? selectedUserId : undefined,
        };
        createMutation.mutate(payload);
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
            <Card className='grid grid-cols-1'>
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
                        <Select value={filter} onValueChange={setFilter}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[240px] overflow-y-auto">
                                        <SelectItem value="All">All Types</SelectItem>
                                        {(notificationTypes || []).map((type: string) => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace(/_/g, ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                    <TableHead className="hidden lg:table-cell">Target</TableHead>
                                    <TableHead className="hidden lg:table-cell">Recipient</TableHead>
                                    <TableHead className="hidden xl:table-cell">URL</TableHead>
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
                                        <TableCell className="hidden lg:table-cell">
                                            <Badge variant="outline" className={cn(
                                                notification.userId
                                                    ? "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                                    : "bg-purple-500/20 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
                                            )}>
                                                {notification.userId ? 'Single User' : 'All Users'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-muted-foreground text-xs max-w-[150px] truncate">
                                            {notification.user?.name || notification.user?.email || (notification.userId ? notification.userId : '-')}
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            {notification.url ? (
                                                <a
                                                    href={notification.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline text-xs truncate block max-w-[150px]"
                                                >
                                                    {notification.url}
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
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
                                            <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => handleDelete(notification.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
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
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Send Notification</DialogTitle>
                        <DialogDescription>
                            Send a notification to users on the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2 -mr-2">
                        <div className="grid gap-2">
                            <Label htmlFor="target">Send To</Label>
                            <Select value={targetType} onValueChange={(value: string) => { setTargetType(value as any); setSelectedUserId(''); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select target" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="single">Single User</SelectItem>
                                    <SelectItem value="TESTERS">All Testers</SelectItem>
                                    <SelectItem value="ADMIN">All Admins</SelectItem>
                                    <SelectItem value="USER">All Users</SelectItem>
                                    <SelectItem value="OPERATIONS_ADMIN">All Operations Admins</SelectItem>
                                    <SelectItem value="CUSTOMER_SUPPORT">All Support</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {targetType === 'single' && (
                            <div className="grid gap-2">
                                <Label htmlFor="user">Select User</Label>
                                {isLoadingUsers ? (
                                    <div className="flex items-center justify-center h-10">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <SearchableSelect
                                        value={selectedUserId}
                                        onValueChange={setSelectedUserId}
                                        placeholder="Search and select a user..."
                                        triggerClassName="w-full"
                                    >
                                        {(usersData || []).map((user: any) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                value={user.id}
                                                data-name={user.name || user.email}
                                                data-email={user.email}
                                                className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent w-full text-left flex flex-col gap-0.5"
                                                onClick={() => setSelectedUserId(user.id)}
                                            >
                                                <span className="font-medium">{user.name || user.email}</span>
                                                <span className="text-xs text-muted-foreground">{user.email} • {user.role || 'No Role'}</span>
                                            </button>
                                        ))}
                                    </SearchableSelect>
                                )}
                            </div>
                        )}
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
                            {isLoadingTypes ? (
                                <div className="flex items-center justify-center h-10 rounded-md border border-input bg-background">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <Select value={broadcastData.type} onValueChange={(value) => setBroadcastData({ ...broadcastData, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(notificationTypes || []).map((type: string) => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace(/_/g, ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
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
                    <DialogFooter className="shrink-0">
                        <Button variant="ghost" onClick={() => setIsBroadcastModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleBroadcast} disabled={createMutation.isPending}>
                            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Notification
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <FeedbackModal
                open={deleteModalState.open}
                onOpenChange={(open) => setDeleteModalState({ ...deleteModalState, open })}
                status="warning"
                title="Delete Notification"
                description="Are you sure you want to delete this notification? This action cannot be undone."
                primaryAction={{
                    label: "Delete",
                    onClick: () => {
                        if (deleteModalState.notificationId) {
                            deleteMutation.mutate(deleteModalState.notificationId);
                        }
                        setDeleteModalState({ open: false, notificationId: null });
                    },
                }}
                secondaryAction={{
                    label: "Cancel",
                    onClick: () => setDeleteModalState({ open: false, notificationId: null }),
                }}
            />
            <FeedbackModal
                open={feedbackModal.open}
                onOpenChange={(open) => setFeedbackModal(prev => ({ ...prev, open }))}
                status={feedbackModal.status}
                title={feedbackModal.title}
                description={feedbackModal.description}
                primaryAction={feedbackModal.primaryAction}
                secondaryAction={feedbackModal.secondaryAction}
            />
        </div>
    );
}

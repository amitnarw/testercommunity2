'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Lightbulb, PlusCircle, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useAllSuggestions, useSuggestionCounts, useDeleteSuggestion, useUpdateSuggestionStatus } from '@/hooks/useAdmin';
import { useQueryClient } from '@tanstack/react-query';

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
    const getStatusStyles = () => {
        switch (status) {
            case "IMPLEMENTED":
                return "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30";
            case "PENDING":
                return "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/30";
            case "REVIEWED":
                return "bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/30";
            case "REJECTED":
                return "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    };

    return (
        <Badge variant="outline" className={cn("font-medium border", getStatusStyles())}>
            {status}
        </Badge>
    );
}

// Type Badge Component
function TypeBadge({ type }: { type: string }) {
    const getTypeStyles = () => {
        switch (type) {
            case "BUG":
                return "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30";
            case "SUGGESTIONS":
                return "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/30";
            case "PRAISE":
                return "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    };

    return (
        <Badge variant="outline" className={cn("font-medium border text-xs", getTypeStyles())}>
            {type}
        </Badge>
    );
}

import { cn } from '@/lib/utils';

export default function AdminSuggestionsPage() {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch suggestions
    const { data: suggestionsData, isLoading, error } = useAllSuggestions({
        status: filter === 'All' ? undefined : filter,
    });

    // Fetch counts
    const { data: countsData } = useSuggestionCounts();

    // Mutations
    const deleteMutation = useDeleteSuggestion({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useAllSuggestions'] });
            queryClient.invalidateQueries({ queryKey: ['useSuggestionCounts'] });
        },
    });

    const updateStatusMutation = useUpdateSuggestionStatus({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useAllSuggestions'] });
            queryClient.invalidateQueries({ queryKey: ['useSuggestionCounts'] });
        },
    });

    const suggestions = suggestionsData || [];

    // Filter by search query
    const filteredSuggestions = suggestions.filter((s: any) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const title = s.title?.toLowerCase() || "";
        const message = s.message?.toLowerCase() || "";
        const userName = s.user?.name?.toLowerCase() || "";
        return title.includes(query) || message.includes(query) || userName.includes(query);
    });

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this suggestion?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleStatusUpdate = (id: number, status: string) => {
        updateStatusMutation.mutate({ id, status });
    };

    return (
        <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">Feature Suggestions</h2>
                    <p className="text-sm sm:text-md text-muted-foreground">Manage new feature ideas and suggestions from the community.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/suggestions/add">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Suggestion Manually
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className='p-2 sm:p-6'>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search suggestions..." 
                                className="pl-8 w-full md:w-[300px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Tabs defaultValue="All" onValueChange={setFilter} className="w-full md:w-auto">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="All" className='text-xs sm:text-sm'>All</TabsTrigger>
                                <TabsTrigger value="PENDING" className='text-xs sm:text-sm'>Pending</TabsTrigger>
                                <TabsTrigger value="REVIEWED" className='text-xs sm:text-sm'>Reviewed</TabsTrigger>
                                <TabsTrigger value="IMPLEMENTED" className='text-xs sm:text-sm'>Implemented</TabsTrigger>
                                <TabsTrigger value="REJECTED" className='text-xs sm:text-sm'>Rejected</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent className='p-2 sm:p-6 grid grid-cols-1'>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-destructive">
                            Error loading suggestions. Please try again.
                        </div>
                    ) : filteredSuggestions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No suggestions found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">S.N.</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                                    <TableHead className="hidden md:table-cell w-2/5">Suggestion</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSuggestions.map((item: any, index: number) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{item.user?.name || 'Unknown'}</span>
                                                <span className="text-xs text-muted-foreground">{item.user?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <TypeBadge type={item.type} />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            <div className="flex flex-col">
                                                {item.title && <span className="font-medium text-foreground">{item.title}</span>}
                                                <span className="line-clamp-2">{item.message}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={item.status} />
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
                                                    <Link href={`/admin/suggestions/${item.id}`}>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(item.id, 'REVIEWED')}>
                                                        Mark as Reviewed
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(item.id, 'IMPLEMENTED')}>
                                                        Mark as Implemented
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(item.id, 'REJECTED')}>
                                                        Mark as Rejected
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        Delete Suggestion
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
        </div>
    );
}

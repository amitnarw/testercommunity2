

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
import { AppPagination } from '@/components/app-pagination';
import Link from 'next/link';

const feedbackItems = [
    { id: 1, user: "Peter Parker", role: "Tester", feedback: "The dashboard loading speed is a bit slow on mobile.", date: "2024-08-20", status: "New" },
    { id: 2, user: "Diana Prince", role: "Tester", feedback: "Would be great to have a dark mode for the community hub.", date: "2024-08-19", status: "Implemented" },
    { id: 3, user: "Clark Kent", role: "Developer", feedback: "The submission form timed out once, lost all my data.", date: "2024-08-18", status: "Under Review" },
    { id: 4, user: "Bruce Wayne", role: "Developer", feedback: "The analytics chart on the project page is very helpful!", date: "2024-08-17", status: "Reviewed" },
    { id: 5, user: "Tony Stark", role: "Developer", feedback: "API documentation for integrations would be a game-changer.", date: "2024-08-16", status: "New" },
    { id: 6, user: "Selina Kyle", role: "Tester", feedback: "The points system is a little confusing at first.", date: "2024-08-15", status: "Reviewed" },
    { id: 7, user: "Barry Allen", role: "Developer", feedback: "Love the new professional testing option, super fast.", date: "2024-08-14", status: "Reviewed" },
    { id: 8, user: "Arthur Curry", role: "Tester", feedback: "I can't seem to find where to edit my device list.", date: "2024-08-13", status: "Under Review" },
    { id: 9, user: "Hal Jordan", role: "Developer", feedback: "An option to duplicate a past submission would save a lot of time.", date: "2024-08-12", status: "New" },
    { id: 10, user: "Victor Stone", role: "Tester", feedback: "The bug reporting form should allow video attachments.", date: "2024-08-11", status: "Implemented" },
    { id: 11, user: "Reed Richards", role: "Developer", feedback: "Platform feels snappy and responsive. Great job!", date: "2024-08-10", status: "Reviewed" },
    { id: 12, user: "Sue Storm", role: "Tester", feedback: "The color contrast in light mode could be improved for accessibility.", date: "2024-08-09", status: "New" },
    { id: 13, user: "Johnny Storm", role: "Tester", feedback: "More gamification elements would be awesome, like badges for streaks.", date: "2024-08-08", status: "Under Review" },
    { id: 14, user: "Ben Grimm", role: "Developer", feedback: "Rock solid platform. No complaints.", date: "2024-08-07", status: "Reviewed" },
];

const ITEMS_PER_PAGE = 7;

export default function AdminFeedbackPage() {
    const [filter, setFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredFeedback = feedbackItems.filter(f => filter === 'All' || f.status === filter);
    
    const totalPages = Math.ceil(filteredFeedback.length / ITEMS_PER_PAGE);

    const paginatedFeedback = filteredFeedback.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (value: string) => {
        setFilter(value);
        setCurrentPage(1);
    }

    return (
        <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">Platform Feedback</h2>
                    <p className="text-sm sm:text-md text-muted-foreground">Review and manage feedback submitted by users about the inTesters platform.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/feedback/add">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Feedback Manually
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="p-2 sm:p-6 grid grid-cols-1">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search feedback..." className="pl-8 w-full md:w-[300px]" />
                        </div>
                        <Tabs defaultValue="All" onValueChange={handleFilterChange} className="w-full md:w-auto">
                            <TabsList className="w-full overflow-x-auto grid grid-cols-5">
                                <TabsTrigger value="All" className='text-xs sm:text-sm'>All</TabsTrigger>
                                <TabsTrigger value="New" className='text-xs sm:text-sm'>New</TabsTrigger>
                                <TabsTrigger value="Under Review" className='text-xs sm:text-sm'>In Review</TabsTrigger>
                                <TabsTrigger value="Reviewed" className='text-xs sm:text-sm'>Reviewed</TabsTrigger>
                                <TabsTrigger value="Implemented" className='text-xs sm:text-sm'>Implemented</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-6 grid grid-cols-1">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">S.N.</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden sm:table-cell">Role</TableHead>
                                <TableHead className="hidden md:table-cell w-2/5">Feedback</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedFeedback.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
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
                                                <Link href={`/admin/feedback/${item.id}`}>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                </Link>
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
            <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
}

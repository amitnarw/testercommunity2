
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CheckSquare, Coins, ListFilter, ArrowUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { communityApps } from '@/lib/data';
import { PointsSidebar } from '@/components/points-sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityAvailableAppCard } from '@/components/community-available-app-card';
import { CommunityOngoingAppCard } from '@/components/community-ongoing-app-card';
import { CommunityCompletedAppCard } from '@/components/community-completed-app-card';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';


const APPS_PER_PAGE = 6;

export default function CommunityDashboardPage() {
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('Most Recent');
    const [pagination, setPagination] = useState({
        available: 1,
        ongoing: 1,
        completed: 1,
    });

    const ongoingApps = communityApps.filter(app => app.status === 'ongoing');
    const completedApps = communityApps.filter(app => app.status === 'completed');
    const availableApps = communityApps.filter(app => app.status === 'available');

    const totalAvailablePages = Math.ceil(availableApps.length / APPS_PER_PAGE);
    const totalOngoingPages = Math.ceil(ongoingApps.length / APPS_PER_PAGE);
    const totalCompletedPages = Math.ceil(completedApps.length / APPS_PER_PAGE);

    const currentAvailableApps = availableApps.slice(
        (pagination.available - 1) * APPS_PER_PAGE,
        pagination.available * APPS_PER_PAGE
    );
    const currentOngoingApps = ongoingApps.slice(
        (pagination.ongoing - 1) * APPS_PER_PAGE,
        pagination.ongoing * APPS_PER_PAGE
    );
    const currentCompletedApps = completedApps.slice(
        (pagination.completed - 1) * APPS_PER_PAGE,
        pagination.completed * APPS_PER_PAGE
    );
    
    const handlePageChange = (type: 'available' | 'ongoing' | 'completed', page: number) => {
        setPagination(prev => ({ ...prev, [type]: page }));
    };
    
    const renderPagination = (type: 'available' | 'ongoing' | 'completed', totalPages: number) => {
        if (totalPages <= 1) return null;
        const currentPage = pagination[type];

        return (
             <Pagination className="mt-8">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(type, currentPage - 1); }} />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                            <PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); handlePageChange(type, page); }}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(type, currentPage + 1); }}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
    }

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <header className="mb-8">
                            <h1 className="text-4xl font-bold">Community Hub</h1>
                            <p className="text-muted-foreground mt-2">Test apps, earn points, and help fellow developers build better products.</p>
                        </header>

                        <div className="grid gap-4 md:grid-cols-3 mb-8">
                            <Card className="rounded-xl">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Points Balance</CardTitle>
                                    <Coins className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">2,450</div>
                                    <p className="text-xs text-muted-foreground">Ready to spend or redeem</p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-xl">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
                                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12</div>
                                    <p className="text-xs text-muted-foreground">You're a testing machine!</p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-xl">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Apps Submitted</CardTitle>
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">2</div>
                                    <p className="text-xs text-muted-foreground">Your projects in the queue</p>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <main>
                            <Tabs defaultValue="available" className="w-full">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <TabsList>
                                        <TabsTrigger value="available">Available</TabsTrigger>
                                        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                                        <TabsTrigger value="completed">Completed</TabsTrigger>
                                    </TabsList>
                                    <div className="flex gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="gap-2 rounded-xl">
                                                    <ListFilter className="h-4 w-4" /> Filter
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {['All', 'Games', 'Productivity', 'Social', 'Utilities'].map(cat => (
                                                        <DropdownMenuItem key={cat} onClick={() => setFilter(cat)}>{cat}</DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="gap-2 rounded-xl">
                                                    <ArrowUpDown className="h-4 w-4" /> Sort
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                    {['Most Recent', 'Most Rewarding', 'Time to Test'].map(cat => (
                                                        <DropdownMenuItem key={cat} onClick={() => setSort(cat)}>{cat}</DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <TabsContent value="available">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {currentAvailableApps.map(app => (
                                            <CommunityAvailableAppCard key={app.id} app={app} />
                                        ))}
                                    </div>
                                    {renderPagination('available', totalAvailablePages)}
                                </TabsContent>
                                <TabsContent value="ongoing">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {currentOngoingApps.length > 0 ? (
                                            currentOngoingApps.map(app => (
                                                <CommunityOngoingAppCard key={app.id} app={app} />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground col-span-full">You have no ongoing tests.</div>
                                        )}
                                    </div>
                                    {renderPagination('ongoing', totalOngoingPages)}
                                </TabsContent>
                                <TabsContent value="completed">
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {currentCompletedApps.length > 0 ? (
                                            currentCompletedApps.map(app => (
                                                <CommunityCompletedAppCard key={app.id} app={app} />
                                            ))
                                        ) : (
                                             <div className="text-center py-12 text-muted-foreground col-span-full">You have not completed any tests yet.</div>
                                        )}
                                    </div>
                                    {renderPagination('completed', totalCompletedPages)}
                                </TabsContent>
                            </Tabs>
                        </main>

                    </div>
                    <div className="lg:col-span-1">
                        <PointsSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}

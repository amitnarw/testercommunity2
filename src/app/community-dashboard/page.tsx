
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListFilter, ArrowUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { communityApps } from '@/lib/data';
import { PointsSidebar } from '@/components/points-sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityAvailableAppCard } from '@/components/community-available-app-card';
import { CommunityOngoingAppCard } from '@/components/community-ongoing-app-card';
import { CommunityCompletedAppCard } from '@/components/community-completed-app-card';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';


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
        const totalPages = {
            available: totalAvailablePages,
            ongoing: totalOngoingPages,
            completed: totalCompletedPages,
        }[type];

        if (page >= 1 && page <= totalPages) {
            setPagination(prev => ({ ...prev, [type]: page }));
        }
    };

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <header className="mb-8">
                            <h1 className="text-4xl font-bold">Community Hub</h1>
                            <p className="text-muted-foreground mt-2">Test apps, earn points, and help fellow developers build better products.</p>
                        </header>

                        <div className="grid gap-4 mb-8 md:grid-cols-3 md:grid-rows-2">

                            <Card className="rounded-xl border-0 row-span-1 md:col-span-2 md:row-span-2">
                                <CardHeader className='h-1/3'>
                                    <CardTitle>Your Apps' Performance</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-row items-center justify-around text-center gap-4 h-2/3">
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-2xl font-bold">2</p>
                                        <p className="text-xs text-muted-foreground">Apps Submitted</p>
                                    </div>
                                    <Separator orientation="vertical" className="h-16 hidden sm:block" />
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-2xl font-bold">35</p>
                                        <p className="text-xs text-muted-foreground">Testers Engaged</p>
                                    </div>
                                    <Separator orientation="vertical" className="h-16 hidden sm:block" />
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-2xl font-bold">12</p>
                                        <p className="text-xs text-muted-foreground">Tests Completed</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-row gap-4 md:contents">
                                <Card className="rounded-xl border-0 p-4 w-1/2 md:w-auto md:col-span-1">
                                    <CardHeader className="p-0 mb-1">
                                        <CardTitle className="text-sm font-medium">Tests You've Started</CardTitle>
                                    </CardHeader>
                                    <CardContent className='p-0'>
                                        <div className="text-2xl font-bold">5</div>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-xl border-0 p-4 w-1/2 md:w-auto md:col-span-1">
                                    <CardHeader className="p-0 mb-1">
                                        <CardTitle className="text-sm font-medium">Tests You've Completed</CardTitle>
                                    </CardHeader>
                                    <CardContent className='p-0'>
                                        <div className="text-2xl font-bold">12</div>
                                    </CardContent>
                                </Card>
                            </div>
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
                                    {totalAvailablePages > 1 && (
                                        <Pagination className="mt-8">
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange('available', pagination.available - 1); }}
                                                        className={pagination.available === 1 ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                                {Array.from({ length: totalAvailablePages }, (_, i) => i + 1).map(page => (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            href="#"
                                                            isActive={pagination.available === page}
                                                            onClick={(e) => { e.preventDefault(); handlePageChange('available', page); }}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange('available', pagination.available + 1); }}
                                                        className={pagination.available === totalAvailablePages ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    )}
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
                                    {totalOngoingPages > 1 && (
                                        <Pagination className="mt-8">
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange('ongoing', pagination.ongoing - 1); }}
                                                        className={pagination.ongoing === 1 ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                                {Array.from({ length: totalOngoingPages }, (_, i) => i + 1).map(page => (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            href="#"
                                                            isActive={pagination.ongoing === page}
                                                            onClick={(e) => { e.preventDefault(); handlePageChange('ongoing', page); }}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange('ongoing', pagination.ongoing + 1); }}
                                                        className={pagination.ongoing === totalOngoingPages ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    )}
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
                                    {totalCompletedPages > 1 && (
                                        <Pagination className="mt-8">
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange('completed', pagination.completed - 1); }}
                                                        className={pagination.completed === 1 ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                                {Array.from({ length: totalCompletedPages }, (_, i) => i + 1).map(page => (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            href="#"
                                                            isActive={pagination.completed === page}
                                                            onClick={(e) => { e.preventDefault(); handlePageChange('completed', page); }}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange('completed', pagination.completed + 1); }}
                                                        className={pagination.completed === totalCompletedPages ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    )}
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
    
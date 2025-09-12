

'use client';

import { useState } from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListFilter, ArrowUpDown, PlusCircle, Star, LayoutPanelLeft, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { communityApps, projects as allProjects } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityAvailableAppCard } from '@/components/community-available-app-card';
import { CommunityOngoingAppCard } from '@/components/community-ongoing-app-card';
import { CommunityCompletedAppCard } from '@/components/community-completed-app-card';
import Link from 'next/link';
import { AppPagination } from '@/components/app-pagination';
import { motion } from 'framer-motion';


const APPS_PER_PAGE = 6;

const BentoCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-card rounded-2xl p-4 flex flex-col justify-between ${className}`}>
        {children}
    </div>
);


export default function CommunityDashboardPage() {
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('Most Recent');
    const [pagination, setPagination] = useState({
        available: 1,
        ongoing: 1,
        completed: 1,
    });
    const [selectedTab, setSelectedTab] = useState('available');

    const ongoingApps = communityApps.filter(app => app.status === 'ongoing');
    const completedApps = communityApps.filter(app => app.status === 'completed');
    const availableApps = communityApps.filter(app => app.status === 'available');

    const totalAvailablePages = Math.ceil(availableApps.length / APPS_PER_PAGE);
    const totalOngoingPages = Math.ceil(ongoingApps.length / APPS_PER_PAGE);
    const totalCompletedPages = Math.ceil(completedApps.length / APPS_PER_PAGE);

    const tabs = [
        { label: 'Available', value: 'available', count: availableApps.length },
        { label: 'Ongoing', value: 'ongoing', count: ongoingApps.length },
        { label: 'Completed', value: 'completed', count: completedApps.length },
    ];

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

    const appsSubmitted = allProjects.length;
    const testersEngaged = allProjects.reduce((sum, p) => sum + p.testersStarted, 0);
    const testsCompleted = allProjects.reduce((sum, p) => sum + p.testersCompleted, 0);


    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                <header className="mb-12">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">Community Hub</h1>
                        <p className="text-muted-foreground max-w-xl">Test apps, earn points, and help fellow developers build better products.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <BentoCard className='col-span-2'>
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><Activity className="w-4 h-4" /> Performance</CardTitle>
                            <div className="grid grid-cols-3 gap-2 w-full mt-2">
                                <div className="text-center bg-secondary p-2 rounded-lg">
                                    <p className="text-2xl font-bold">{appsSubmitted}</p>
                                    <p className="text-xs text-muted-foreground">Apps Submitted</p>
                                </div>
                                <div className="text-center bg-secondary p-2 rounded-lg">
                                    <p className="text-2xl font-bold">{testersEngaged}</p>
                                    <p className="text-xs text-muted-foreground">Testers Engaged</p>
                                </div>
                                <div className="text-center bg-secondary p-2 rounded-lg">
                                    <p className="text-2xl font-bold">{testsCompleted}</p>
                                    <p className="text-xs text-muted-foreground">Tests Done</p>
                                </div>
                            </div>
                        </BentoCard>

                        <div className='flex flex-row gap-2 col-span-2'>
                            <BentoCard className="bg-gradient-to-br from-primary to-primary/40 text-primary-foreground relative overflow-hidden w-5/12 sm:w-1/2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Star className="absolute top-5 left-5 scale-[6] text-white/20 rotate-45 w-4 h-4" /> My Points
                                </CardTitle>
                                <p className="text-3xl sm:text-5xl font-bold text-center my-auto">1,250</p>
                            </BentoCard>

                            <BentoCard className='w-7/12 sm:w-1/2 !p-2.5 sm:!p-4'>
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                    My Testing
                                </CardTitle>
                                <div className="grid grid-rows-2 grid-cols-1 sm:grid-cols-2 sm:grid-rows-1 gap-2 w-full mt-2 h-full">
                                    <div className="text-center bg-secondary px-4 rounded-lg flex flex-row sm:flex-col items-center justify-between sm:justify-center">
                                        <p className="text-xs text-muted-foreground">Ongoing</p>
                                        <p className="text-2xl font-bold">{ongoingApps.length}</p>
                                    </div>
                                    <div className="text-center bg-secondary px-4 rounded-lg flex flex-row sm:flex-col items-center justify-between sm:justify-center">
                                        <p className="text-xs text-muted-foreground">Completed</p>
                                        <p className="text-2xl font-bold">{completedApps.length}</p>
                                    </div>
                                </div>
                            </BentoCard>
                        </div>

                        <BentoCard className="flex !flex-row sm:!flex-col gap-2 col-span-2 lg:col-span-1 !p-2.5 sm:!p-4">
                            <Button asChild className="w-full justify-start h-full bg-gradient-to-b from-primary to-primary/40 text-primary-foreground p-2 sm:p-auto">
                                <Link href="/community-dashboard/submit">
                                    <PlusCircle className="absolute sm:static left-0 top-0 scale-[2] text-white/20 sm:left-auto sm:top-auto sm:scale-[1] sm:text-white mr-2 h-4 w-4" /> Submit New App
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full justify-start h-full p-2 sm:p-auto">
                                <Link href="/community-dashboard/my-submissions">
                                    <LayoutPanelLeft className="absolute sm:static left-0 top-0 scale-[2] text-black/10 dark:text-white/15 sm:left-auto sm:top-auto sm:scale-[1] sm:text-black dark:sm:text-white mr-2 h-4 w-4" /> My Submissions
                                </Link>
                            </Button>
                        </BentoCard>
                    </div>
                </header>

                <main>
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">Available Apps</h2>
                                <p className="text-muted-foreground">Browse apps that need testing from the community.</p>
                            </div>
                            <div className="flex gap-2 flex-row items-center justify-end w-full md:w-auto">
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
                        <TabsList className="relative grid w-full grid-cols-3 bg-muted p-1 rounded-full">
                            {tabs.map((tab) => {
                                const isSelected = selectedTab === tab.value;

                                return (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className={`relative px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 ${isSelected ? 'text-foreground' : 'hover:bg-background/50'
                                            }`}
                                    >
                                        {isSelected && (
                                            <motion.span
                                                layoutId="bubble"
                                                className="absolute inset-0 z-10 bg-background rounded-full"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-20">
                                            {tab.label} ({tab.count})
                                        </span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                        <TabsContent value="available">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentAvailableApps.map(app => (
                                    <CommunityAvailableAppCard key={app.id} app={app} />
                                ))}
                            </div>
                            <AppPagination
                                currentPage={pagination.available}
                                totalPages={totalAvailablePages}
                                onPageChange={(page) => handlePageChange('available', page)}
                            />
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
                            <AppPagination
                                currentPage={pagination.ongoing}
                                totalPages={totalOngoingPages}
                                onPageChange={(page) => handlePageChange('ongoing', page)}
                            />
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
                            <AppPagination
                                currentPage={pagination.completed}
                                totalPages={totalCompletedPages}
                                onPageChange={(page) => handlePageChange('completed', page)}
                            />
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}

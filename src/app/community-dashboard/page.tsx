
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CheckSquare, Coins, ListFilter, ArrowUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { communityApps } from '@/lib/data';
import { PointsSidebar } from '@/components/points-sidebar';
import { AvailableAppRow } from '@/components/available-app-row';

export default function CommunityDashboardPage() {
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('Most Recent');
    const [hoveredAppId, setHoveredAppId] = useState<number | null>(null);
    const hoveredApp = communityApps.find(app => app.id === hoveredAppId);

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <header className="mb-8">
                            <h1 className="text-4xl font-bold">Community Dashboard</h1>
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
                            <Card className="rounded-xl">
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <CardTitle>Available Apps to Test</CardTitle>
                                            <CardDescription>Choose an app to test and start earning points.</CardDescription>
                                        </div>
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
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-3">
                                    <div className="col-span-1 md:col-span-2">
                                        <div className="border-t">
                                            {communityApps.map(app => (
                                                <AvailableAppRow 
                                                    key={app.id} 
                                                    app={app} 
                                                    onMouseEnter={() => setHoveredAppId(app.id)}
                                                    onMouseLeave={() => setHoveredAppId(null)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                     <div className="hidden md:block col-span-1 p-4">
                                        <div className="sticky top-28 h-96 bg-secondary rounded-xl flex items-center justify-center transition-all duration-300">
                                            {hoveredApp && hoveredApp.screenshots?.[0] ? (
                                                <img 
                                                    src={hoveredApp.screenshots[0].url} 
                                                    alt={hoveredApp.screenshots[0].alt}
                                                    className="max-h-full max-w-full object-contain rounded-lg animate-in fade-in zoom-in-95"
                                                    data-ai-hint={hoveredApp.screenshots[0].dataAiHint}
                                                />
                                            ) : (
                                                <span className="text-muted-foreground text-sm">Hover over an app to see a preview</span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
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

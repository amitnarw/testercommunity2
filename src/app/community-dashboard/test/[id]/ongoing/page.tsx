
'use client';

import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AppInfoSidebar } from '@/components/appInfoSidebar';
import Image from 'next/image';
import { SubmittedFeedback } from '@/components/submitted-feedback';


const DailyProgress = ({ progress, totalDays }: { progress: number, totalDays: number }) => {
    const completedDays = Math.floor(totalDays * (progress || 0) / 100);
    const isToday = (day: number) => day === completedDays + 1;

    return (
        <div className="w-full grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-2 sm:gap-3">
            {Array.from({ length: totalDays }, (_, i) => {
                const day = i + 1;
                const isCompleted = day <= completedDays;

                return (
                    <Card
                        key={day}
                        className={cn(
                            "aspect-square rounded-2xl flex flex-col items-center justify-center p-1.5 transition-all duration-300 shadow-md hover:scale-105",
                            isToday(day)
                                ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground scale-110 shadow-lg shadow-primary/30'
                                : 'bg-card',
                            isCompleted
                                ? 'bg-secondary/50 shadow-inner'
                                : ''
                        )}
                    >
                        {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                            <>
                                <p className={cn("text-[10px] sm:text-xs", isToday(day) ? 'opacity-80' : 'text-muted-foreground')}>Day</p>
                                <p className={cn("font-bold", isToday(day) ? 'text-4xl' : 'text-2xl')}>{day}</p>
                            </>
                        )}
                    </Card>
                );
            })}
        </div>
    );
};


export default function AppTestingOngoingPage({ params }: { params: { id: string } }) {
    const app = communityApps.find(p => p.id.toString() === params.id && p.status === 'ongoing');

    if (!app) {
        notFound();
    }

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <header className="mb-8 max-w-7xl mx-auto">
                    <BackButton href="/community-dashboard" className="mb-4" />
                </header>

                <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
                    <div className='flex flex-col gap-10 lg:col-span-2'>
                        <section>
                            <div className="grid md:grid-cols-3 items-center gap-6">
                                <div className="flex items-center gap-4 md:col-span-2">
                                     <Image src={app.icon} alt={app.name} width={100} height={100} className="rounded-2xl border bg-background shadow-md" data-ai-hint={app.dataAiHint} />
                                    <div>
                                        <h1 className="text-4xl font-bold">{app.name}</h1>
                                        <p className="text-muted-foreground text-lg mt-1">{app.shortDescription}</p>
                                    </div>
                                </div>
                                <Card className="p-4 bg-primary/10 border-primary/20">
                                    <CardTitle className="text-sm text-primary">Reward</CardTitle>
                                    <p className="text-3xl font-bold flex items-center gap-2">{app.points.toLocaleString()} Points <Star className="w-6 h-6 text-amber-400" /></p>
                                </Card>
                            </div>
                        </section>

                        <section>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Testing in Progress</CardTitle>
                                    <CardDescription>Keep the app installed and engage with it daily to complete the test cycle.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DailyProgress progress={app.progress || 0} totalDays={app.totalDays} />
                                </CardContent>
                            </Card>
                        </section>

                        <section className='mt-8'>
                            <h2 className="text-2xl font-bold mb-4">Developer's Instructions</h2>
                            <div className="prose prose-base dark:prose-invert bg-card p-6 rounded-lg border-primary/20 border-l-4">
                                <p>{app.testingInstructions}</p>
                            </div>
                        </section>

                        <SubmittedFeedback />

                    </div>

                    <aside className="lg:col-span-1">
                        <AppInfoSidebar app={app} buttonType="external" url={app?.playStoreUrl} />
                    </aside>
                </main>
            </div>
        </div>
    );
}

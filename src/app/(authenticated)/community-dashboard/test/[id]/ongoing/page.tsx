
'use client';

import { notFound } from 'next/navigation';
import { CheckCircle, Star } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { cn } from '@/lib/utils';
import { AppInfoSidebar } from '@/components/appInfoSidebar';
import { SubmittedFeedback } from '@/components/community-dashboard/submitted-feedback';
import DeveloperInstructions from '@/components/developerInstructions';


const DailyProgress = ({ progress, totalDays }: { progress: number, totalDays: number }) => {
    const completedDays = Math.floor(totalDays * (progress || 0) / 100);

    return (
        <div className="w-full grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-3">
            {Array.from({ length: totalDays }, (_, i) => {
                const day = i + 1;
                const isCompleted = day <= completedDays;
                const isCurrent = day === completedDays + 1;

                return (
                    <div
                        key={day}
                        className={cn(
                            "aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all duration-300 shadow-none hover:scale-105",
                            isCurrent
                                ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground scale-110'
                                : 'bg-gradient-to-br from-gray-400/20 to-gray-400/2',
                            isCompleted
                                ? 'bg-gradient-to-br from-green-400/50 to-green-400/20 dark:from-green-400/60 dark:to-green-400/20 text-muted-foreground'
                                : ''
                        )}
                    >
                        {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                            <>
                                <p className={cn("text-[10px] sm:text-xs", isCurrent ? 'opacity-80' : 'text-muted-foreground')}>Day</p>
                                <p className={cn("font-bold", isCurrent ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl')}>{day}</p>
                            </>
                        )}
                    </div>
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
            <div className="container mx-auto px-4 md:px-6">
                <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8 w-1/2">
                    <BackButton href="/community-dashboard" />
                </div>

                <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 mt-8">
                    <div className='flex flex-col gap-10 lg:col-span-2'>
                        <div className="lg:col-span-2 space-y-12">
                            <section>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent h-12 sm:h-14">{app.name}</h1>
                                <p className="text-muted-foreground text-lg leading-relaxed">{app.shortDescription}</p>
                            </section>
                        </div>
                        <section>
                            <DailyProgress progress={app.progress || 0} totalDays={app.totalDays} />
                        </section>

                        <DeveloperInstructions instruction={app.testingInstructions} />

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

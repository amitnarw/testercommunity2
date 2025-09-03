
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { cn } from '@/lib/utils';

const DailyProgress = ({ progress }: { progress: number }) => {
    const totalDays = 14;
    const completedDays = Math.floor(totalDays * (progress || 0) / 100);
    const currentDay = completedDays;

    return (
        <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: totalDays }, (_, i) => {
                const dayNumber = i + 1;
                const isCompleted = dayNumber <= completedDays;
                const isCurrent = dayNumber === currentDay + 1;
                
                return (
                    <div
                        key={dayNumber}
                        className={cn(
                            "p-3 rounded-lg text-center border-2",
                            isCompleted 
                                ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300" 
                                : isCurrent 
                                    ? "bg-primary/10 border-primary/30 text-primary animate-pulse" 
                                    : "bg-secondary/50 border-border/50 text-muted-foreground"
                        )}
                    >
                        <p className="text-xs">Day {dayNumber}</p>
                        {isCompleted && <CheckCircle className="w-5 h-5 mx-auto mt-1" />}
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
    
    const totalDays = 14;
    const daysCompleted = Math.floor(totalDays * (app.progress || 0) / 100);

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <header className="mb-8 max-w-4xl mx-auto">
                    <BackButton href="/community-dashboard" className="mb-4" />
                     <div className="flex items-start gap-6">
                        <Image src={app.icon} alt={app.name} width={100} height={100} className="rounded-2xl border" data-ai-hint={app.dataAiHint} />
                        <div>
                            <h1 className="text-4xl font-bold">{app.name}</h1>
                             <div className="flex items-center gap-4 mt-2">
                                <Badge variant="outline">{app.category}</Badge>
                                <p className="text-sm text-muted-foreground">Requires Android {app.androidVersion}</p>
                                <p className="text-sm text-muted-foreground">~{app.estimatedTime} test</p>
                            </div>
                            <p className="text-primary font-bold text-lg mt-1">Reward: {app.points} Points</p>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto">
                    <Card className="rounded-xl mb-8">
                        <CardHeader>
                            <CardTitle>Testing in Progress</CardTitle>
                            <CardDescription>You have completed {daysCompleted} of {totalDays} days. Keep the app installed and use it occasionally to complete the test.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DailyProgress progress={app.progress || 0} />
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl">
                         <CardHeader>
                            <CardTitle>Instructions</CardTitle>
                            <CardDescription>Remember to follow the developer's instructions.</CardDescription>
                        </CardHeader>
                        <CardContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                            <p>{app.testingInstructions}</p>
                        </CardContent>
                    </Card>
                    
                     <div className="mt-8">
                        <Button size="lg" asChild className="w-full">
                           <Link href={`/community-dashboard/test/${app.id}`}>
                                Submit Feedback
                           </Link>
                        </Button>
                         <Button size="lg" variant="outline" asChild className="w-full mt-4">
                           <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer">
                                Re-open in Google Play <ExternalLink className="ml-2 h-4 w-4" />
                           </a>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}

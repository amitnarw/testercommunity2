
'use client';

import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { AppInfoSidebar } from '@/components/appInfoSidebar';
import { SubmittedFeedback } from '@/components/submitted-feedback';

export default function AppTestingCompletedPage({ params }: { params: { id: string } }) {
    const app = communityApps.find(p => p.id.toString() === params.id && p.status === 'completed');

    if (!app) {
        notFound();
    }

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                <header className="mb-8 max-w-7xl mx-auto">
                    <BackButton href="/community-dashboard" className="mb-4" />
                </header>

                <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
                    <div className='flex flex-col gap-10 lg:col-span-2'>
                        <Card className="rounded-xl mb-8">
                            <CardHeader>
                                <CardTitle>Test Complete!</CardTitle>
                                <CardDescription>Thank you for your contribution to the community.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-green-500/10 rounded-lg text-center border border-green-500/20">
                                    <p className="text-sm text-green-700 dark:text-green-300">You Claimed</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                                        <Star className="w-7 h-7 fill-current" />{app.points.toLocaleString()} Points
                                    </p>
                                    {app.completedDate && <p className="text-xs text-muted-foreground mt-1">on {new Date(app.completedDate).toLocaleDateString()}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <SubmittedFeedback isCompleted={true} />
                        
                    </div>
                    <aside className="lg:col-span-1">
                        <AppInfoSidebar app={app} buttonType="external" url={app?.playStoreUrl} />
                    </aside>
                </main>
            </div>
        </div>
    );
}

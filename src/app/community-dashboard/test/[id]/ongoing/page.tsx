
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { Progress } from '@/components/ui/progress';

export default function AppTestingOngoingPage({ params }: { params: { id: string } }) {
    const app = communityApps.find(p => p.id.toString() === params.id && p.status === 'ongoing');

    if (!app) {
        notFound();
    }

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <header className="mb-8 max-w-4xl mx-auto">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/community-dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Hub</Link>
                    </Button>
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
                            <CardDescription>You have started testing this app. Complete the test to claim your points.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm text-muted-foreground mb-1">
                                    <span>Time Remaining</span>
                                    <span>{14 - Math.floor(14 * (app.progress || 0) / 100)} days left</span>
                                </div>
                                <Progress value={app.progress} className="h-3" />
                            </div>
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

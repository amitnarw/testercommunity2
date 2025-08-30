
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { BackButton } from '@/components/back-button';

export default function AppTestingCompletedPage({ params }: { params: { id: string } }) {
    const app = communityApps.find(p => p.id.toString() === params.id && p.status === 'completed');

    if (!app) {
        notFound();
    }

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
                                <Badge variant="secondary" className="flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Completed
                                </Badge>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto">
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

                    <Card className="rounded-xl">
                         <CardHeader>
                            <CardTitle>Your Feedback</CardTitle>
                            <CardDescription>Here is a summary of the feedback you submitted.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div>
                                <h4 className="font-semibold">What worked well?</h4>
                                <p className="text-muted-foreground text-sm">The onboarding was very smooth and the main feature is intuitive.</p>
                           </div>
                           <Separator />
                           <div>
                                <h4 className="font-semibold">Bugs or issues found:</h4>
                                <p className="text-muted-foreground text-sm">The app crashed when I tried to upload a photo from the gallery.</p>
                           </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}

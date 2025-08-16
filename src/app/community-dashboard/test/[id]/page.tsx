
'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Star, Upload, ExternalLink } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { PointsSidebar } from '@/components/points-sidebar';

export default function AppTestingPage({ params }: { params: { id: string } }) {
    const [isTesting, setIsTesting] = useState(false);
    const [rating, setRating] = useState(0);

    const app = communityApps.find(p => p.id.toString() === params.id);

    if (!app) {
        notFound();
    }

    const handleStartTesting = () => {
        setIsTesting(true);
        // This would open the link in a new tab
        window.open(app.playStoreUrl, '_blank');
    }

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    <div className="lg:col-span-3">
                         <header className="mb-8">
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

                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-6">
                                <Card className="rounded-xl">
                                    <CardHeader>
                                        <CardTitle>Screenshots</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        {app.screenshots.map((ss, index) => (
                                            <Image key={index} src={ss.url} alt={ss.alt} width={400} height={800} className="rounded-lg border" data-ai-hint={ss.dataAiHint}/>
                                        ))}
                                    </CardContent>
                                </Card>
                                <Card className="rounded-xl">
                                    <CardHeader>
                                        <CardTitle>Instructions</CardTitle>
                                        <CardDescription>Follow these instructions from the developer.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                        <p>{app.testingInstructions}</p>
                                    </CardContent>
                                </Card>
                                <Button size="lg" className="w-full" onClick={handleStartTesting} disabled={isTesting}>
                                    {isTesting ? 'Testing in Progress...' : 'Join Testing on Google Play'}
                                    {!isTesting && <ExternalLink className="ml-2 h-4 w-4" />}
                                </Button>
                            </div>

                            <div>
                                <Card className={`rounded-xl transition-all duration-500 ${isTesting ? 'opacity-100' : 'opacity-50 blur-sm'}`}>
                                    <CardHeader>
                                        <CardTitle>Submit Feedback</CardTitle>
                                        <CardDescription>Once you've tested the app, fill out this form.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>What worked well? What did you like?</Label>
                                            <Textarea placeholder="e.g., The onboarding was very smooth and the main feature is intuitive." disabled={!isTesting} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label>Did you find any bugs or issues?</Label>
                                            <Textarea placeholder="e.g., The app crashed when I tried to upload a photo from the gallery." disabled={!isTesting} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label>General UI/UX feedback:</Label>
                                            <Textarea placeholder="e.g., The color contrast in dark mode could be better." disabled={!isTesting} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Overall Rating</Label>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star 
                                                        key={star} 
                                                        className={`w-8 h-8 cursor-pointer transition-all ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/50'}`}
                                                        onClick={() => isTesting && setRating(star)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Upload Screenshot (Optional)</Label>
                                            <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50">
                                                <Upload className="w-8 h-8 text-muted-foreground mb-2"/>
                                                <p className="font-semibold text-sm">Click to upload</p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-col items-start gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="confirmation" disabled={!isTesting} />
                                            <Label htmlFor="confirmation" className="text-sm font-normal text-muted-foreground">I confirm I have installed and tested the app.</Label>
                                        </div>
                                        <Button size="lg" className="w-full" disabled={!isTesting}>Submit Feedback & Claim {app.points} Points</Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1 mt-8 lg:mt-0">
                         <PointsSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}


'use client';

import { useState, Fragment } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Star, Upload, ExternalLink, Smartphone, Clock, FileText, Check, Hourglass, Send } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type TestingState = 'idle' | 'requested' | 'approved';

export default function AppTestingPage({ params }: { params: { id: string } }) {
    const [testingState, setTestingState] = useState<TestingState>('idle');
    const [rating, setRating] = useState(0);

    const app = communityApps.find(p => p.id.toString() === params.id);

    if (!app) {
        notFound();
    }

    const handleRequestToJoin = () => {
        setTestingState('requested');
        // In a real app, this would trigger an API call.
        // For demo purposes, we'll auto-approve after a delay.
        setTimeout(() => {
            setTestingState('approved');
            // This would open the link in a new tab upon approval
            window.open(app.playStoreUrl, '_blank');
        }, 2000);
    }
    
    const isFeedbackDisabled = testingState !== 'approved';

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <header className="mb-8 max-w-5xl mx-auto">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/community-dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Hub</Link>
                    </Button>
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <Image src={app.icon} alt={app.name} width={100} height={100} className="rounded-2xl border" data-ai-hint={app.dataAiHint} />
                        <div className='flex-grow'>
                            <h1 className="text-4xl font-bold">{app.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
                                <Badge variant="outline">{app.category}</Badge>
                                <div className="flex items-center gap-1.5 text-muted-foreground"><Smartphone className="w-4 h-4"/> Requires Android {app.androidVersion}</div>
                                <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-4 h-4"/> ~{app.estimatedTime} test</div>
                            </div>
                        </div>
                        <Card className="p-4 rounded-xl text-center shrink-0">
                            <CardTitle className="text-sm text-muted-foreground">Reward</CardTitle>
                            <div className="text-3xl font-bold text-primary flex items-center gap-2 justify-center">
                                <Star className="w-7 h-7" />
                                {app.points} Points
                            </div>
                        </Card>
                    </div>
                </header>

                <main className="grid md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
                    <div className="space-y-6">
                        <Card className="rounded-xl">
                            <CardHeader>
                                <CardTitle>About the App</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{app.shortDescription}</p>
                            </CardContent>
                        </Card>
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
                         <div className="w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={testingState}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.3 } }}
                                    exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                                >
                                    {testingState === 'idle' && (
                                        <Button size="lg" className="w-full text-lg h-14" onClick={handleRequestToJoin}>
                                            <Send className="mr-2 h-5 w-5"/> Request to Join Testing
                                        </Button>
                                    )}
                                    {testingState === 'requested' && (
                                        <Button size="lg" className="w-full text-lg h-14" disabled>
                                            <Hourglass className="mr-2 h-5 w-5 animate-spin"/> Request Sent, Awaiting Approval...
                                        </Button>
                                    )}
                                     {testingState === 'approved' && (
                                        <Button size="lg" asChild className="w-full text-lg h-14 bg-green-600 hover:bg-green-700">
                                           <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer">
                                                <Check className="mr-2 h-5 w-5"/> Approved! Start Testing on Google Play <ExternalLink className="ml-2 h-4 w-4" />
                                           </a>
                                        </Button>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="space-y-6 relative">
                         <AnimatePresence>
                            {isFeedbackDisabled && (
                                <motion.div 
                                    className="absolute inset-0 bg-background/50 backdrop-blur-md z-10 rounded-xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                ></motion.div>
                            )}
                        </AnimatePresence>
                        <Card className={`rounded-xl transition-all duration-500`}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/> Testing Instructions</CardTitle>
                                <CardDescription>Follow these instructions from the developer.</CardDescription>
                            </CardHeader>
                            <CardContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <p>{app.testingInstructions}</p>
                            </CardContent>
                        </Card>
                        <Card className={`rounded-xl transition-all duration-500`}>
                            <CardHeader>
                                <CardTitle>Submit Feedback</CardTitle>
                                <CardDescription>Once you've tested the app, fill out this form.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>What worked well? What did you like?</Label>
                                    <Textarea placeholder="e.g., The onboarding was very smooth and the main feature is intuitive." disabled={isFeedbackDisabled} />
                                </div>
                                 <div className="space-y-2">
                                    <Label>Did you find any bugs or issues?</Label>
                                    <Textarea placeholder="e.g., The app crashed when I tried to upload a photo from the gallery." disabled={isFeedbackDisabled} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Overall Rating</Label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star 
                                                key={star} 
                                                className={`w-8 h-8 transition-all ${isFeedbackDisabled ? 'text-muted-foreground/30' : 'cursor-pointer'} ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/50'}`}
                                                onClick={() => !isFeedbackDisabled && setRating(star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Upload Screenshot (Optional)</Label>
                                    <div className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center ${isFeedbackDisabled ? '' : 'cursor-pointer hover:bg-secondary/50'}`}>
                                        <Upload className="w-8 h-8 text-muted-foreground mb-2"/>
                                        <p className="font-semibold text-sm">Click to upload</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="confirmation" disabled={isFeedbackDisabled} />
                                    <Label htmlFor="confirmation" className={`text-sm font-normal ${isFeedbackDisabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>I confirm I have installed and tested the app.</Label>
                                </div>
                                <Button size="lg" className="w-full" disabled={isFeedbackDisabled}>Submit Feedback & Claim {app.points} Points</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}


    

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
import { Separator } from '@/components/ui/separator';

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
        setTimeout(() => {
            setTestingState('approved');
            // This would open the link in a new tab upon approval in a real app
            // For demo, we just change the state.
            // window.open(app.playStoreUrl, '_blank');
        }, 2000);
    }
    
    const isFeedbackDisabled = testingState !== 'approved';

    return (
        <div className="bg-background text-foreground min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <header className="mb-12 max-w-5xl mx-auto">
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href="/community-dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Hub</Link>
                    </Button>
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <Image src={app.icon} alt={app.name} width={120} height={120} className="rounded-3xl border bg-background shadow-lg" data-ai-hint={app.dataAiHint} />
                        <div className='flex-grow pt-2'>
                            <Badge variant="outline" className="mb-3">{app.category}</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold">{app.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-muted-foreground">
                                <div className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-primary/80"/> Requires Android {app.androidVersion}</div>
                                <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary/80"/> ~{app.estimatedTime} test</div>
                            </div>
                        </div>
                         <div className="shrink-0 w-full md:w-auto">
                            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-center">
                                <p className="text-sm font-semibold text-primary">REWARD</p>
                                <div className="text-3xl font-bold text-foreground flex items-center gap-2 justify-center mt-1">
                                    <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
                                    {app.points} Points
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto space-y-16">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">About the App</h2>
                        <p className="text-muted-foreground text-base leading-relaxed">{app.shortDescription}</p>
                    </section>

                     <section>
                        <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {app.screenshots.map((ss, index) => (
                                <div key={index} className="overflow-hidden rounded-xl border">
                                    <Image src={ss.url} alt={ss.alt} width={800} height={1600} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" data-ai-hint={ss.dataAiHint}/>
                                </div>
                            ))}
                        </div>
                    </section>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={testingState}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {testingState === 'idle' && (
                                <div className="text-center bg-secondary/50 p-8 rounded-2xl border-dashed">
                                    <h3 className="text-xl font-bold">Ready to test?</h3>
                                    <p className="text-muted-foreground mt-2 mb-6">Request to join the test to get access to the app and feedback form.</p>
                                    <Button size="lg" className="text-lg h-14" onClick={handleRequestToJoin}>
                                        <Send className="mr-2 h-5 w-5"/> Request to Join Testing
                                    </Button>
                                </div>
                            )}
                            {testingState === 'requested' && (
                                <div className="text-center bg-secondary/50 p-8 rounded-2xl border-dashed">
                                    <h3 className="text-xl font-bold">Request Sent!</h3>
                                    <p className="text-muted-foreground mt-2 mb-6">The developer has been notified. You'll be able to start once approved.</p>
                                    <Button size="lg" className="w-full text-lg h-14" disabled>
                                        <Hourglass className="mr-2 h-5 w-5 animate-spin"/> Awaiting Approval...
                                    </Button>
                                </div>
                            )}
                             {testingState === 'approved' && (
                                <div className="text-center bg-green-500/10 p-8 rounded-2xl border-dashed border-green-500/20">
                                     <h3 className="text-xl font-bold text-green-800 dark:text-green-200">You're In!</h3>
                                    <p className="text-green-700 dark:text-green-300/80 mt-2 mb-6">You've been approved to test this app. Follow the instructions below.</p>
                                    <Button size="lg" asChild className="w-full text-lg h-14 bg-green-600 hover:bg-green-700">
                                       <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer">
                                            <Check className="mr-2 h-5 w-5"/> Start Testing on Google Play <ExternalLink className="ml-2 h-4 w-4" />
                                       </a>
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="relative space-y-16">
                         <AnimatePresence>
                            {isFeedbackDisabled && (
                                <motion.div 
                                    className="absolute inset-0 bg-background/80 backdrop-blur-md z-10 rounded-xl"
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{duration: 0.5}}
                                ></motion.div>
                            )}
                        </AnimatePresence>
                        
                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FileText className="w-6 h-6 text-primary"/> Testing Instructions</h2>
                            <div className="prose prose-base dark:prose-invert text-muted-foreground leading-relaxed">
                                <p>{app.testingInstructions}</p>
                            </div>
                        </section>
                        
                        <Separator />

                        <section>
                            <h2 className="text-2xl font-bold mb-2">Submit Feedback</h2>
                            <p className="text-muted-foreground mb-8">Once you've tested the app, fill out this form to claim your points.</p>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-base">What worked well? What did you like?</Label>
                                    <Textarea placeholder="e.g., The onboarding was very smooth and the main feature is intuitive." disabled={isFeedbackDisabled} className="min-h-[120px] text-base" />
                                </div>
                                 <div className="space-y-3">
                                    <Label className="text-base">Did you find any bugs or issues?</Label>
                                    <Textarea placeholder="e.g., The app crashed when I tried to upload a photo from the gallery." disabled={isFeedbackDisabled} className="min-h-[120px] text-base" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base">Overall Rating</Label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star 
                                                key={star} 
                                                className={cn(`w-8 h-8 transition-all`, isFeedbackDisabled ? 'text-muted-foreground/30' : 'cursor-pointer', rating >= star ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/50')}
                                                onClick={() => !isFeedbackDisabled && setRating(star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base">Upload Screenshot (Optional)</Label>
                                    <div className={cn(`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors`, isFeedbackDisabled ? 'border-muted-foreground/20' : 'border-muted-foreground/50 cursor-pointer hover:border-primary hover:bg-secondary/50')}>
                                        <Upload className="w-8 h-8 text-muted-foreground mb-2"/>
                                        <p className="font-semibold">Click or drag file to upload</p>
                                        <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <Checkbox id="confirmation" disabled={isFeedbackDisabled} />
                                        <Label htmlFor="confirmation" className={cn(`text-base font-normal`, isFeedbackDisabled ? 'text-muted-foreground/50' : 'text-muted-foreground')}>I confirm I have installed and tested the app.</Label>
                                    </div>
                                    <Button size="lg" className="w-full text-lg h-14" disabled={isFeedbackDisabled}>Submit Feedback & Claim {app.points} Points</Button>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

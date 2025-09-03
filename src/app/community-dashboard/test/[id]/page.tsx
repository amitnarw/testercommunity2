
'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Upload, ExternalLink, Smartphone, Clock, FileText, Check, Hourglass, Send, X, Expand, Info, ListChecks, MessagesSquare } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BackButton } from '@/components/back-button';
import AnimatedRoundedButton from '@/components/ui/animated-rounded-button';
import { useTheme } from 'next-themes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type TestingState = 'idle' | 'requested' | 'approved';

const AppInfoSidebar = ({ app, testingState, handleRequestToJoin, hoverBgColor, hoverTextColor }: { app: any, testingState: TestingState, handleRequestToJoin: () => void, hoverBgColor: "white" | "black", hoverTextColor: "white" | "black" }) => (
    <div className="sticky top-24 space-y-6">
        <AnimatePresence mode="wait">
            <motion.div
                key={testingState}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-auto"
            >
                {testingState === 'idle' && (
                    <div onClick={handleRequestToJoin} className='relative w-full m-auto'>
                        <AnimatedRoundedButton
                            backgroundColor="hsl(var(--primary))"
                            animatedBackgroundColor={hoverBgColor}
                            hoverTextColor={hoverTextColor}
                            borderRadius='9999px'
                            paddingY="4"
                            paddingX="5"
                        >
                            <div className="flex items-center gap-2">
                                <span className='hidden sm:inline'>Request to Join Testing</span>
                                <span className='sm:hidden'>Request</span>
                            </div>

                        </AnimatedRoundedButton>
                        <div className="p-2 rounded-3xl bg-white absolute top-2 right-2">
                            <Send className="text-primary" />
                        </div>

                    </div>
                )}
                {testingState === 'requested' && (
                    <Button size="lg" className="w-full text-lg h-14" disabled>
                        <Hourglass className="mr-2 h-5 w-5 animate-spin" /> Awaiting Approval...
                    </Button>
                )}
                {testingState === 'approved' && (
                    <Button size="lg" asChild className="w-full text-lg h-14 bg-green-600 hover:bg-green-700">
                        <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer">
                            <Check className="mr-2 h-5 w-5" /> Start Testing on Google Play <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                )}
            </motion.div>
        </AnimatePresence>

        <Card className="border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900 overflow-hidden">
            <CardContent className="p-6 pb-0">
                <div className="flex items-center gap-4 mb-4">
                    <Image src={app.icon} alt={app.name} width={100} height={100} className="rounded-xl border bg-background shadow-sm" data-ai-hint={app.dataAiHint} />
                    <div className='flex flex-col items-start justify-between gap-2'>
                        <Badge variant="outline" className="mt-1 text-md border-none bg-gradient-to-b from-primary to-primary/50 !text-white text-normal">{app.category}</Badge>
                        <div className="flex items-center gap-2 text-sm"><Smartphone className="w-5 h-5 text-primary/80" />Android {app.androidVersion}</div>
                        <div className="flex items-center gap-2 text-sm"><Clock className="w-5 h-5 text-primary/80" /> ~{app.estimatedTime} test</div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-2 bg-gradient-to-b from-primary/0 to-primary/60 rounded-b-2xl relative">
                <div className="w-full p-4 rounded-xl text-center">
                    <p className="text-lg font-semibold text-primary text-start">REWARD</p>
                    <div className="text-3xl font-bold text-foreground flex items-center gap-2 justify-start mt-1">
                        {app.points} Points
                        <Star className="w-7 h-7 text-primary/0 fill-primary/20  scale-[6] absolute bottom-8 right-6 rotate-90" />
                    </div>
                </div>
            </CardFooter>
        </Card>

        <Card className="border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900">
            <CardHeader>
                <CardTitle className="text-base">Developer</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" data-ai-hint="man developer" />
                        <AvatarFallback>DV</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">AppDev Co.</p>
                        <p className="text-xs text-muted-foreground">Member since 2023</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);


export default function AppTestingPage({ params }: { params: { id: string } }) {
    const { theme } = useTheme();
    const [testingState, setTestingState] = useState<TestingState>('idle');
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const app = communityApps.find(p => p.id.toString() === params.id);

    if (!app) {
        notFound();
    }

    const handleRequestToJoin = () => {
        setTestingState('requested');
        setTimeout(() => {
            setTestingState('approved');
        }, 2000);
    }

    const hoverTextColor = theme === 'dark' ? 'black' : 'white';
    const hoverBgColor = theme === 'dark' ? 'white' : 'black';

    return (
        <div className="bg-[#f8fafc] dark:bg-[#0f151e] text-foreground min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                <header className="mb-8 max-w-7xl mx-auto">
                    <BackButton href="/community-dashboard" className="mb-6" />
                </header>

                <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">{app.name}</h1>
                            <p className="text-muted-foreground text-lg mt-2 leading-relaxed">{app.shortDescription}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                            <div className="flex flex-row gap-2 overflow-x-auto pb-4 max-h-[500px]">
                                {app.screenshots.map((ss, index) => (
                                    <div 
                                        key={index} 
                                        className="overflow-hidden rounded-xl flex-shrink-0 w-60 relative group cursor-pointer"
                                        onClick={() => setFullscreenImage(ss.url)}
                                    >
                                        <Image src={ss.url} alt={ss.alt} width={400} height={800} className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" data-ai-hint={ss.dataAiHint} />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Expand className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Sidebar for mobile, shown in flow */}
                        <div className="block lg:hidden">
                            <AppInfoSidebar app={app} testingState={testingState} handleRequestToJoin={handleRequestToJoin} hoverBgColor={hoverBgColor} hoverTextColor={hoverTextColor} />
                        </div>
                        
                        <section>
                            <Card className="bg-secondary/30 border-dashed">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Info className="w-6 h-6 text-primary" /> How Testing Works</CardTitle>
                                    <CardDescription>Read these rules carefully to ensure you get your points.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-muted-foreground">
                                   <p><strong>1. Complete the Full Cycle:</strong> You must keep the app installed and use it occasionally for the entire 14-day testing period. Points are only awarded after successful completion.</p>
                                   <p><strong>2. No Skipping Days:</strong> If you uninstall the app or fail to engage with it, your testing progress will reset to Day 1. Consistency is key!</p>
                                   <p><strong>3. Provide Quality Feedback:</strong> Once your test is ongoing, you'll be able to submit bugs, suggestions, or general feedback via the 'Ongoing Tests' tab. You will be able to see a log of your submitted feedback on that page.</p>
                                </CardContent>
                            </Card>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ListChecks className="w-6 h-6 text-primary" /> General Testing Instructions</h2>
                            <div className="prose prose-base dark:prose-invert text-muted-foreground leading-relaxed">
                                <p>Welcome, tester! Your mission is to use this app as you normally would. Explore its features, try different functions, and see how it feels. Pay attention to anything that seems confusing, broken, or particularly delightful. All feedback is valuable!</p>
                            </div>
                        </section>
                        
                        <Separator />

                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><MessagesSquare className="w-6 h-6 text-primary" /> Developer's Instructions</h2>
                            <div className="prose prose-base dark:prose-invert text-muted-foreground leading-relaxed">
                                <p>{app.testingInstructions}</p>
                            </div>
                        </section>
                    </div>
                    <aside className="lg:col-span-1 hidden lg:block">
                        <AppInfoSidebar app={app} testingState={testingState} handleRequestToJoin={handleRequestToJoin} hoverBgColor={hoverBgColor} hoverTextColor={hoverTextColor} />
                    </aside>
                </main>
            </div>
             {fullscreenImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
                    onClick={() => setFullscreenImage(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/20 h-12 w-12 rounded-full"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <X className="w-8 h-8" />
                        <span className="sr-only">Close</span>
                    </Button>
                    <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
                        <Image
                            src={fullscreenImage}
                            alt="Fullscreen view"
                            layout="fill"
                            objectFit="contain"
                            className="animate-in zoom-in-95"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

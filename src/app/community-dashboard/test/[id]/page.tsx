
'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Expand, Trophy, RefreshCw, CheckCircle, Compass, PenTool, Smile, ThumbsUp, X } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { AppInfoSidebar } from '@/components/appInfoSidebar';


export default function AppTestingPage({ params }: { params: { id: string } }) {

    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const app = communityApps.find(p => p.id.toString() === params.id);

    if (!app) {
        notFound();
    }

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
                            <AppInfoSidebar app={app} />
                        </div>

                        <section className='!mt-20'>
                            <h2 className="text-2xl font-bold mb-4">Testing Protocol</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="p-4 bg-gradient-to-br from-secondary to-secondary/50 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><CheckCircle className="w-5 h-5" /></div>
                                        <h3 className="font-semibold">Complete the Full Cycle</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground">You must keep the app installed for the entire 14-day period. Points are awarded only after successful completion.</p>
                                </Card>
                                <Card className="p-4 bg-gradient-to-br from-secondary to-secondary/50 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><RefreshCw className="w-5 h-5" /></div>
                                        <h3 className="font-semibold">No Skipping Days</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground">If you uninstall the app or fail to engage, your progress will reset to Day 1. Consistency is key!</p>
                                </Card>
                                <Card className="p-4 bg-gradient-to-br from-secondary to-secondary/50 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Trophy className="w-5 h-5" /></div>
                                        <h3 className="font-semibold">Provide Quality Feedback</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Once ongoing, you can submit feedback via the 'Ongoing Tests' tab. Quality feedback helps everyone.</p>
                                </Card>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Developer's Instructions <span className="bg-gradient-to-b from-primary to-primary/50 text-white font-bold rounded-lg px-4 py-0.5 text-xl ml-2">Important</span></h2>
                            <div className="prose prose-base dark:prose-invert leading-relaxed text-white dark:text-black bg-[#121212] dark:bg-white p-6 rounded-lg border-primary border-l-4 shadow-xl shadow-gray-300 dark:shadow-gray-700">
                                <p>{app.testingInstructions}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">General Testing Instructions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-secondary p-4 rounded-lg flex items-start gap-3">
                                    <Compass className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold">Explore Freely</h4>
                                        <p className="text-muted-foreground">Use the app as you normally would. Explore different screens, features, and user flows.</p>
                                    </div>
                                </div>
                                <div className="bg-secondary p-4 rounded-lg flex items-start gap-3">
                                    <Smile className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold">Note Your Feelings</h4>
                                        <p className="text-muted-foreground">Pay attention to what feels delightful, confusing, or frustrating. All emotional feedback is valuable.</p>
                                    </div>
                                </div>
                                <div className="bg-secondary p-4 rounded-lg flex items-start gap-3">
                                    <PenTool className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold">Be Specific</h4>
                                        <p className="text-muted-foreground">When you find a bug, describe the steps to reproduce it. Clear context helps developers fix issues faster.</p>
                                    </div>
                                </div>
                                <div className="bg-secondary p-4 rounded-lg flex items-start gap-3">
                                    <ThumbsUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold">Be Constructive</h4>
                                        <p className="text-muted-foreground">The goal is to help developers improve. Frame your feedback constructively and respectfully.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                    <aside className="lg:col-span-1 hidden lg:block">
                        <AppInfoSidebar app={app} />
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

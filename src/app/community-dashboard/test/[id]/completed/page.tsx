
'use client';

import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, CheckCircle } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { AppInfoSidebar } from '@/components/appInfoSidebar';
import { SubmittedFeedback } from '@/components/submitted-feedback';
import { useState, useEffect } from 'react';
import Confetti from 'react-dom-confetti';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const TestCompleteSection = ({ app }: { app: any }) => {
    const [isConfettiActive, setConfettiActive] = useState(false);
    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    });

    useEffect(() => {
        if (inView) {
            setTimeout(() => setConfettiActive(true), 300);
        }
    }, [inView]);

    return (
        <Card
            ref={ref}
            className="relative overflow-hidden rounded-2xl p-6 text-center bg-background shadow-lg"
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-64 h-64 bg-gradient-to-tr from-green-400/50 to-primary/30 rounded-full blur-3xl opacity-30 animate-pulse" />
            </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <Confetti active={isConfettiActive} config={{
                    angle: 90,
                    spread: 200,
                    startVelocity: 30,
                    elementCount: 150,
                    dragFriction: 0.1,
                    duration: 4000,
                    stagger: 3,
                    width: "10px",
                    height: "10px",
                    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
                }} />
            </div>
             <div className="relative z-10 flex flex-col items-center">
                <div className="p-3 bg-green-500/10 rounded-full border border-green-500/20 mb-3">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Test Complete!</h2>
                
                <div className="mt-4">
                    <p className="text-sm text-muted-foreground">You earned</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                        <Star className="w-8 h-8 fill-green-500 text-green-500" />{app.points.toLocaleString()}
                    </p>
                    <p className="text-xl font-semibold text-muted-foreground -mt-1">Points</p>
                </div>
            </div>
        </Card>
    )
}

export default function AppTestingCompletedPage({ params }: { params: { id: string } }) {
    const app = communityApps.find(p => p.id.toString() === params.id && p.status === 'completed');

    if (!app) {
        notFound();
    }

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <header className="mb-8 max-w-7xl mx-auto">
                    <BackButton href="/community-dashboard" className="mb-4" />
                </header>

                <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
                    <div className='flex flex-col gap-10 lg:col-span-2'>
                        
                        <TestCompleteSection app={app} />

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

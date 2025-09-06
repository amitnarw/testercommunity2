
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
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl p-8 text-center bg-gradient-to-br from-green-500/10 via-background to-background mb-12"
        >
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
             <div className="relative z-10">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold">Test Complete!</h2>
                <p className="text-muted-foreground mt-1">Thank you for your contribution to the community.</p>

                <div className="mt-6">
                    <p className="text-sm text-green-700 dark:text-green-300">You Claimed</p>
                    <p className="text-5xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                        <Star className="w-10 h-10 fill-current" />{app.points.toLocaleString()}
                    </p>
                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400">Points</p>

                    {app.completedDate && <p className="text-xs text-muted-foreground mt-2">on {new Date(app.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                </div>
            </div>
        </motion.div>
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

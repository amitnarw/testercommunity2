
'use client';

import { notFound } from 'next/navigation';
import { CheckCircle, Bug, Lightbulb, PartyPopper } from 'lucide-react';
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
            setTimeout(() => setConfettiActive(true), 500);
        }
    }, [inView]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring' } }
    };

    // Mock data for feedback breakdown, as it's not in the app object
    const feedbackBreakdown = {
        bugs: 3,
        suggestions: 2,
        praise: 1,
        totalTesters: 15,
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-2 auto-rows-auto gap-4"
        >
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-500/20 to-green-500/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/20 mb-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-green-500">Test Complete!</h2>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-primary to-primary/40 p-6 rounded-2xl flex flex-col justify-center items-center text-center overflow-hidden">
                <p className="text-sm text-white/80">Points Earned</p>
                <p className="text-6xl sm:text-7xl font-bold text-white">{app.points.toLocaleString()}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-card p-6 pt-4 rounded-2xl col-span-2 row-start-2 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Confetti active={isConfettiActive} config={{
                        angle: 90,
                        spread: 360,
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
                <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-b from-primary to-primary/50 text-transparent bg-clip-text">Your Feedback Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground p-5 rounded-lg">
                        <p className="text-xs">Total Testers</p>
                        <p className="text-4xl font-bold">{feedbackBreakdown?.totalTesters}</p>
                    </div>
                    <div className="bg-gradient-to-bl from-red-500/20 to-red-500/10 p-5 rounded-lg relative overflow-hidden">
                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-red-500">
                            <Bug />
                        </div>
                        <p className="text-xs text-muted-foreground">Bugs</p>
                        <p className="text-4xl font-bold">{feedbackBreakdown.bugs}</p>
                    </div>
                    <div className="bg-gradient-to-bl from-yellow-500/20 to-yellow-500/10 p-5 rounded-lg relative overflow-hidden">
                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-yellow-500">
                            <Lightbulb />
                        </div>
                        <p className="text-xs text-muted-foreground">Suggestions</p>
                        <p className="text-4xl font-bold">{feedbackBreakdown.suggestions}</p>
                    </div>
                    <div className="bg-gradient-to-bl from-green-500/20 to-green-500/10 p-5 rounded-lg relative overflow-hidden">
                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-90 text-green-500">
                            <PartyPopper />
                        </div>
                        <p className="text-xs text-muted-foreground">Praise</p>
                        <p className="text-4xl font-bold">{feedbackBreakdown.praise}</p>
                    </div>
                </div>
            </motion.div>
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
            <div className="container mx-auto px-4 md:px-6">
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


'use client';

import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { AppInfoSidebar } from '@/components/appInfoSidebar';
import { SubmittedFeedback } from '@/components/submitted-feedback';
import { useState, useEffect } from 'react';
import Confetti from 'react-dom-confetti';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

    return (
        <Card
            ref={ref}
            className="relative overflow-hidden rounded-2xl bg-card shadow-lg text-center flex flex-col"
        >
            <CardHeader className="p-6">
                 <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/20">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-bold mt-2">Test Complete!</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                 <div className="relative">
                    <p className="text-sm text-muted-foreground">You earned</p>
                    <p className="text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent my-1">
                       {app.points.toLocaleString()}
                    </p>
                    <p className="text-2xl font-semibold text-muted-foreground -mt-1 flex items-center justify-center gap-2">
                         <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> Points
                    </p>
                </div>
            </CardContent>
             <CardFooter className="p-6 pt-0 mt-4">
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
                 <Button asChild className="w-full">
                    <Link href="/community-dashboard">Back to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardFooter>
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

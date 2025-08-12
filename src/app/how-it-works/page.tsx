
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { communityPathSteps, professionalPathSteps } from '@/lib/data';
import { RoadmapStepCard } from '@/components/roadmap-step-card';
import { ArrowRight, Rocket, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Confetti from 'react-dom-confetti';
import { useState, useEffect } from 'react';


const HorizontalRoadmap = ({ steps, isPro }: { steps: typeof communityPathSteps, isPro: boolean }) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end'],
    });

    const totalSteps = steps.length;
    const scrollEndpoint = totalSteps > 1 ? (totalSteps - 1) / totalSteps : 1;
    const x = useTransform(scrollYProgress, [0, scrollEndpoint], ["0%", `-${100 * (totalSteps - 1)}%`]);

    return (
        <section ref={targetRef} style={{ height: `${totalSteps * 100}vh` }} className="relative">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex">
                    {steps.map((step) => (
                        <div key={step.step} className="w-screen h-screen flex-shrink-0">
                            <RoadmapStepCard step={step} isPro={isPro} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};


export default function HowItWorksPage() {
    const [showConfetti, setShowConfetti] = useState(false);
    const launchpadRef = useRef(null);

      useEffect(() => {
        const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
            setShowConfetti(true);
            }
        },
        {
            threshold: 0.5,
        }
        );

        const currentRef = launchpadRef.current;
        if (currentRef) {
        observer.observe(currentRef);
        }

        return () => {
        if (currentRef) {
            observer.unobserve(currentRef);
        }
        };
    }, []);

    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 40,
        elementCount: 100,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        perspective: "500px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };

    return (
        <div className="bg-background text-foreground">
            <section className="h-screen w-full flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-5xl md:text-7xl font-bold">Two Paths to a Perfect App</h1>
                <p className="mt-6 max-w-3xl mx-auto text-muted-foreground text-xl">
                    Whether you're an indie dev looking for community feedback or a business needing professional precision, your journey to a flawless launch starts here.
                </p>
                <p className="mt-8 text-sm text-muted-foreground animate-pulse">Scroll down to begin your journey</p>
            </section>
            
            <section className="w-full py-16 md:py-20 bg-secondary/30 dark:bg-secondary/20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold inline-flex items-center gap-3"><Users className="w-10 h-10 text-primary"/>The Community Path</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                            Leverage the power of the crowd. Test other apps to earn points, then spend them to get your own app tested by a diverse community of passionate users.
                        </p>
                    </div>
                </div>
                 <HorizontalRoadmap steps={communityPathSteps} isPro={false} />
            </section>
            
            <section className="w-full py-16 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold inline-flex items-center gap-3"><Briefcase className="w-10 h-10 text-primary"/>The Professional Path</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                            For when you need certainty. Hire vetted QA professionals who provide expert feedback, detailed reports, and guaranteed results for a flawless launch.
                        </p>
                    </div>
                </div>
                 <HorizontalRoadmap steps={professionalPathSteps} isPro={true} />
            </section>

             <motion.section 
                ref={launchpadRef}
                className="h-screen w-full flex flex-col items-center justify-center text-center p-4 relative overflow-hidden bg-secondary/30 dark:bg-secondary/20"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Confetti active={showConfetti} config={confettiConfig} />
                </div>
                <Rocket className="w-16 h-16 text-primary mb-4" />
                <h2 className="text-5xl md:text-7xl font-bold">You've Reached the <span className="text-primary">Launchpad</span></h2>
                <p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-xl">
                Your journey to a flawless app starts now. Choose your path and launch with the confidence of knowing your app is truly ready for the world.
                </p>
                <div className="mt-10">
                <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-xl hover:shadow-lg hover:shadow-primary/30">
                    <Link href="/signup">Begin Your Ascent <ArrowRight className="ml-2" /></Link>
                </Button>
                </div>
            </motion.section>
        </div>
    );
}

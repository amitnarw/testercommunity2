
'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { communityPathSteps, professionalPathSteps } from '@/lib/data';
import { RoadmapStepCard } from '@/components/roadmap-step-card';
import { ArrowRight, ArrowDown, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { RoadmapStep } from '@/lib/types';
import Confetti from 'react-dom-confetti';
import { useInView } from 'react-intersection-observer';


gsap.registerPlugin(ScrollTrigger);

const HorizontalScrollSection = ({ steps, isPro }: { steps: RoadmapStep[], isPro: boolean }) => {
    const component = useRef<HTMLDivElement>(null);
    const slider = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            let panels = gsap.utils.toArray<HTMLDivElement>(".panel", slider.current!);
            gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: component.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (panels.length - 1),
                    end: () => "+=" + slider.current?.offsetWidth
                }
            });
        }, component);
        return () => ctx.revert();
    }, [steps]);

    return (
        <div className="relative" ref={component}>
            <div ref={slider} className="flex w-fit">
                {steps.map((step, index) => (
                    <div key={index} className="panel w-screen h-screen">
                        <RoadmapStepCard step={step} isPro={isPro} />
                    </div>
                ))}
            </div>
        </div>
    );
};


export default function HowItWorksPage() {
    const [isConfettiActive, setConfettiActive] = useState(false);
    const { ref: launchpadRef, inView: launchpadInView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    });

    useEffect(() => {
        if (launchpadInView) {
            setTimeout(() => setConfettiActive(true), 300);
        }
    }, [launchpadInView]);
    
    const handleScrollDown = () => {
        const communitySection = document.getElementById('community-path-section');
        if (communitySection) {
            communitySection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="bg-background text-foreground overflow-x-hidden">
             <section className="h-screen w-full flex flex-col items-center justify-center text-center p-4 bg-dot-pattern dark:bg-dot-pattern-dark relative">
                <h1 className="text-5xl md:text-7xl font-bold">The Path to a <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Perfect App</span></h1>
                <p className="mt-6 max-w-3xl mx-auto text-muted-foreground text-xl">
                    Our unified process ensures quality, whether you leverage the community or hire professionals. Your journey to a flawless launch starts here.
                </p>
                <div 
                    onClick={handleScrollDown}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
                >
                    <span className="text-sm text-muted-foreground animate-pulse">Scroll down to see how it works</span>
                    <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10">
                        <ArrowDown className="w-5 h-5 text-primary transition-transform group-hover:translate-y-1" />
                    </div>
                </div>
            </section>
            
            <section id="community-path-section" className="py-20 md:py-32 container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold">The Community Path</h2>
                    <p className="mt-4 text-muted-foreground text-lg">Test other apps to earn points, then use those points to get your own app tested for free. It's a powerful, reciprocal ecosystem.</p>
                </div>
            </section>
            
            <HorizontalScrollSection steps={communityPathSteps} isPro={false} />

            <section className="py-20 md:py-32 container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold">The Professional Path</h2>
                    <p className="mt-4 text-muted-foreground text-lg">Need guaranteed, high-quality results on a tight deadline? Hire our vetted professional testers for your critical projects.</p>
                </div>
            </section>

            <HorizontalScrollSection steps={professionalPathSteps} isPro={true} />

            <section 
                ref={launchpadRef}
                className="h-screen w-full flex flex-col items-center justify-center text-center p-4 relative overflow-hidden bg-secondary/30 dark:bg-secondary/20"
            >
                 <div className="absolute top-1/2 left-1/2">
                    <Confetti active={isConfettiActive} config={{
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
                    }}/>
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
            </section>
        </main>
    );
}

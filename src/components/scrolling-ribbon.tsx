'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const RibbonText = () => (
    <>
        <span className="mx-8">Join the Tribe</span>
        <span className="text-primary-foreground/50 mx-8">•</span>
        <span className="mx-8">Find Bugs</span>
        <span className="text-primary-foreground/50 mx-8">•</span>
        <span className="mx-8">Get Paid</span>
        <span className="text-primary-foreground/50 mx-8">•</span>
        <span className="mx-8">Level Up Your Skills</span>
        <span className="text-primary-foreground/50 mx-8">•</span>
    </>
)

export function ScrollingRibbon() {
    const ribbonRef1 = useRef<HTMLDivElement>(null);
    const ribbonRef2 = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            lastScrollY.current = window.scrollY;

            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    if (ribbonRef1.current) {
                        const speed = -0.35;
                        const movement = lastScrollY.current * speed;
                        ribbonRef1.current.style.transform = `translateX(${movement}px)`;
                    }
                     if (ribbonRef2.current) {
                        const speed = 0.35;
                        const movement = (lastScrollY.current * speed) - 1000;
                        ribbonRef2.current.style.transform = `translateX(${movement}px)`;
                    }
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <section className="w-full overflow-hidden bg-primary py-4 my-20 md:my-28 transform -skew-y-2 space-y-4">
            <div className="flex whitespace-nowrap text-2xl md:text-3xl font-bold uppercase tracking-wider text-primary-foreground select-none">
                <div ref={ribbonRef1} className="flex">
                    <RibbonText />
                    <RibbonText />
                    <RibbonText />
                    <RibbonText />
                </div>
            </div>
             <div className="flex whitespace-nowrap text-2xl md:text-3xl font-bold uppercase tracking-wider text-primary-foreground select-none">
                <div ref={ribbonRef2} className="flex">
                    <RibbonText />
                    <RibbonText />
                    <RibbonText />
                    <RibbonText />
                </div>
            </div>
        </section>
    );
}

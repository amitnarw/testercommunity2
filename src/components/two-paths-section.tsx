
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const useIntersectionObserver = (options: IntersectionObserverInit) => {
    const [entry, setEntry] = useState<IntersectionObserverEntry>();
    const [node, setNode] = useState<HTMLElement | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(([entry]) => setEntry(entry), options);

        const { current: currentObserver } = observer;

        if (node) currentObserver.observe(node);

        return () => currentObserver.disconnect();
    }, [node, options]);

    return [setNode, entry] as const;
};

const AnimatedDiv = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const [ref, entry] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
    const isVisible = entry?.isIntersecting;

    return (
        <div
            ref={ref}
            className={cn(
                'transition-opacity duration-1000',
                isVisible ? 'opacity-100' : 'opacity-0',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export function TwoPathsSection() {
    return (
        <section className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <AnimatedDiv className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">A Community-First Approach</h2>
                    <p className="mt-4 text-muted-foreground">
                        Our platform is built on a reciprocal "give-to-get" model. Contribute your testing skills to the community and get your own app tested in return.
                    </p>
                </AnimatedDiv>
                
                <div className="grid md:grid-cols-1 gap-8">
                    {/* Path 1: Community */}
                    <Link href="/signup" className="group relative block rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format&fit=crop')" }}
                            data-ai-hint="collaboration interface"
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                        <div className="relative flex flex-col justify-end h-[500px] p-8 text-white">
                            <h3 className="text-3xl font-bold mb-2">Test Apps, Earn Points</h3>
                            <p className="text-white/80 mb-6">Join our reciprocal ecosystem. Test community apps to earn points, then use those points to get your own apps tested for free or redeem them for paid services.</p>
                             <div className="flex items-center gap-2 text-lg font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Join the Community <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}

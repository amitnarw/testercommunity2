
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
                    <h2 className="text-3xl md:text-4xl font-bold">Two Paths to Perfect Testing</h2>
                    <p className="mt-4 text-muted-foreground">
                        Whether you want to harness the power of community or hire dedicated professionals, we've got you covered.
                    </p>
                </AnimatedDiv>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Path 1: Community */}
                    <Link href="/signup" className="group relative block rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format&fit=crop')" }}
                            data-ai-hint="collaboration interface"
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                        <div className="relative flex flex-col justify-end h-[500px] p-8 text-white">
                            <h3 className="text-3xl font-bold mb-2">Test Apps, Earn Rewards</h3>
                            <p className="text-white/80 mb-6">Join our reciprocal ecosystem. Test community apps to earn points, then use those points to get your own apps tested.</p>
                             <div className="flex items-center gap-2 text-lg font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Join the Community <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>

                    {/* Path 2: Paid */}
                    <Link href="/marketplace" className="group relative block rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                        <div 
                           className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop')" }}
                           data-ai-hint="professional meeting"
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                        <div className="relative flex flex-col justify-end h-[500px] p-8 text-white">
                            <h3 className="text-3xl font-bold mb-2">Hire Professionals</h3>
                            <p className="text-white/80 mb-6">Need guaranteed results? Browse our marketplace of vetted professional testers and hire them for your critical projects.</p>
                            <div className="flex items-center gap-2 text-lg font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Browse Testers <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}

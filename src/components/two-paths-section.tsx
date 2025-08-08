
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
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
    const [ref, entry] = useIntersectionObserver({ threshold: 0.1 });
    const isVisible = entry?.isIntersecting;

    return (
        <div
            ref={ref}
            className={cn(
                'transition-opacity duration-1000',
                isVisible ? 'animate-fade-in-up' : 'opacity-0',
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
        <section className="py-20 md:py-28 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <AnimatedDiv className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold">Two Paths to Perfect Testing</h2>
                    <p className="mt-4 text-muted-foreground">
                        Whether you want to harness the power of community or hire dedicated professionals, we've got you covered.
                    </p>
                </AnimatedDiv>

                <div className="mt-16 grid md:grid-cols-2 gap-16 items-start">
                    <div className="md:sticky md:top-24">
                        <AnimatedDiv>
                            <div className="relative aspect-square">
                                <Image 
                                    src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format&fit=crop" 
                                    alt="Community testing dashboard" 
                                    layout="fill" 
                                    objectFit="cover" 
                                    className="rounded-2xl shadow-2xl shadow-primary/10"
                                    data-ai-hint="collaboration interface"
                                />
                            </div>
                        </AnimatedDiv>
                    </div>
                    <div className="space-y-24">
                         <AnimatedDiv className="space-y-6 bg-background/50 p-8 rounded-xl backdrop-blur-sm">
                            <Badge variant="secondary">Community-Powered</Badge>
                            <h3 className="text-3xl font-bold">Test Apps, Earn Rewards</h3>
                            <p className="text-muted-foreground">
                                Join a reciprocal ecosystem where you test community-submitted apps to earn points. Redeem those points to get your own apps tested by professionals. It's a powerful way to get valuable feedback while contributing to the community.
                            </p>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" /><span>Test community apps to earn points.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" /><span>Submit your own apps for in-depth testing.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" /><span>Use points to hire individual expert testers.</span></li>
                            </ul>
                            <Button asChild className="rounded-xl">
                                <Link href="/signup">Join the Community</Link>
                            </Button>
                        </AnimatedDiv>
                         <AnimatedDiv className="space-y-6 bg-background/50 p-8 rounded-xl backdrop-blur-sm">
                            <Badge>Paid Service</Badge>
                            <h3 className="text-3xl font-bold">Hire Dedicated Professionals</h3>
                            <p className="text-muted-foreground">
                                Need guaranteed, expert-level testing for your critical projects? Browse our marketplace of vetted professional testers and hire them on an hourly or project basis. This is a straightforward, paid service with no free trials.
                            </p>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" /><span>Purely a paid service for guaranteed results.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" /><span>No free or trial plans available.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" /><span>Access top-tier, vetted talent on-demand.</span></li>
                            </ul>
                            <Button asChild variant="outline" className="rounded-xl">
                                <Link href="/marketplace">Browse Testers</Link>
                            </Button>
                        </AnimatedDiv>
                    </div>
                </div>
            </div>
        </section>
    );
}

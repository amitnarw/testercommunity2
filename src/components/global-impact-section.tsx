
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Bug, Code, ArrowRight, TrendingUp, CheckCircle, ShieldCheck, Palette, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const AnimatedCounter = ({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            const controls = {
                stop: () => {},
            };
            
            let frame = 0;
            const totalFrames = 100; // a bit faster
            const from = 0;
            const animate = () => {
                frame++;
                const progress = Math.min(frame / totalFrames, 1);
                const current = Math.round(from + (to - from) * progress);
                setCount(current);

                if (frame < totalFrames) {
                    controls.stop = requestAnimationFrame(animate);
                }
            };
            
            controls.stop = requestAnimationFrame(animate);

            return () => cancelAnimationFrame(controls.stop as unknown as number);
        }
    }, [isInView, to]);

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const StatCard = ({ icon, title, children, className, ...props }: { icon?: React.ReactNode, title: string, children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={cn(
                "rounded-2xl border border-primary/20 p-6 shadow-lg relative overflow-hidden",
                "flex flex-col",
                className
            )}
            {...props}
        >
             <div className="flex items-center gap-3 mb-3 z-10">
                {icon && <div className="bg-background/20 text-foreground p-2 rounded-lg flex-shrink-0">
                    {icon}
                </div>}
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <div className="flex-grow flex flex-col justify-center z-10">
                {children}
            </div>
        </motion.div>
    )
};

export function GlobalImpactSection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    });
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 30]);

    return (
        <section ref={sectionRef} className="py-20 md:py-32 bg-secondary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern-dark opacity-30 z-0"></div>
            
             <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 md:w-[600px] md:h-[600px] w-[300px] h-[300px]"
                style={{ rotate }}
            >
                <Globe className="w-full h-full text-primary/10" strokeWidth={0.5} />
            </motion.div>
            
            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center justify-center lg:w-[80%] lg:mx-auto">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 
                        className="text-3xl md:text-5xl font-bold mt-4"
                    >
                        From Local <span className="text-primary">₹999</span> to Global Ripples
                    </h2>
                     <p className="mt-4 text-muted-foreground text-lg">
                        Our platform empowers developers and testers worldwide, creating a virtuous cycle of quality and innovation. Here's a look at our collective impact.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                    <StatCard title="Thriving Community" icon={<Users className="w-6 h-6"/>} className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-accent/20">
                         <div className="relative z-10 h-full flex flex-col justify-center">
                            <p className="text-4xl sm:text-5xl font-bold"><AnimatedCounter to={20000} suffix="+" /></p>
                            <p className="text-muted-foreground mt-2">Vetted testers available across <span className="font-bold text-foreground">100+</span> countries.</p>
                        </div>
                    </StatCard>
                    <StatCard title="Bugs Squashed" icon={<Bug className="w-6 h-6"/>} className="bg-gradient-to-br from-primary/30 to-accent/40 text-foreground">
                        <p className="text-4xl sm:text-5xl font-bold"><AnimatedCounter to={500000} suffix="+" /></p>
                        <p className="text-muted-foreground">Bugs identified and resolved.</p>
                    </StatCard>
                     <StatCard title="Projects Accelerated" icon={<TrendingUp className="w-6 h-6"/>} className="bg-gradient-to-br from-primary/30 to-accent/40 text-foreground">
                        <p className="text-4xl sm:text-5xl font-bold"><AnimatedCounter to={1000000} prefix="~" suffix="+" /></p>
                        <p className="text-muted-foreground">Development hours saved.</p>
                    </StatCard>
                    <StatCard title="Developer Tools" icon={<Code className="w-6 h-6"/>} className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-accent/20">
                        <div className="relative z-10">
                            <p className="text-4xl sm:text-5xl font-bold"><AnimatedCounter to={100} suffix="M+" /></p>
                            <p className="text-muted-foreground mt-2">Lines of code analyzed.</p>
                        </div>
                    </StatCard>
                     <StatCard title="Security First" icon={<ShieldCheck className="w-6 h-6"/>} className="bg-gradient-to-br from-primary/20 to-accent/30">
                        <p className="text-4xl sm:text-5xl font-bold"><AnimatedCounter to={1200} suffix="+" /></p>
                        <p className="text-muted-foreground">Critical vulnerabilities found.</p>
                    </StatCard>
                    <StatCard title="Tester Payouts" icon={<IndianRupee className="w-6 h-6"/>} className="bg-gradient-to-br from-primary/20 to-accent/30">
                        <p className="text-4xl sm:text-5xl font-bold"><AnimatedCounter to={5000000} prefix="₹" /></p>
                        <p className="text-muted-foreground">Paid to our testing community.</p>
                    </StatCard>
                </div>
            </div>
        </section>
    );
}

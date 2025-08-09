
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Bug, Code, ArrowRight, TrendingUp, CheckCircle, ShieldCheck, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const StatCard = ({ icon, title, children, className }: { icon: React.ReactNode, title: string, children: React.ReactNode, className?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn(
                "bg-background/50 backdrop-blur-lg rounded-2xl border border-primary/20 p-6 shadow-lg",
                "flex flex-col",
                className
            )}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    {icon}
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <div className="flex-grow space-y-2">
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

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <StatCard title="A Thriving Community" icon={<Users className="w-6 h-6"/>} className="md:col-span-2">
                        <p className="text-3xl sm:text-4xl font-bold"><AnimatedCounter to={20000} suffix="+" /></p>
                        <p className="text-muted-foreground">Vetted testers available across <span className="font-bold text-foreground">100+</span> countries.</p>
                    </StatCard>
                    <StatCard title="Bugs Squashed" icon={<Bug className="w-6 h-6"/>}>
                        <p className="text-3xl sm:text-4xl font-bold"><AnimatedCounter to={500000} suffix="+" /></p>
                        <p className="text-muted-foreground">Bugs identified, including over <span className="font-bold text-foreground">1,200</span> critical security vulnerabilities.</p>
                    </StatCard>
                    <StatCard title="Projects Accelerated" icon={<TrendingUp className="w-6 h-6"/>}>
                        <p className="text-3xl sm:text-4xl font-bold"><AnimatedCounter to={1000000} prefix="~" suffix="+" /></p>
                        <p className="text-muted-foreground">Development hours saved, equivalent to <span className="font-bold text-foreground">114 years</span> of coding time.</p>
                    </StatCard>
                    <StatCard title="Apps Improved" icon={<CheckCircle className="w-6 h-6"/>} className="md:col-span-2">
                        <p className="text-3xl sm:text-4xl font-bold"><AnimatedCounter to={8500} suffix="+" /></p>
                        <p className="text-muted-foreground">High-impact usability issues fixed, leading to better user experiences.</p>
                    </StatCard>
                </div>
            </div>
        </section>
    );
}

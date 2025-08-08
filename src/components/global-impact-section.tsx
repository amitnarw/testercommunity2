
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Bug, Code } from 'lucide-react';

const AnimatedCounter = ({ to }: { to: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            const controls = {
                stop: () => {},
            };
            
            let frame = 0;
            const totalFrames = 120; // 2 seconds at 60fps
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

            return () => cancelAnimationFrame(controls.stop as number);
        }
    }, [isInView, to]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
};

const stats = [
    {
        icon: <Globe className="w-8 h-8" />,
        value: 100,
        suffix: '+',
        label: 'Countries Reached',
    },
    {
        icon: <Users className="w-8 h-8" />,
        value: 20000,
        suffix: '+',
        label: 'Testers Engaged',
    },
    {
        icon: <Bug className="w-8 h-8" />,
        value: 500000,
        suffix: '+',
        label: 'Bugs Squashed',
    },
    {
        icon: <Code className="w-8 h-8" />,
        value: 1,
        suffix: 'M+',
        label: 'Developer Hours Saved',
    },
]

export function GlobalImpactSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-200px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };


    return (
        <section ref={ref} className="py-20 md:py-32 bg-secondary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern-dark opacity-30"></div>
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: "url('https://www.datocms-assets.com/104595/1692113271-globe.png')", backgroundPosition: 'center 20%'}}
                data-ai-hint="globe"
            ></div>
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    className="text-center max-w-3xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.h2 
                        variants={itemVariants}
                        className="text-3xl md:text-5xl font-bold mt-4"
                    >
                        From Local <span className="text-primary">₹999</span> to Global Ripples
                    </motion.h2>
                    <motion.p 
                        variants={itemVariants}
                        className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground"
                    >
                        We believe in democratizing quality. See how a single, affordable test cycle creates a wave of impact, empowering developers and improving apps across the planet.
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                   {stats.map((stat, i) => (
                       <motion.div 
                            key={i}
                            variants={itemVariants}
                            className="bg-background/30 backdrop-blur-lg p-6 rounded-2xl border border-white/10 flex items-center gap-6"
                        >
                           <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full p-4">
                            {stat.icon}
                           </div>
                           <div className="text-left">
                               <p className="text-4xl md:text-5xl font-bold text-primary">
                                   {stat.value > 100000 ? stat.value/1000000 + stat.suffix : <AnimatedCounter to={stat.value} />}
                                   {stat.value < 100000 && stat.suffix}
                               </p>
                               <p className="text-muted-foreground mt-1">{stat.label}</p>
                           </div>
                       </motion.div>
                   ))}
                </motion.div>
            </div>
        </section>
    );
}

// A simple dot pattern background
const DotPattern = () => (
    <svg className="absolute w-full h-full inset-0" aria-hidden="true">
        <defs>
            <pattern id="dot-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="1" fill="currentColor" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
)

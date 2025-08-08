
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
        position: { top: '10%', left: '15%' },
        animation: {
            y: [0, -15, 0],
            x: [0, 10, 0],
            transition: { duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        }
    },
    {
        icon: <Users className="w-8 h-8" />,
        value: 20000,
        suffix: '+',
        label: 'Testers Engaged',
        position: { top: '25%', left: '70%' },
        animation: {
            y: [0, 20, 0],
            x: [0, -15, 0],
            transition: { duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        }
    },
    {
        icon: <Bug className="w-8 h-8" />,
        value: 500000,
        suffix: '+',
        label: 'Bugs Squashed',
        position: { top: '60%', left: '5%' },
        animation: {
            y: [0, -25, 0],
            x: [0, 20, 0],
            transition: { duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        }
    },
    {
        icon: <Code className="w-8 h-8" />,
        value: 1,
        suffix: 'M+',
        label: 'Developer Hours Saved',
        position: { top: '75%', left: '60%' },
        animation: {
            y: [0, 15, 0],
            x: [0, -10, 0],
            transition: { duration: 9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        }
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
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
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
                </motion.div>

                <motion.div 
                    className="mt-16 relative min-h-[500px]"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                   {stats.map((stat, i) => (
                       <motion.div 
                            key={i}
                            variants={itemVariants}
                            animate={stat.animation}
                            className="absolute bg-background/30 backdrop-blur-lg p-6 rounded-full border border-white/10 flex flex-col items-center justify-center text-center w-56 h-56"
                            style={stat.position}
                        >
                           <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full p-4 mb-3">
                            {stat.icon}
                           </div>
                           <div>
                               <p className="text-3xl md:text-4xl font-bold text-primary">
                                   {stat.value > 100000 ? stat.value/1000000 + stat.suffix : <AnimatedCounter to={stat.value} />}
                                   {stat.value < 100000 && stat.suffix}
                               </p>
                               <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                           </div>
                       </motion.div>
                   ))}
                </motion.div>
            </div>
        </section>
    );
}


'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Bug, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

const AnimatedCounter = ({ to, suffix }: { to: number, suffix?: string }) => {
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

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const WorldMap = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 500"
        className="w-full h-auto text-primary/10"
        aria-hidden="true"
    >
        <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            fill="currentColor"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            d="M995 240.5L966 232L954 209L924.5 197L910 183.5L888.5 178L875 162.5L857 151.5L835 152L824.5 137.5L805 131.5L794 117L779.5 108.5L758 111L738.5 101L717 101.5L706 91.5L683.5 83L667.5 73.5L645 69.5L626 73L613 54L598 40.5L575.5 31L567.5 17.5L545.5 10L523.5 5.5L500.5 5.5L488 12.5L464 12L453 23L424.5 28L402 36.5L387.5 28.5L370 21L345 19L322.5 23.5L299.5 35L282 45.5L273 63L253 76.5L221 78L211.5 90L201.5 110L186.5 128L158 135.5L132.5 131.5L120.5 140.5L108 158.5L96 173L75.5 184.5L56 198L34 205.5L24 220L5 238.5L22 254.5L32.5 267L47.5 281L65.5 295.5L83.5 308.5L108.5 328L129 346L135.5 365.5L152 384L173.5 391L186.5 407.5L210 415L230 427.5L249 437.5L273 451L289 462.5L317.5 474L356.5 484.5L386.5 491.5L418.5 494.5L453 494L490 482.5L504 473.5L523.5 470L542.5 461L563.5 442L578 433L601.5 425.5L621 413L636.5 393L656 384L682.5 373L707 348L735 329L751 313.5L781.5 301L807.5 288L827 274.5L843.5 264.5L869 253L892.5 251.5L917.5 244L942.5 242.5L995 240.5Z"
        />
    </svg>
);

const stats = [
    {
        icon: <Globe className="w-8 h-8" />,
        value: 100,
        suffix: '+',
        label: 'Countries Reached',
        position: { top: '15%', left: '75%' },
        rippleDelay: 0.2,
    },
    {
        icon: <Users className="w-8 h-8" />,
        value: 20000,
        suffix: '+',
        label: 'Testers Engaged',
        position: { top: '65%', left: '80%' },
        rippleDelay: 0.4,
    },
    {
        icon: <Bug className="w-8 h-8" />,
        value: 500000,
        suffix: '+',
        label: 'Bugs Squashed',
        position: { top: '70%', left: '20%' },
        rippleDelay: 0.6,
    },
    {
        icon: <Code className="w-8 h-8" />,
        value: 1,
        suffix: 'M+',
        label: 'Dev Hours Saved',
        position: { top: '25%', left: '25%' },
        rippleDelay: 0.8,
    },
]

export function GlobalImpactSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.5,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 15, stiffness: 100 } },
    };

    const rippleVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: (delay: number) => ({
            scale: [0, 1, 1.2],
            opacity: [1, 0.5, 0],
            transition: {
                duration: 2.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1,
                delay
            }
        })
    }

    return (
        <section ref={sectionRef} className="py-20 md:py-32 bg-secondary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern-dark opacity-30 z-0"></div>
            
            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center justify-center">
                <motion.div
                    className="text-center max-w-3xl mx-auto"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={itemVariants}
                >
                    <h2 
                        className="text-3xl md:text-5xl font-bold mt-4"
                    >
                        From Local <span className="text-primary">₹999</span> to Global Ripples
                    </h2>
                </motion.div>

                <motion.div 
                    className="mt-16 relative w-full max-w-5xl aspect-[2/1]"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <WorldMap />
                    </div>

                    {/* Central Pulse */}
                    <motion.div
                        className="absolute"
                        style={{ top: '45%', left: '56%' }}
                    >
                         {Array.from({ length: 3 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/80"
                                custom={i * 0.3}
                                variants={rippleVariants}
                            />
                        ))}
                    </motion.div>


                    {stats.map((stat, i) => (
                       <motion.div
                            key={i}
                            className="absolute"
                            style={stat.position}
                            variants={itemVariants}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="relative">
                                {/* Ripple for stat */}
                                <motion.div
                                    className="absolute inset-0 -m-4 rounded-full border-2 border-primary"
                                    initial={{ scale: 0, opacity: 0}}
                                    animate={{
                                        scale: hoveredIndex === i ? 1.2 : 0,
                                        opacity: hoveredIndex === i ? [0, 0.5, 0] : 0
                                    }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                <div className="bg-background/50 backdrop-blur-lg rounded-xl border border-primary/20 p-4 shadow-lg text-center w-48">
                                    <div className="flex items-center justify-center text-primary bg-primary/10 rounded-full w-12 h-12 mx-auto mb-2">
                                        {stat.icon}
                                    </div>
                                    <p className="text-3xl font-bold">
                                         {stat.value > 100000 
                                            ? stat.value/1000000 + "M+"
                                            : <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                                        }
                                    </p>
                                    <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                                </div>
                            </div>
                       </motion.div>
                   ))}
                </motion.div>
            </div>
        </section>
    );
}

    
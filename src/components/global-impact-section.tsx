
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
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


const stats = [
    {
        icon: <Globe className="w-8 h-8 text-cyan-300" />,
        value: 100,
        suffix: '+',
        label: 'Countries Reached',
        size: 150,
        orbitSize: 300,
        color: 'cyan',
        duration: 20
    },
    {
        icon: <Users className="w-8 h-8 text-purple-300" />,
        value: 20000,
        suffix: '+',
        label: 'Testers Engaged',
        size: 180,
        orbitSize: 500,
        color: 'purple',
        duration: 30
    },
    {
        icon: <Bug className="w-8 h-8 text-green-300" />,
        value: 500000,
        suffix: '+',
        label: 'Bugs Squashed',
        size: 200,
        orbitSize: 700,
        color: 'green',
        duration: 40
    },
    {
        icon: <Code className="w-8 h-8 text-amber-300" />,
        value: 1,
        suffix: 'M+',
        label: 'Dev Hours Saved',
        size: 160,
        orbitSize: 900,
        color: 'amber',
        duration: 25
    },
]

export function GlobalImpactSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-200px" });
    
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    });

    const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.4,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 15, stiffness: 100 } },
    };
    
    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 2, ease: "easeInOut" }
        }
    }


    return (
        <section ref={sectionRef} className="py-20 md:py-32 bg-secondary/50 relative overflow-hidden min-h-[1200px] md:min-h-[1000px]">
            <div className="absolute inset-0 bg-dot-pattern-dark opacity-30"></div>
            
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
                    className="mt-16 relative flex items-center justify-center"
                    style={{ 
                        height: '900px',
                        width: '900px',
                    }}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    {/* Central Globe */}
                    <motion.div
                      style={{rotate}}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                       <div className="relative w-[250px] h-[250px]">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                            <Globe className="absolute inset-0 m-auto w-1/2 h-1/2 text-primary opacity-20" />
                            <div 
                                className="absolute inset-0 bg-cover bg-center rounded-full opacity-30"
                                style={{ backgroundImage: "url('https://www.datocms-assets.com/104595/1692113271-globe.png')", backgroundPosition: 'center 20%'}}
                                data-ai-hint="globe"
                            ></div>
                       </div>
                    </motion.div>
                    
                   {stats.map((stat, i) => (
                       <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                width: `${stat.orbitSize}px`,
                                height: `${stat.orbitSize}px`,
                            }}
                            variants={itemVariants}
                        >
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20" style={{transform: `rotate(${i * 45}deg)`}}>
                                <motion.path
                                    d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="0.2"
                                    variants={pathVariants}
                                />
                            </svg>
                            <motion.div
                                className="absolute"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    width: `${stat.size}px`,
                                    height: `${stat.size}px`,
                                    x: '-50%',
                                    y: '-50%',
                                }}
                                animate={{ rotate: [0, 360] }}
                                transition={{
                                    duration: stat.duration,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <div
                                    className={cn(
                                        "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/30 backdrop-blur-lg rounded-full border flex flex-col items-center justify-center text-center",
                                        `border-${stat.color}-500/20`
                                    )}
                                    style={{
                                        width: `${stat.size}px`,
                                        height: `${stat.size}px`,
                                    }}
                                >
                                    <div className={`flex-shrink-0 bg-${stat.color}-500/10 text-${stat.color}-300 rounded-full p-3 mb-2`}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-2xl md:text-3xl font-bold text-primary">
                                            {stat.value > 100000 
                                                ? stat.value/1000000 + "M+"
                                                : <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                                            }
                                        </p>
                                        <p className="text-muted-foreground text-xs mt-1 px-2">{stat.label}</p>
                                    </div>
                                </div>
                            </motion.div>
                       </motion.div>
                   ))}
                </motion.div>
            </div>
        </section>
    );
}

    
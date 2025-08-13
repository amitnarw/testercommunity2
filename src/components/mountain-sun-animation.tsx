
'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Sun = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                <stop offset="70%" style={{ stopColor: '#FFD700', stopOpacity: 0.9 }} />
                <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 0 }} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#sunGradient)" />
    </svg>
);

const Mountain = ({ path, className, initialY, finalY, duration, delay, zIndex }: { path: string, className?: string, initialY: number, finalY: number, duration: number, delay: number, zIndex?: number }) => (
    <motion.path
        d={path}
        className={className}
        initial={{ y: initialY, opacity: 0 }}
        animate={{ y: finalY, opacity: 1 }}
        transition={{ duration, delay, ease: 'easeOut' }}
        style={{ zIndex }}
    />
);

export function MountainSunAnimation() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const mountainColor = theme === 'dark' ? 'hsl(var(--secondary) / 0.5)' : 'hsl(var(--muted))';
    const mountainColorForeground = theme === 'dark' ? 'hsl(var(--secondary) / 0.8)' : 'hsl(var(--secondary-foreground) / 0.3)';

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-transparent pointer-events-none">
            <motion.div 
                className="absolute -top-24 -right-24 w-48 h-48"
                style={{ zIndex: 5 }}
                initial={{ y: '-100%', opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ y: '-20%', opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, delay: 1.5, ease: 'easeOut' }}
            >
                <Sun />
            </motion.div>

            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 800 600"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Background Mountains */}
                <Mountain
                    path="M -100 600 L 400 200 L 900 600 Z"
                    className="fill-current"
                    style={{ color: mountainColor }}
                    initialY={200}
                    finalY={0}
                    duration={1.5}
                    delay={0.2}
                    zIndex={1}
                />
                
                {/* Foreground Mountains */}
                <Mountain
                    path="M -200 600 L 250 300 L 600 600 Z"
                    className="fill-current"
                    style={{ color: mountainColorForeground }}
                    initialY={200}
                    finalY={0}
                    duration={1.5}
                    delay={0.5}
                    zIndex={15} 
                />
                 <Mountain
                    path="M 300 600 L 700 250 L 1000 600 Z"
                    className="fill-current"
                    style={{ color: mountainColorForeground }}
                    initialY={200}
                    finalY={0}
                    duration={1.5}
                    delay={0.8}
                    zIndex={15}
                />
            </svg>
        </div>
    );
}

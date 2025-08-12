
'use client';

import { motion } from 'framer-motion';
import { TestTribeLogo } from './icons';

const Cloud = ({ className }: { className?: string }) => (
    <svg 
        viewBox="0 0 140 80" 
        className={className}
    >
        <path 
            d="M117.5,65.5 C132.4,65.5 140,51.9 140,42 C140,32.1 132.4,25.5 117.5,25.5 C117.5,12.5 106.9,0 92.5,0 C82,0 73.8,7.9 70,16.5 C65.3,7.3 56,3 45,3 C29.5,3 15,15.5 15,31.5 C15,31.5 15,31.5 15,32 C6.2,33.1 0,40.9 0,50 C0,59.3 7.5,66.1 16.9,66.1 L117.5,65.5 Z" 
            fill="currentColor"
            className="text-white dark:text-gray-800"
            style={{ filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.05))" }}
        />
    </svg>
);

const cloudAnimation = (duration: number, delay: number) => ({
    x: ['-200%', '1200%'],
    transition: {
        x: {
            duration: duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: delay,
        },
    },
});

export function ParallaxBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Background Clouds */}
        <motion.div className="absolute top-[15%] -left-1/4 scale-75 opacity-50 z-0" animate={cloudAnimation(50, 2)}>
             <Cloud />
        </motion.div>
        <motion.div className="absolute top-[60%] -left-1/3 scale-90 opacity-40 z-0" animate={cloudAnimation(60, 10)}>
            <Cloud />
        </motion.div>
         <motion.div className="absolute top-[25%] -left-1/2 scale-125 opacity-30 z-0" animate={cloudAnimation(70, 0)}>
            <Cloud />
        </motion.div>

        {/* Logo in the center */}
        <div className="w-full h-full flex items-center justify-center relative z-10">
            <TestTribeLogo className="h-20 w-auto" />
        </div>

        {/* Foreground Clouds */}
        <motion.div className="absolute top-[5%] -left-1/4 scale-50 z-20" animate={cloudAnimation(45, 0)}>
             <Cloud />
        </motion.div>
        <motion.div className="absolute top-[70%] -left-1/2 scale-100 z-20" animate={cloudAnimation(55, 5)}>
             <Cloud />
        </motion.div>
    </div>
  );
}

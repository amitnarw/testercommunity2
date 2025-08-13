
'use client';

import { motion } from 'framer-motion';

const Blob = ({ className, animation }: { className?: string; animation?: object }) => (
    <motion.div
        className={`absolute rounded-full mix-blend-hard-light filter blur-3xl ${className}`}
        animate={animation}
    />
);

export function PensiveGradient() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#030014]">
            <div className="relative h-full w-full">
                <Blob 
                    className="h-[30rem] w-[30rem] bg-[#c725a0] opacity-30" 
                    animation={{
                        x: [0, 200, 0, -200, 0],
                        y: [0, -150, 50, 100, 0],
                        rotate: [0, 90, 180, 270, 0],
                        transition: { duration: 25, repeat: Infinity, ease: 'easeInOut' }
                    }}
                />
                <Blob 
                    className="h-[25rem] w-[25rem] top-1/4 left-1/4 bg-[#3b82f6] opacity-30"
                    animation={{
                        x: [0, -100, 150, 50, 0],
                        y: [0, 100, -50, -150, 0],
                        rotate: [0, -120, 0, 180, 0],
                        transition: { duration: 30, repeat: Infinity, ease: 'easeInOut', delay: -5 }
                    }}
                />
                <Blob 
                    className="h-[20rem] w-[20rem] top-1/2 left-1/2 bg-[#8b5cf6] opacity-40"
                    animation={{
                        x: [0, 100, -100, 100, 0],
                        y: [0, 50, 150, -100, 0],
                        rotate: [0, 60, -90, 150, 0],
                        transition: { duration: 35, repeat: Infinity, ease: 'easeInOut', delay: -10 }
                    }}
                />
            </div>
        </div>
    );
}

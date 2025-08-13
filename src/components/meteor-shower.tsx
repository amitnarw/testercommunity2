
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Meteor {
  id: number;
  delay: number;
  duration: number;
  left: string;
  top: string;
  angle: number;
  scale: number;
}

const METEOR_COUNT = 20;

export const MeteorShower = () => {
    const [meteors, setMeteors] = useState<Meteor[]>([]);

    useEffect(() => {
        const generatedMeteors = Array.from({ length: METEOR_COUNT }).map((_, i) => ({
            id: i,
            delay: Math.random() * 10,
            duration: Math.random() * 2 + 1, // 1 to 3 seconds
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * -100}%`,
            angle: -45, // Constant angle for a consistent shower direction
            scale: Math.random() * 0.5 + 0.5 // Random scale between 0.5 and 1
        }));
        setMeteors(generatedMeteors);
    }, []);
    
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-dot-pattern-dark -z-10">
            {meteors.map((meteor) => (
                <motion.div
                    key={meteor.id}
                    className="absolute"
                    initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                    }}
                    animate={{
                        x: '100vw',
                        y: '100vh',
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        delay: meteor.delay,
                        duration: meteor.duration,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatType: 'loop',
                    }}
                    style={{
                        top: meteor.top,
                        left: meteor.left,
                        transform: `rotate(${meteor.angle}deg) scale(${meteor.scale})`,
                    }}
                >
                     <div className="w-40 sm:w-80 h-px bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
                </motion.div>
            ))}
        </div>
    );
};

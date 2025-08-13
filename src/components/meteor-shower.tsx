
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Meteor {
  id: number;
  top: string;
  left: string;
  delay: number;
  duration: number;
}

const METEOR_COUNT = 30;

export const MeteorShower = () => {
    const [meteors, setMeteors] = useState<Meteor[]>([]);

    useEffect(() => {
        const generatedMeteors = Array.from({ length: METEOR_COUNT }).map((_, i) => ({
            id: i,
            top: `${-10 + Math.random() * 20}%`,
            left: `${Math.random() * 120 - 10}%`,
            delay: Math.random() * 10,
            duration: 2 + Math.random() * 3,
        }));
        setMeteors(generatedMeteors);
    }, []);
    
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-dot-pattern-dark">
            {meteors.map((meteor) => (
                <motion.div
                    key={meteor.id}
                    className="absolute h-px w-40 sm:w-60 md:w-80 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent z-20"
                    style={{
                        top: meteor.top,
                        left: meteor.left,
                        transform: 'rotate(-45deg)',
                    }}
                    initial={{
                        opacity: 1,
                        x: 0,
                        y: 0,
                    }}
                    animate={{
                        opacity: [1, 0],
                        x: '-2000px',
                        y: '2000px',
                    }}
                    transition={{
                        delay: meteor.delay,
                        duration: meteor.duration,
                        ease: 'linear',
                        repeat: Infinity,
                    }}
                />
            ))}
        </div>
    );
};

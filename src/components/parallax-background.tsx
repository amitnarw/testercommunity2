
'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { TestTribeLogo } from './icons';

const Cloud = ({ className }: { className?: string }) => (
    <svg 
        viewBox="0 0 140 80" 
        className={className}
        style={{ filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.1))" }}
    >
        <path 
            d="M117.5,65.5 C132.4,65.5 140,51.9 140,42 C140,32.1 132.4,25.5 117.5,25.5 C117.5,12.5 106.9,0 92.5,0 C82,0 73.8,7.9 70,16.5 C65.3,7.3 56,3 45,3 C29.5,3 15,15.5 15,31.5 C15,31.5 15,31.5 15,32 C6.2,33.1 0,40.9 0,50 C0,59.3 7.5,66.1 16.9,66.1 L117.5,65.5 Z" 
            fill="currentColor"
            className="text-white dark:text-gray-800"
        />
    </svg>
);

const cloudAnimation = (duration: number, delay: number) => ({
    animate: {
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
    },
});

export function ParallaxBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const springConfig = { damping: 20, stiffness: 150, mass: 1 };
  
  const logoX = useSpring(mousePosition.x * 20, springConfig);
  const logoY = useSpring(mousePosition.y * 20, springConfig);
  const cloudMouseX = (factor: number) => useSpring(mousePosition.x * factor, springConfig);
  const cloudMouseY = (factor: number) => useSpring(mousePosition.y * factor, springConfig);

  return (
    <div className="absolute inset-0 w-full h-full">
        {/* Background Clouds (behind logo) */}
        <motion.div style={{ x: cloudMouseX(-15), y: cloudMouseY(-10) }} className="absolute top-[30%] left-0 w-48" variants={cloudAnimation(35, 2)} animate="animate" >
             <Cloud className="w-full h-auto opacity-40" />
        </motion.div>
        <motion.div style={{ x: cloudMouseX(10), y: cloudMouseY(5) }} className="absolute top-[60%] left-0 w-32" variants={cloudAnimation(45, 10)} animate="animate">
            <Cloud className="w-full h-auto opacity-50" />
        </motion.div>
         <motion.div style={{ x: cloudMouseX(-10), y: cloudMouseY(-5) }} className="absolute top-[10%] left-0 w-64" variants={cloudAnimation(55, 0)} animate="animate">
            <Cloud className="w-full h-auto opacity-30" />
        </motion.div>


        {/* Logo */}
        <div className="w-full h-full flex items-center justify-center">
            <motion.div
                className="relative z-10"
                style={{ x: logoX, y: logoY }}
            >
                <TestTribeLogo className="h-20 w-auto" />
            </motion.div>
        </div>

        {/* Foreground Clouds (in front of logo) */}
        <motion.div style={{ x: cloudMouseX(-30), y: cloudMouseY(-20) }} className="absolute z-20 top-[5%] left-0 w-40" variants={cloudAnimation(30, 0)} animate="animate">
             <Cloud className="w-full h-auto" />
        </motion.div>
        <motion.div style={{ x: cloudMouseX(25), y: cloudMouseY(15) }} className="absolute z-20 top-[70%] left-0 w-36" variants={cloudAnimation(40, 5)} animate="animate">
             <Cloud className="w-full h-auto" />
        </motion.div>
    </div>
  );
}

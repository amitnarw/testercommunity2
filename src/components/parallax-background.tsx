
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
        <defs>
            <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: '0.9' }} />
                <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: '0.7' }} />
            </linearGradient>
        </defs>
        <path 
            d="M117.5,65.5 C132.4,65.5 140,51.9 140,42 C140,32.1 132.4,25.5 117.5,25.5 C117.5,12.5 106.9,0 92.5,0 C82,0 73.8,7.9 70,16.5 C65.3,7.3 56,3 45,3 C29.5,3 15,15.5 15,31.5 C15,31.5 15,31.5 15,32 C6.2,33.1 0,40.9 0,50 C0,59.3 7.5,66.1 16.9,66.1 L117.5,65.5 Z" 
            fill="currentColor"
            className="text-white"
        />
    </svg>
);

const cloudAnimationVariants = {
  animate: {
    x: [0, 50, 0],
    transition: {
      x: {
        duration: 15,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  },
};

const cloudAnimationVariants2 = {
  animate: {
    x: [0, -40, 0],
    transition: {
      x: {
        duration: 20,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: 5,
      },
    },
  },
};


export function ParallaxBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      // Normalize to a range (e.g., -1 to 1) to represent the amount of movement
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
  
  // Different parallax depths
  const logoX = useSpring(mousePosition.x * 20, springConfig);
  const logoY = useSpring(mousePosition.y * 20, springConfig);
  
  const cloud1X = useSpring(mousePosition.x * -40, springConfig);
  const cloud1Y = useSpring(mousePosition.y * -30, springConfig);

  const cloud2X = useSpring(mousePosition.x * 35, springConfig);
  const cloud2Y = useSpring(mousePosition.y * 25, springConfig);
  
  const cloud3X = useSpring(mousePosition.x * -25, springConfig);
  const cloud3Y = useSpring(mousePosition.y * 15, springConfig);

  return (
    <div className="relative w-[400px] h-[200px] flex items-center justify-center">
        {/* Back Cloud */}
        <motion.div
            className="absolute z-0"
            style={{
                x: cloud3X,
                y: cloud3Y,
                top: 80,
                left: 150,
                scale: 0.8,
                opacity: 0.8
            }}
        >
            <Cloud className="w-36 h-auto" />
        </motion.div>

        {/* Logo */}
        <motion.div
            className="relative z-10"
            style={{ x: logoX, y: logoY }}
        >
            <TestTribeLogo className="h-20 w-auto" />
        </motion.div>

        {/* Front Cloud 1 */}
         <motion.div
            className="absolute z-20"
            style={{
                x: cloud1X,
                y: cloud1Y,
                top: -20,
                left: -50,
                scale: 1.2,
            }}
            variants={cloudAnimationVariants}
            animate="animate"
        >
            <Cloud className="w-48 h-auto" />
        </motion.div>

        {/* Front Cloud 2 */}
        <motion.div
            className="absolute z-20"
            style={{
                x: cloud2X,
                y: cloud2Y,
                top: 50,
                right: -80,
                scale: 1.1,
            }}
            variants={cloudAnimationVariants2}
            animate="animate"
        >
            <Cloud className="w-40 h-auto" />
        </motion.div>
    </div>
  );
}

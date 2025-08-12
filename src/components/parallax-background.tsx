
'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export function ParallaxBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth - 0.5) * 2; // Normalize to -1 to 1
      const y = (clientY / window.innerHeight - 0.5) * 2; // Normalize to -1 to 1
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const dx = useSpring(mousePosition.x, springConfig);
  const dy = useSpring(mousePosition.y, springConfig);

  return (
    <motion.div
      className="absolute inset-0 z-0"
      style={{
        x: dx,
        y: dy,
        scale: 1.15,
      }}
    >
        <div className="absolute inset-[-10%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-secondary to-secondary blur-2xl opacity-50">
        </div>
    </motion.div>
  );
}

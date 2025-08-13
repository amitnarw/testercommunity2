
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

const spring = {
  type: 'spring',
  stiffness: 300,
  damping: 40,
};

const Orb = ({ mouseX, mouseY }: { mouseX: any; mouseY: any }) => {
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  useEffect(() => {
    x.set(mouseX.get());
    y.set(mouseY.get());
  }, [mouseX, mouseY, x, y]);

  return (
    <motion.div
      style={{ x, y }}
      className="absolute top-0 left-0 w-16 h-16 rounded-full bg-primary/20 dark:bg-primary/30 backdrop-blur-md pointer-events-none"
    />
  );
};

export function InteractiveOrbs() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const mouseX = useSpring(mousePosition.x, spring);
  const mouseY = useSpring(mousePosition.y, spring);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
    >
        <motion.div
            className="w-full h-full"
            style={{
                x: mouseX,
                y: mouseY,
                background: 'radial-gradient(circle at center, hsl(var(--primary)/0.2), transparent 50%)',
            }}
            transition={spring}
        />
    </div>
  );
}

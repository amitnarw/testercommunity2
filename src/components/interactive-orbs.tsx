
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const NUM_ORBS = 15;
const ORB_SIZE = 20;
const DAMPING = 0.8;

const generateOrbs = () =>
  Array(NUM_ORBS)
    .fill(0)
    .map(() => ({
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
    }));

export function InteractiveOrbs() {
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
  const [orbs, setOrbs] = useState(generateOrbs);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setOrbs((currentOrbs) => {
        return currentOrbs.map((orb, i) => {
          const target = i === 0 ? mousePos : currentOrbs[i - 1];
          const dx = target.x - orb.x;
          const dy = target.y - orb.y;

          let newVx = orb.vx + dx * 0.05;
          let newVy = orb.vy + dy * 0.05;

          newVx *= DAMPING;
          newVy *= DAMPING;

          const newX = orb.x + newVx;
          const newY = orb.y + newVy;
          
          return {
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        });
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={cn(
            'absolute rounded-full',
            'bg-gradient-to-br from-primary to-accent'
          )}
          style={{
            left: orb.x,
            top: orb.y,
            width: `${ORB_SIZE}px`,
            height: `${ORB_SIZE}px`,
            transform: `translate(-50%, -50%) scale(${1 - i / NUM_ORBS})`,
            opacity: 1 - i / (NUM_ORBS * 1.5),
            zIndex: NUM_ORBS - i,
          }}
        />
      ))}
    </div>
  );
}

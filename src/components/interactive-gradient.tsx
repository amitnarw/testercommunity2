
'use client';

import { useMotionValue, motion, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

const Blob = ({
  className,
  motionProps,
}: {
  className?: string;
  motionProps?: React.ComponentProps<typeof motion.div>;
}) => {
  return (
    <motion.div
      className={cn(
        'absolute rounded-full mix-blend-plus-lighter filter',
        className
      )}
      {...motionProps}
    />
  );
};

export const InteractiveGradient = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const config = {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  };

  const dx1 = useTransform(mouseX, (val) => val * 0.3);
  const dy1 = useTransform(mouseY, (val) => val * 0.3);
  
  const dx2 = useTransform(mouseX, (val) => val * -0.2);
  const dy2 = useTransform(mouseY, (val) => val * -0.2);
  
  const dx3 = useTransform(mouseX, (val) => val * 0.1);
  const dy3 = useTransform(mouseY, (val) => val * -0.3);

  const dx4 = useTransform(mouseX, (val) => val * -0.4);
  const dy4 = useTransform(mouseY, (val) => val * 0.1);


  return (
    <div
      onMouseMove={handleMouseMove}
      className="absolute inset-0 z-0 overflow-hidden bg-background"
    >
      <div className="relative h-full w-full">
        <Blob
          className="h-[40rem] w-[40rem] bg-primary/20 blur-3xl"
          motionProps={{
            style: { x: dx1, y: dy1 },
            transition: { type: 'spring', ...config },
          }}
        />
        <Blob
          className="h-[30rem] w-[30rem] top-1/4 left-1/4 bg-primary/30 blur-3xl"
          motionProps={{
            style: { x: dx2, y: dy2 },
            transition: { type: 'spring', ...config, delay: 0.1 },
          }}
        />
        <Blob
          className="h-[20rem] w-[20rem] top-1/2 left-1/2 bg-primary/20 blur-2xl"
           motionProps={{
            style: { x: dx3, y: dy3 },
            transition: { type: 'spring', ...config, delay: 0.2 },
          }}
        />
         <Blob
          className="h-[25rem] w-[25rem] top-1/3 left-3/4 bg-primary/10 blur-3xl"
           motionProps={{
            style: { x: dx4, y: dy4 },
            transition: { type: 'spring', ...config, delay: 0.3 },
          }}
        />
      </div>
    </div>
  );
};

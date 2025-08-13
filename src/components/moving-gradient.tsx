
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Blob = ({ className, ...props }: React.ComponentProps<typeof motion.div>) => {
  return (
    <motion.div
      animate={{
        x: ['-100%', '100%', '-100%'],
        y: ['-100%', '100%', '-100%'],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 40,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      }}
      className={cn(
        'absolute rounded-full opacity-50 mix-blend-multiply blur-2xl filter',
        className
      )}
      {...props}
    />
  );
};

export const MovingGradient = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-background">
      <div className="relative h-full w-full">
        <Blob
          className="h-[30rem] w-[30rem] bg-primary/20 top-1/2 left-1/2"
          style={{
            animationDelay: '0s',
            animationDuration: '30s',
          }}
        />
        <Blob
          className="h-96 w-96 bg-accent/20"
          style={{
            animationDelay: '-5s',
            animationDuration: '35s',
          }}
        />
        <Blob
          className="h-80 w-80 bg-secondary/20 top-1/4 left-1/4"
           style={{
            animationDelay: '-10s',
            animationDuration: '40s',
          }}
        />
         <Blob
          className="h-72 w-72 bg-primary/10 bottom-0 right-0"
           style={{
            animationDelay: '-15s',
            animationDuration: '45s',
          }}
        />
      </div>
    </div>
  );
};

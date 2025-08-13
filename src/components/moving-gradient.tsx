
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Blob = ({ className, ...props }: React.ComponentProps<typeof motion.div>) => {
  return (
    <motion.div
      animate={{
        x: ['-20%', '20%', '-20%'],
        y: ['-30%', '30%', '-30%'],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 50,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      }}
      className={cn(
        'absolute rounded-full opacity-50 mix-blend-multiply blur-3xl filter',
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
          className="h-[50rem] w-[50rem] bg-primary/30 top-1/2 left-1/2"
          style={{
            animationDelay: '0s',
            animationDuration: '40s',
          }}
        />
        <Blob
          className="h-[40rem] w-[40rem] bg-primary/20 top-1/4 left-1/3"
          style={{
            animationDelay: '-5s',
            animationDuration: '45s',
          }}
        />
        <Blob
          className="h-[35rem] w-[35rem] bg-primary/10 top-1/3 left-3/4"
           style={{
            animationDelay: '-10s',
            animationDuration: '50s',
          }}
        />
         <Blob
          className="h-[30rem] w-[30rem] bg-primary/20 bottom-0 right-1/2"
           style={{
            animationDelay: '-15s',
            animationDuration: '55s',
          }}
        />
      </div>
    </div>
  );
};


'use client';

import { motion } from 'framer-motion';

export function LevitatingOrb() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 70%)',
          top: '50%',
          left: '50%',
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="relative w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="absolute w-full h-full rounded-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateX: 70 }}
        >
          <div
            className="absolute w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 50% 100%, hsl(var(--primary)/0.5), transparent 70%)',
              transform: 'translateZ(150px)',
            }}
          />
          <div
            className="absolute w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 50% 0%, hsl(var(--accent)/0.5), transparent 70%)',
              transform: 'translateZ(-150px)',
            }}
          />
          <div
            className="absolute w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 100% 50%, hsl(var(--primary)/0.3), transparent 70%)',
              transform: 'rotateY(90deg) translateZ(150px)',
            }}
          />
          <div
            className="absolute w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 0% 50%, hsl(var(--accent)/0.3), transparent 70%)',
              transform: 'rotateY(-90deg) translateZ(150px)',
            }}
          />
          <div
            className="absolute w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 50% 50%, white, transparent 70%)',
              transform: 'translateZ(0px)',
              filter: 'blur(30px)',
              opacity: 0.1,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

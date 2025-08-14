
'use client';

import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import React from 'react';

const icons = [
    { component: Video, size: 'w-8 h-8' },
    { component: Video, size: 'w-12 h-12' },
    { component: Video, size: 'w-6 h-6' },
    { component: Video, size: 'w-10 h-10' },
    { component: Video, size: 'w-9 h-9' },
    { component: Video, size: 'w-5 h-5' },
    { component: Video, size: 'w-7 h-7' },
    { component: Video, size: 'w-11 h-11' },
    { component: Video, size: 'w-6 h-6' },
    { component: Video, size: 'w-10 h-10' },
];

export const IconRain = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon, index) => {
        const IconComponent = icon.component;
        const duration = 15 + Math.random() * 10; 
        const delay = Math.random() * 15;
        const left = `${5 + Math.random() * 90}%`;
        const initialY = `-${20 + Math.random() * 80}%`;

        return (
          <motion.div
            key={index}
            className="absolute text-primary/10"
            style={{ left, top: initialY }}
            animate={{
              y: ['0%', '120vh'],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <IconComponent className={icon.size} />
          </motion.div>
        );
      })}
    </div>
  );
};


'use client';

import { motion } from 'framer-motion';
import { File, Clipboard, CheckCircle, Video, Bug } from 'lucide-react';
import React from 'react';

const icons = [
    { component: File, size: 'w-8 h-8' },
    { component: Clipboard, size: 'w-12 h-12' },
    { component: CheckCircle, size: 'w-6 h-6' },
    { component: Video, size: 'w-10 h-10' },
    { component: Bug, size: 'w-9 h-9' },
    { component: File, size: 'w-5 h-5' },
    { component: Clipboard, size: 'w-7 h-7' },
    { component: CheckCircle, size: 'w-11 h-11' },
    { component: Video, size: 'w-6 h-6' },
    { component: Bug, size: 'w-10 h-10' },
];

export const IconRain = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon, index) => {
        const IconComponent = icon.component;
        const duration = 10 + Math.random() * 10; 
        const delay = Math.random() * 15;
        const left = `${5 + Math.random() * 90}%`;

        return (
          <motion.div
            key={index}
            className="absolute -top-16 text-primary/10"
            style={{ left }}
            animate={{
              y: ['-10%', '120vh'],
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

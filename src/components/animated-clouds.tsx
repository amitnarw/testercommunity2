
'use client';

import { motion } from 'framer-motion';

const Cloud = ({ delay, duration, initialX, y, scale }: { delay: number, duration: number, initialX: string, y: string, scale: number }) => {
    return (
        <motion.div
            className="absolute bg-white/10 dark:bg-white/5 rounded-full filter blur-xl"
            style={{
                width: `${200 * scale}px`,
                height: `${80 * scale}px`,
                top: y,
            }}
            initial={{ x: initialX }}
            animate={{ x: ['120vw', '-20vw'] }}
            transition={{
                delay,
                duration,
                repeat: Infinity,
                ease: 'linear',
            }}
        />
    );
};

export function AnimatedClouds() {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-transparent">
            <div className="relative w-full h-full">
                <Cloud delay={0} duration={40} initialX="0vw" y="10%" scale={1.2} />
                <Cloud delay={5} duration={50} initialX="20vw" y="30%" scale={1.5} />
                <Cloud delay={10} duration={60} initialX="-10vw" y="50%" scale={1} />
                <Cloud delay={15} duration={45} initialX="50vw" y="70%" scale={1.3} />
                <Cloud delay={20} duration={55} initialX="80vw" y="85%" scale={0.9} />
            </div>
        </div>
    );
}


'use client';

import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const useParallax = (value: ReturnType<typeof useMotionValue>, distance: number) => {
  return useTransform(value, [0, 1], [-distance, distance]);
};

export function MountainParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
        if (!ref.current) return;
        const { left, top, width, height } = (ref.current as HTMLElement).getBoundingClientRect();
        mouseX.set((event.clientX - left) / width);
        mouseY.set((event.clientY - top) / height);
    };

    const currentRef = ref.current;
    if (currentRef) {
        (currentRef as HTMLElement).addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
        if (currentRef) {
            (currentRef as HTMLElement).removeEventListener('mousemove', handleMouseMove);
        }
    };
  }, [mouseX, mouseY]);

  const x1 = useParallax(mouseX, 10);
  const y1 = useParallax(mouseY, 10);
  const x2 = useParallax(mouseX, 20);
  const y2 = useParallax(mouseY, 20);
  const x3 = useParallax(mouseX, 40);
  const y3 = useParallax(mouseY, 40);
  const x4 = useParallax(mouseX, 60);
  const y4 = useParallax(mouseY, 60);

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Background Sky */}
        <motion.div 
            className="absolute inset-0 z-0"
            style={{ x: x1, y: y1 }}
        >
            <Image
                src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1200&auto=format&fit=crop"
                alt="Starry night sky"
                layout="fill"
                objectFit="cover"
                data-ai-hint="starry sky"
            />
        </motion.div>
        
        {/* Moon */}
         <motion.div 
            className="absolute top-[10%] left-[50%] w-24 h-24 z-10"
            style={{ x: x2, y: y2 }}
        >
            <Image
                src="https://images.unsplash.com/photo-1522030299833-14599d134116?q=80&w=400&auto=format&fit=crop"
                alt="Moon"
                layout="fill"
                objectFit="contain"
                className="rounded-full shadow-[0_0_80px_20px_rgba(255,255,255,0.3)]"
                data-ai-hint="moon"
            />
        </motion.div>

        {/* Far Mountains */}
        <motion.div 
            className="absolute inset-0 z-20"
            style={{ x: x2, y: y2 }}
        >
            <Image
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format=fit=crop"
                alt="Distant mountains"
                layout="fill"
                objectFit="cover"
                objectPosition="bottom"
                data-ai-hint="distant mountains"
            />
        </motion.div>

        {/* Mid Mountains */}
         <motion.div 
            className="absolute inset-0 z-30"
            style={{ x: x3, y: y3 }}
        >
             <Image
                src="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200&auto=format=fit=crop"
                alt="Mid-ground mountains"
                layout="fill"
                objectFit="cover"
                objectPosition="bottom"
                data-ai-hint="midground mountains"
            />
        </motion.div>

        {/* Foreground Mountains */}
        <motion.div 
            className="absolute inset-0 z-40"
            style={{ x: x4, y: y4 }}
        >
            <Image
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format=fit=crop"
                alt="Foreground mountains"
                layout="fill"
                objectFit="cover"
                objectPosition="bottom"
                data-ai-hint="foreground mountains"
            />
        </motion.div>

        {/* Vignette */}
        <div className="absolute inset-0 z-50 shadow-[inset_0_0_100px_50px_#0a0a0a]"></div>
    </div>
  );
}


'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const PageTransition = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const resize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    const variants = {
        initial: {
            top: "100vh",
        },
        animate: {
            top: "-100vh",
            transition: { 
                duration: 1, 
                ease: [0.76, 0, 0.24, 1],
                delay: 0.2
            },
        },
        exit: {
            top: "0vh",
            transition: { 
                duration: 1, 
                ease: [0.76, 0, 0.24, 1],
            }
        }
    };
    
    const curve = (initialPath: string, targetPath: string) => {
        return {
            initial: {
                d: initialPath
            },
            animate: {
                d: targetPath,
                transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
            },
            exit: {
                d: initialPath,
                transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
            }
        }
    }

    if (dimensions.width === 0) {
        return null;
    }
    
    const initialPath = `M0 ${dimensions.height} Q${dimensions.width/2} ${dimensions.height} ${dimensions.width} ${dimensions.height} L${dimensions.width} 0 L0 0`
    const targetPath = `M0 ${dimensions.height} Q${dimensions.width/2} ${dimensions.height - 300} ${dimensions.width} ${dimensions.height} L${dimensions.width} 0 L0 0`


    return (
         <motion.div 
            className="page-transition"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
         >
            <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none">
                 <motion.path 
                    variants={curve(initialPath, targetPath)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="fill-current"
                >
                </motion.path>
            </svg>
        </motion.div>
    )
}

export default PageTransition;

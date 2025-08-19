
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
            opacity: 1,
            top: "100vh",
            height: "100vh",
        },
        animate: {
            opacity: 0,
            top: "-100vh",
            height: "0vh",
            transition: { 
                duration: 1, 
                ease: [0.76, 0, 0.24, 1],
                delay: 0.2
            }
        },
        exit: {
            opacity: 1,
            top: "0",
            height: "100vh",
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
        return <div className="page-transition" />;
    }
    
    const initialPath = `M0 0 L${dimensions.width} 0 L${dimensions.width} ${dimensions.height} Q${dimensions.width/2} ${dimensions.height + 300} 0 ${dimensions.height}  L0 0`
    const targetPath = `M0 0 L${dimensions.width} 0 L${dimensions.width} ${dimensions.height} Q${dimensions.width/2} ${dimensions.height} 0 ${dimensions.height}  L0 0`

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

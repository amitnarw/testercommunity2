
'use client';

import { motion } from 'framer-motion';

const PageTransition = () => {
    const variants = {
        initial: {
            height: "100vh",
            bottom: 0,
        },
        animate: {
            height: 0,
            transition: {
                duration: 0.8,
                ease: [0.87, 0, 0.13, 1],
            }
        }
    }
    
    return (
        <>
            <motion.div 
                className="page-transition"
                initial="initial"
                animate="animate"
                variants={variants}
            />
        </>
    )
}

export default PageTransition;

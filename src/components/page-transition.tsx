
'use client';

import { motion } from 'framer-motion';
import { Stairs } from './stairs';

const PageTransition = () => {
    return (
        <>
            <Stairs />
            <motion.div
                className="fixed top-0 left-0 w-full h-screen bg-background origin-bottom"
                initial={{scaleY: 0}}
                animate={{scaleY: 0}}
                exit={{scaleY: 1}}
                transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
            />
            <motion.div
                className="fixed top-0 left-0 w-full h-screen bg-background origin-top"
                initial={{scaleY: 1}}
                animate={{scaleY: 0}}
                exit={{scaleY: 0}}
                transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
            />
        </>
    )
}

export default PageTransition;

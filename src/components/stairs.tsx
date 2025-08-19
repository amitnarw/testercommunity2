
'use client';
import { motion } from 'framer-motion';

export const Stairs = () => {

    const anim = (variants: any, custom: number) => {
        return {
            initial: "initial",
            animate: "enter",
            exit: "exit",
            variants,
            custom
        }
    }

    const expand = {
        initial: {
            top: 0
        },
        enter: (i: number) => ({
            top: "100vh",
            transition: {
                duration: 0.25,
                delay: 0.05 * i,
                ease: [0.215, 0.61, 0.355, 1]
            },
            transitionEnd: { height: "0", top: "0" }
        }),
        exit: (i: number) => ({
            height: "100vh",
            transition: {
                duration: 0.25,
                delay: 0.05 * i,
                ease: [0.215, 0.61, 0.355, 1]
            }
        })
    }

    const nbOfColumns = 5;

    return (
        <div className='page-transition'>
            <div className='transition-container flex-grow relative'>
                {
                    [...Array(nbOfColumns)].map((_, i) => {
                        return (
                            <motion.div 
                                {...anim(expand, nbOfColumns - i)} 
                                key={i} 
                                className="transition-element"
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

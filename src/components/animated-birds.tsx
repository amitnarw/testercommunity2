
'use client';

import { motion } from 'framer-motion';

const BirdSVG = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M2.22754 13.252C2.22754 13.252 6.47462 12.6366 10.4286 14.5401C14.3825 16.4436 18.0435 15.6175 18.0435 15.6175" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.0435 15.6175C18.0435 15.6175 22.422 13.8828 27.2533 13.8828C32.0846 13.8828 37.7725 15.8079 37.7725 15.8079" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.0435 15.6175L15.8543 25.9626" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.22754 13.252L10.4286 2.00002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const Bird = ({ delay, duration, y, scale }: { delay: number, duration: number, y: string, scale: number }) => {
    return (
        <motion.div
            className="absolute text-primary/30 dark:text-primary/50"
            style={{
                top: y,
                scale,
                transformOrigin: 'center center',
            }}
            initial={{ x: '-20vw' }}
            animate={{ x: '120vw' }}
            transition={{
                delay,
                duration,
                repeat: Infinity,
                ease: 'linear',
            }}
        >
            <BirdSVG />
        </motion.div>
    );
};

export function AnimatedBirds() {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-transparent pointer-events-none">
            <div className="relative w-full h-full">
                <Bird delay={0} duration={25} y="10%" scale={0.8} />
                <Bird delay={2} duration={20} y="20%" scale={1} />
                <Bird delay={5} duration={30} y="35%" scale={0.6} />
                <Bird delay={8} duration={18} y="50%" scale={1.2} />
                <Bird delay={12} duration={28} y="65%" scale={0.9} />
                <Bird delay={15} duration={22} y="80%" scale={0.7} />
            </div>
        </div>
    );
}

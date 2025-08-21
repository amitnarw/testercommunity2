
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function FooterCurve() {
    const [path, setPath] = useState('');

    useEffect(() => {
        // This code will only run on the client, after the component has mounted.
        const initialPath = `M0 0 L0 ${window.innerHeight} Q100 ${window.innerHeight * 2} ${window.innerWidth} ${window.innerHeight} L${window.innerWidth} 0 Z`;
        setPath(initialPath);
    }, []);

    // You can later pass props like 'height' if you plan to animate it
    // For now, it will be a static element.

    return (
        <div className="relative mt-24">
             <div className="absolute top-0 left-0 w-full h-[150px] bg-red-500 shadow-lg"></div>
        </div>
    );
}

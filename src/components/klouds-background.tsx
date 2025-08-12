
'use client';

import { useEffect, useRef } from 'react';
import Klouds from 'klouds';

export function KloudsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const kloudsRef = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current && !kloudsRef.current) {
        kloudsRef.current = new Klouds({
            selector: canvasRef.current,
            speed: 2,
            layerCount: 5,
            cloudColor: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
            bgColor: 'transparent',
        });
    }

    const handleResize = () => {
        if(kloudsRef.current) {
            // Re-initializing might be one way if the library doesn't support resizing
            // This is a placeholder for actual resize logic if the lib supports it
        }
    }
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Optional: Add cleanup logic if Klouds provides a destroy method
      // if (kloudsRef.current && typeof kloudsRef.current.destroy === 'function') {
      //   kloudsRef.current.destroy();
      // }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
    />
  );
}

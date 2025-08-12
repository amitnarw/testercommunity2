
'use client';

import { useEffect, useRef } from 'react';

export function KloudsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const kloudsRef = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current && !kloudsRef.current) {
        import('klouds').then((KloudsModule) => {
            // Correctly instantiate the Klouds object from the module's default export
            kloudsRef.current = new (KloudsModule.default)({
                selector: canvasRef.current,
                speed: 2,
                layerCount: 5,
                cloudColor: `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--primary')})`,
                bgColor: 'transparent',
            });
        });
    }

    const handleResize = () => {
        if(kloudsRef.current) {
            // Placeholder for resize logic if the library supports it
        }
    }
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
    />
  );
}

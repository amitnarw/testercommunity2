'use client';

import { useState, useEffect } from 'react';
import { Bug } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BugSquashGame() {
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [score, setScore] = useState(0);
  const [splat, setSplat] = useState(false);
  const [splatPosition, setSplatPosition] = useState({ top: 0, left: 0 });

  const moveBug = () => {
    const top = Math.random() * 85 + 5; // 5% to 90%
    const left = Math.random() * 85 + 5; // 5% to 90%
    setPosition({ top, left });
  };

  useEffect(() => {
    const interval = setInterval(moveBug, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleBugClick = () => {
    setScore(score + 1);
    setSplatPosition(position);
    setSplat(true);
    setTimeout(() => setSplat(false), 300);
    moveBug();
  };

  return (
    <Card className="w-full h-64 relative overflow-hidden rounded-xl shadow-inner bg-secondary/50">
      <CardContent className="p-4 h-full">
        <div className="absolute top-2 left-4 text-left">
          <p className="font-mono text-lg">
            Score: <span className="font-bold text-primary">{score}</span>
          </p>
        </div>

        <div
          className={cn(
            'absolute w-8 h-8 text-red-500 transition-opacity duration-300',
            splat ? 'opacity-100' : 'opacity-0'
          )}
          style={{ top: `${splatPosition.top}%`, left: `${splatPosition.left}%`, transform: 'translate(-50%, -50%)' }}
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0 C20 20, 20 80, 50 100 C80 80, 80 20, 50 0 Z" fill="currentColor" transform="rotate(45 50 50)"/>
            <circle cx="50" cy="50" r="10" fill="currentColor"/>
          </svg>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${position.top}%`, left: `${position.left}%` }}
          onClick={handleBugClick}
        >
          <Bug className="w-8 h-8 text-foreground hover:text-primary hover:scale-125 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}

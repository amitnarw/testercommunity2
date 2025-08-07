'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const radius = 26;
  const strokeWidth = 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;

    setIsVisible(scrollTop > 300);
    setScrollProgress(progress);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={cn(
        'fixed bottom-8 right-8 z-50 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="relative w-16 h-16">
        {/* Progress border */}
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none z-10"
          viewBox="0 0 60 60"
        >
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="var(--tw-border-color)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary transition-all duration-200"
          />
        </svg>

        {/* Button */}
        <Button
          onClick={scrollToTop}
          variant="ghost"
          size="icon"
          className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
        >
          <ArrowUp className="w-6 h-6" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      </div>
    </div>
  );
}

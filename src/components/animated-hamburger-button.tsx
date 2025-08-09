
'use client';

import { cn } from '@/lib/utils';

interface AnimatedHamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function AnimatedHamburgerButton({ isOpen, onClick, className }: AnimatedHamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn('hamburger-button', isOpen && 'open', className)}
      aria-label="Toggle menu"
    >
      <span className="hamburger-box">
        <span className="hamburger-inner"></span>
      </span>
    </button>
  );
}

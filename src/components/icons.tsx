
import type { SVGProps } from 'react';

export function InTestersLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 160 32"
      aria-hidden="true"
      suppressHydrationWarning
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
        </linearGradient>
      </defs>
      <text
        fontFamily="Plus Jakarta Sans, sans-serif"
        fontSize="32"
        fontWeight="bold"
        fill="url(#logo-gradient)"
        x="0"
        y="24"
        suppressHydrationWarning
      >
        inTesters
      </text>
    </svg>
  );
}

export function GoldBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFD700' }} />
          <stop offset="100%" style={{ stopColor: '#FFA500' }} />
        </linearGradient>
      </defs>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#gold-gradient)" stroke="#B8860B" />
      <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2.5" />
    </svg>
  );
}

export function SilverBadge(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <defs>
          <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#C0C0C0' }} />
            <stop offset="100%" style={{ stopColor: '#A9A9A9' }} />
          </linearGradient>
        </defs>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#silver-gradient)" stroke="#808080" />
        <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2.5" />
      </svg>
    );
}

export function BronzeBadge(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <defs>
          <linearGradient id="bronze-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#CD7F32' }} />
            <stop offset="100%" style={{ stopColor: '#A0522D' }} />
          </linearGradient>
        </defs>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#bronze-gradient)" stroke="#8B4513" />
        <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2.5" />
      </svg>
    );
}

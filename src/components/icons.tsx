import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function SiteLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center w-auto", className)}>
      <InTestersLogoShort className="h-10 w-10" />
      <span className="text-[9px] font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block w-full text-center">
        inTesters
      </span>
    </div>
  );
}

export function InTestersLogoShortHeader(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      suppressHydrationWarning
      {...props}
    >
      <defs>
        <linearGradient
          id="logo-gradient-header"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: "#3b82f6" }} />
          <stop offset="50%" style={{ stopColor: "#6366f1" }} />
          <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
        </linearGradient>
        <filter id="glow-header" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Main Squircle Background - Same design for consistency */}
      <rect width="40" height="40" rx="12" fill="url(#logo-gradient-header)" />

      <g
        transform="translate(8, 8)"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M6 4 L3 4 C 1.5 4 1.5 4 1.5 6 L 1.5 18 C 1.5 20 1.5 20 3 20 L 6 20" />
        <path d="M18 4 L21 4 C 22.5 4 22.5 4 22.5 6 L 22.5 18 C 22.5 20 22.5 20 21 20 L 18 20" />
        <path
          d="M8 12 L11 15 L16 9"
          strokeWidth="3"
          filter="url(#glow-header)"
          strokeOpacity="0.5"
        />
        <path d="M8 12 L11 15 L16 9" strokeWidth="3" />
      </g>
    </svg>
  );
}

export function InTestersLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-3">
      <InTestersLogoShort className="h-8 w-8" />
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        inTesters
      </span>
    </div>
  );
}

export function InTestersLogoShort(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      suppressHydrationWarning
      {...props}
    >
      <defs>
        <linearGradient
          id="logo-gradient-short"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: "#3b82f6" }} /> {/* Blue 500 */}
          <stop offset="50%" style={{ stopColor: "#6366f1" }} />{" "}
          {/* Indigo 500 */}
          <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />{" "}
          {/* Violet 500 */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Main Squircle Background */}
      <rect width="40" height="40" rx="12" fill="url(#logo-gradient-short)" />

      {/* Minimalist 'Code Check' Concept: Brackets forming a box with a checkmark */}
      <g
        transform="translate(8, 8)"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Left Bracket */}
        <path d="M6 4 L3 4 C 1.5 4 1.5 4 1.5 6 L 1.5 18 C 1.5 20 1.5 20 3 20 L 6 20" />
        {/* Right Bracket */}
        <path d="M18 4 L21 4 C 22.5 4 22.5 4 22.5 6 L 22.5 18 C 22.5 20 22.5 20 21 20 L 18 20" />
        {/* Checkmark in center - slightly offset to look dynamic */}
        <path
          d="M8 12 L11 15 L16 9"
          strokeWidth="3"
          filter="url(#glow)"
          strokeOpacity="0.5"
        />
        <path d="M8 12 L11 15 L16 9" strokeWidth="3" />
      </g>
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
          <stop offset="0%" style={{ stopColor: "#FFD700" }} />
          <stop offset="100%" style={{ stopColor: "#FFA500" }} />
        </linearGradient>
      </defs>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill="url(#gold-gradient)"
        stroke="#B8860B"
      />
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
          <stop offset="0%" style={{ stopColor: "#C0C0C0" }} />
          <stop offset="100%" style={{ stopColor: "#A9A9A9" }} />
        </linearGradient>
      </defs>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill="url(#silver-gradient)"
        stroke="#808080"
      />
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
          <stop offset="0%" style={{ stopColor: "#CD7F32" }} />
          <stop offset="100%" style={{ stopColor: "#A0522D" }} />
        </linearGradient>
      </defs>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill="url(#bronze-gradient)"
        stroke="#8B4513"
      />
      <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2.5" />
    </svg>
  );
}

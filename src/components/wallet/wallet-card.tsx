import { Skeleton } from "@/components/ui/skeleton";
import { UserWallerResponse } from "@/lib/types";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useCallback } from "react";

interface WalletCardProps {
  session: {
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    };
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
    };
  } | null;
  walletData: UserWallerResponse | undefined;
  walletIsPending: boolean;
}

const CardChip = () => (
  <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="47" height="35" rx="5" fill="url(#chipGrad)" stroke="rgba(255,255,255,0.15)" />
    <rect x="7" y="7" width="34" height="22" rx="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="12" y1="18" x2="36" y2="18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="12" y1="13" x2="36" y2="13" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="12" y1="23" x2="36" y2="23" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="12" y1="7" x2="12" y2="29" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
    <line x1="36" y1="7" x2="36" y2="29" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
    <defs>
      <linearGradient id="chipGrad" x1="0" y1="0" x2="48" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FCD34D" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
  </svg>
);

const ContactlessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 14C7.5 12.5 7.5 9.5 6 8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8.5 16C11 13.5 11 8.5 8.5 6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 18C14.5 14.5 14.5 7.5 11 4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="5" cy="11" r="1.5" fill="rgba(255,255,255,0.4)" />
  </svg>
);

const InTestersLogo = () => (
  <svg viewBox="0 0 542 542" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0,542) scale(0.1,-0.1)">
      <path d="M1276 4654 c-256 -62 -434 -292 -412 -534 20 -224 224 -362 511 -347
173 10 308 69 411 180 61 66 94 124 119 212 23 77 17 211 -13 277 -44 99 -148
179 -279 213 -72 19 -257 18 -337 -1z"/>
      <path d="M2145 4638 c-5 -13 -235 -958 -235 -965 0 -1 -271 -3 -603 -3 l-602
0 -108 -472 c-60 -260 -172 -745 -248 -1078 -145 -625 -302 -1309 -314 -1369
l-7 -34 138 6 c77 4 173 14 214 22 397 79 684 339 809 732 17 54 92 366 166
693 74 327 146 640 158 695 l24 100 102 3 103 3 -7 -28 c-11 -42 -90 -380
-210 -896 -86 -372 -94 -532 -36 -705 39 -118 89 -200 178 -292 210 -221 521
-331 1008 -355 173 -9 550 16 572 39 2 2 45 187 97 412 l93 409 -311 6 c-297
5 -313 6 -364 28 -71 32 -107 76 -122 147 -17 80 0 184 118 734 l98 455 1186
3 1186 2 7 33 c4 17 40 178 81 357 41 178 74 330 74 337 0 10 -235 13 -1178
15 l-1179 3 109 470 c59 259 108 478 108 488 0 16 -33 17 -550 17 -431 0 -552
-3 -555 -12z"/>
    </g>
  </svg>
);

const formatCardNumber = (points: number): string => {
  return String(points).padStart(4, "0").slice(-4);
};

const embossedStyle = {
  textShadow: "0 1px 2px rgba(0,0,0,0.6), 0 -1px 1px rgba(255,255,255,0.15)",
};

const cardBevelStyle = {
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 2px rgba(0,0,0,0.4)",
};

export function WalletCard({
  session,
  walletData,
  walletIsPending,
}: WalletCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(nx);
      y.set(ny);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const cardNumber = walletData ? formatCardNumber(walletData.totalPoints) : "0000";
  const points = walletData?.totalPoints ?? 0;
  const packages = walletData?.totalPackages ?? 0;

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
      <motion.div
        className="relative aspect-[1.586/1] w-full rounded-[2rem] overflow-hidden group cursor-default select-none z-10"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...cardBevelStyle }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-[#111111] to-[#080808]" />

        {/* Metallic sheen - intensifies on hover */}
        <div
          className="absolute inset-0 transition-all duration-700 opacity-70 group-hover:opacity-100"
          style={{
            background: "linear-gradient(-15deg, transparent 30%, rgba(217,119,6,0.08) 55%, rgba(180,83,9,0.06) 70%, rgba(251,191,36,0.04) 85%, transparent 100%)",
          }}
        />

        {/* Radial glow top-right */}
        <div
          className="absolute -top-16 -right-16 w-2/3 h-2/3"
          style={{
            background: "radial-gradient(circle at top right, rgba(217,119,6,0.08), transparent 70%)",
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="1"/%3E%3C/svg%3E\')',
          }}
        />

        {/* Giant watermark background */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
          <div className="flex flex-col items-center gap-0 rotate-[-6deg]">
            <span className="text-[7rem] sm:text-[9rem] font-black text-white/[0.04] tracking-tighter uppercase leading-none select-none whitespace-nowrap">
              INTESTERS
            </span>
            <span className="text-[7rem] sm:text-[9rem] font-black text-white/[0.04] tracking-tighter uppercase leading-none select-none whitespace-nowrap">
              CARD
            </span>
            <span className="text-[7rem] sm:text-[9rem] font-black text-white/[0.04] tracking-tighter uppercase leading-none select-none whitespace-nowrap">
              INTESTERS
            </span>
          </div>
        </div>

        {/* Primary shimmer */}
        <div
          className="absolute inset-0 z-20 pointer-events-none translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.07) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.07) 55%, transparent 70%)",
            clipPath: "polygon(0 0, 60% 0, 60% 100%, 0 100%)",
          }}
        />

          {/* Secondary shimmer (warm gold, steeper angle, delayed) */}
        <div
          className="absolute inset-0 z-20 pointer-events-none translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out delay-100"
          style={{
            background: "linear-gradient(125deg, transparent 40%, rgba(251,191,36,0.06) 50%, transparent 60%)",
            clipPath: "polygon(0 0, 40% 0, 40% 100%, 0 100%)",
          }}
        />

        {/* Content */}
        <div className="relative h-full p-5 sm:p-7 flex flex-col justify-between z-10 text-white">
          {/* Top row */}
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
              INTESTERS CARD
            </p>
            <div className="w-7 h-7 sm:w-8 sm:h-8 text-white/80">
              <InTestersLogo />
            </div>
          </div>

          {/* Middle: Chip + Balance */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <CardChip />
              <ContactlessIcon />
            </div>
            <div className="flex-1 text-right space-y-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                TOTAL BALANCE
              </p>
              {walletIsPending ? (
                <div className="flex items-center justify-end gap-2 sm:gap-3">
                  <Skeleton className="w-20 h-7 sm:h-8 bg-white/10" />
                  <div className="w-px h-6 sm:h-8 bg-white/20 rotate-[15deg]" />
                  <Skeleton className="w-20 h-7 sm:h-8 bg-white/10" />
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2 sm:gap-3">
                  <h2 className="text-xl sm:text-3xl font-bold tabular-nums" style={embossedStyle}>
                    {packages}{" "}
                    <span className="text-xs sm:text-sm text-white/50 font-normal">
                      pkgs
                    </span>
                  </h2>
                  <div className="w-px h-6 sm:h-8 bg-white/20 rotate-[15deg]" />
                  <h2 className="text-xl sm:text-3xl font-bold tabular-nums" style={embossedStyle}>
                    {points}{" "}
                    <span className="text-xs sm:text-sm text-white/50 font-normal">
                      pts
                    </span>
                  </h2>
                </div>
              )}
            </div>
          </div>

          {/* Card number */}
          <p
            className="font-mono text-sm sm:text-base tracking-[0.3em] text-white/80 text-center"
            style={embossedStyle}
          >
            **** **** {cardNumber}
          </p>

          {/* Bottom row */}
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase tracking-widest text-white/40">
                CARD HOLDER
              </p>
              <p
                className="text-xs sm:text-sm font-semibold tracking-wide text-white/90"
                style={embossedStyle}
              >
                {session?.user?.name || "—"}
              </p>
            </div>

            <div className="text-right space-y-0.5">
                <p className="text-[9px] uppercase tracking-widest text-white/40">
                  EXPIRY
                </p>
                <p
                  className="text-xs sm:text-sm font-semibold tracking-wide text-white/90"
                  style={embossedStyle}
                >
                  NEVER
                </p>
              </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

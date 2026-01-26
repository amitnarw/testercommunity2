import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useEarnPoints } from "@/hooks/useUser";
import { authClient } from "@/lib/auth-client";

export function EarnPointsButton() {
  const { data: session } = authClient.useSession();
  const sessionData = session as any;
  const {
    data: earnPointsData,
    isPending: earnPointsIsPending,
    isError: earnPointsIsError,
    error: earnPointsError,
  } = useEarnPoints();

  if (!earnPointsIsPending && earnPointsData?.surveyDone) {
    return null;
  }

  if (
    earnPointsIsPending ||
    !sessionData ||
    sessionData?.role?.name?.toLowerCase() !== "user"
  ) {
    return null;
  }

  return (
    <Link href="/profile/profile-setup" className="relative group mr-1 md:mr-2">
      <motion.div
        className="relative flex items-center justify-center gap-1 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-xl bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 border border-amber-200 dark:border-amber-700/50 shadow-[0_2px_8px_-2px_rgba(251,191,36,0.3)] overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 2px 8px -2px rgba(251,191,36,0.3)",
            "0 4px 12px -2px rgba(251,191,36,0.5)",
            "0 2px 8px -2px rgba(251,191,36,0.3)",
          ],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* Shimmer effect overlay - faster and brighter */}
        <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent z-10" />

        {/* Content Container */}
        <div className="flex flex-col items-center z-20">
          <div className="flex items-center gap-0.5 md:gap-1 mb-0.5">
            <span className="text-[8px] md:text-[9px] font-bold text-amber-600/90 dark:text-amber-400/90 tracking-wider uppercase">
              Earn
            </span>
            {/* Rotating Sparkle */}
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-2 h-2 md:w-2.5 md:h-2.5 text-amber-500 fill-amber-500/40" />
            </motion.div>
          </div>
          <span className="text-[10px] md:text-xs font-black text-amber-700 dark:text-amber-300 leading-none drop-shadow-sm">
            200 pts
          </span>
        </div>

        {/* Floating background particles - varying positions and timing for more 'sparkle' */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-400/30 blur-[0.5px]"
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Gold Glow around edges on hover */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-amber-400/0 group-hover:ring-amber-400/50 transition-all duration-300 pointer-events-none" />
      </motion.div>
    </Link>
  );
}

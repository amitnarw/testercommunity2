"use client";

import { Zap, Users2, Package } from "lucide-react";
import { motion } from "framer-motion";
import { TransitionLink } from "@/components/transition-link";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function QuickActions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="mb-4 mt-14 ml-2 flex flex-wrap gap-3"
    >
      <QuickActionPill
        href="/app/pro-testing/add-app"
        label="Submit Pro App"
      />
      <QuickActionPill
        href="/app/free-testing/submit"
        label="Submit Free App"
      />
      <QuickActionPill
        href={ROUTES.AUTHENTICATED.BILLING}
        label="Buy Packages"
      />
    </motion.section>
  );
}

function QuickActionPill({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <TransitionLink
      href={href}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#222222] text-white border border-white/5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#2a2a2a] group"
      )}
    >
      <span className="text-sm font-semibold">{label}</span>
    </TransitionLink>
  );
}

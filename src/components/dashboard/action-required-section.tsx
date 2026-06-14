"use client";

import { AlertTriangle, AlertCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AutoTransitionLink } from "@/components/auto-transition-link";
import { AmbientGlowOrb } from "@/components/dashboard/ambient-glow-orb";
import { cn } from "@/lib/utils";

interface ActionItem {
  label: string;
  description: string;
  href: string;
  severity: "high" | "medium" | "low";
}

interface ActionRequiredSectionProps {
  actionItems: ActionItem[];
}

export function ActionRequiredSection({ actionItems }: ActionRequiredSectionProps) {
  if (actionItems.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      className="mb-8"
    >
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        Action Required
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
        {actionItems.map((item, i) => (
          <AutoTransitionLink
            key={i}
            href={item.href}
            className={cn(
              "shrink-0 w-72 relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:shadow-lg group",
              item.severity === "high"
                ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10"
                : "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10",
            )}
          >
            <AmbientGlowOrb
              color={item.severity === "high" ? "bg-red-500/10" : "bg-amber-500/10"}
              className="absolute -top-6 -right-6 w-20 h-20"
            />
            <div className="relative z-10 flex items-start gap-3">
              <div className={cn(
                "rounded-full p-2 shrink-0",
                item.severity === "high" ? "bg-red-500/15" : "bg-amber-500/15",
              )}>
                <AlertCircle className={cn(
                  "w-4 h-4",
                  item.severity === "high" ? "text-red-500" : "text-amber-500",
                )} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </AutoTransitionLink>
        ))}
      </div>
    </motion.section>
  );
}

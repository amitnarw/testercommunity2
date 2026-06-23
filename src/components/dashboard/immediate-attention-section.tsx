"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AmbientGlowOrb } from "@/components/dashboard/ambient-glow-orb";
import type { ImmediateAttentionItem } from "@/types/iar";



function sanitizeColor(color: string): string {
  return /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#ef4444";
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

interface IarCardProps {
  item: ImmediateAttentionItem;
}

function IarCardVariantA({ item }: IarCardProps) {
  const safeColor = sanitizeColor(item.color);
  const rgb = hexToRgb(safeColor);
  const shadowColor = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "239, 68, 68";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-[2rem] p-5",
        "bg-card text-card-foreground",
        "transition-all duration-300 group",
        "hover:-translate-y-0.5",
        item.url ? "cursor-pointer" : "",
      )}
      style={{
        boxShadow: `0 8px 30px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)`,
        borderLeft: `5px solid ${safeColor}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 12px 48px rgba(${shadowColor}, 0.12), 0 8px 40px rgba(0,0,0,0.08)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)`;
      }}
      onClick={() => {
        if (item.url) {
          window.open(item.url, "_blank", "noopener,noreferrer");
        }
      }}
      role={item.url ? "button" : undefined}
      tabIndex={item.url ? 0 : undefined}
      onKeyDown={(e) => {
        if (item.url && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          window.open(item.url, "_blank", "noopener,noreferrer");
        }
      }}
    >

      <div className="absolute -top-8 -right-8 w-28 h-28 opacity-[0.04] pointer-events-none">
        <AlertTriangle className="w-full h-full" style={{ color: safeColor }} />
      </div>

      <div className="relative z-10 pl-3">
        <div className="flex items-start gap-3">
          <div
            className="rounded-xl p-2.5 shrink-0"
            style={{ backgroundColor: safeColor + "14" }}
          >
            <AlertTriangle className="w-4 h-4" style={{ color: safeColor }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
            {item.url && (
              <div className="mt-2.5 flex items-center gap-1 text-xs font-medium transition-all duration-200 group/link"
                style={{ color: safeColor }}
              >
                <span>Open link</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ImmediateAttentionSectionProps {
  items: ImmediateAttentionItem[];
}

export function ImmediateAttentionSection({ items }: ImmediateAttentionSectionProps) {
  if (items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
          Immediate Attention Required
        </h2>
        <span className="text-[10px] font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full leading-none">
          {items.length}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <IarCardVariantA key={item.id} item={item} />
        ))}
      </div>
    </motion.section>
  );
}
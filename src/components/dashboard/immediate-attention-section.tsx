"use client";

import { useState } from "react";
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
  
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = item.description && item.description.length > 90;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 border",
        "bg-card text-card-foreground",
        "transition-all duration-300 group",
        "hover:-translate-y-0.5",
        item.url ? "cursor-pointer" : "",
      )}
      style={{
        borderColor: safeColor + "20",
        boxShadow: `0 4px 20px -2px rgba(0,0,0,0.02), 0 2px 6px -1px rgba(0,0,0,0.01)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = safeColor + "45";
        e.currentTarget.style.boxShadow = `0 12px 30px -5px rgba(${shadowColor}, 0.08), 0 4px 12px -2px rgba(${shadowColor}, 0.04)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = safeColor + "20";
        e.currentTarget.style.boxShadow = `0 4px 20px -2px rgba(0,0,0,0.02), 0 2px 6px -1px rgba(0,0,0,0.01)`;
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
      {/* Background Watermark Icon - Scaled, rotated, and animated on hover */}
      <div
        className="absolute -right-5 -bottom-5 w-24 h-24 opacity-[0.05] dark:opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
        style={{ color: safeColor }}
      >
        <AlertTriangle className="w-full h-full" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col gap-2">
          {/* Header Area with Pulsing Status Indicator Dot */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: safeColor }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: safeColor }} />
            </span>
            <h3 className="font-bold text-sm text-foreground tracking-tight leading-none">
              {item.title}
            </h3>
          </div>
          
          <div className="min-w-0">
            <p className={cn(
              "text-xs text-muted-foreground leading-relaxed break-words transition-all duration-300",
              isExpanded ? "" : "line-clamp-2"
            )}>
              {item.description}
            </p>

            {isLongText && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="mt-1 text-[11px] font-bold hover:underline inline-flex items-center gap-0.5 transition-all duration-200"
                style={{ color: safeColor }}
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}

            {item.url && (
              <div
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border transition-all duration-200 group/link"
                style={{
                  color: safeColor,
                  borderColor: safeColor + "25",
                  backgroundColor: safeColor + "05",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = safeColor + "10";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = safeColor + "05";
                }}
              >
                <span>Open</span>
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
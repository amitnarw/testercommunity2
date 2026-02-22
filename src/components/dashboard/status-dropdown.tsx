"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusOption {
  value: string;
  label: string;
  dotClass: string;
  desc: string;
  color: string; // Used for gradients and glows
}

interface StatusDropdownProps {
  options: StatusOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

export function StatusDropdown({
  options,
  value,
  onChange,
  className,
  label = "Availability",
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentOption = options.find((o) => o.value === value) || options[0];

  // Close when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = (event: Event) => {
      // Don't close if scrolling inside the dropdown itself
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true); // Use capture phase to catch all scrolls

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        ref={triggerRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300",
          "bg-white/80 dark:bg-black/40 backdrop-blur-xl",
          "border-black/5 dark:border-white/10 hover:border-primary/30",
          "shadow-[0_4px_20px_-1px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(var(--primary)/0.1)]",
          isOpen && "ring-2 ring-primary/20 border-primary/40",
        )}
      >
        {/* Status indicator with glow */}
        <div className="relative flex items-center justify-center">
          <motion.div
            layoutId="status-dot-glow"
            className={cn(
              "absolute inset-0 rounded-full blur-[8px] opacity-40",
              currentOption.dotClass,
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div
            className={cn(
              "relative w-2.5 h-2.5 rounded-full ring-2 ring-background z-10",
              currentOption.dotClass,
            )}
          />
        </div>

        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
            {label}
          </span>
          <span className="text-sm font-semibold tracking-tight">
            {currentOption.label}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="ml-2 text-muted-foreground group-hover:text-primary transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "absolute right-0 top-full mt-2 w-[280px] overflow-hidden rounded-[24px] border border-white/20 dark:border-white/10 p-2",
              "bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-3xl shadow-2xl",
              "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:pointer-events-none z-10",
            )}
          >
            <div className="flex flex-col gap-1 relative z-10">
              {options.map((option) => (
                <StatusItem
                  key={option.value}
                  option={option}
                  isSelected={value === option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 px-2 pb-1">
              <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/50 italic px-2">
                <Sparkles className="w-3 h-3" />
                Live Status Enabled
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusItem({
  option,
  isSelected,
  onClick,
}: {
  option: StatusOption;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        "relative flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-all duration-200",
        isSelected
          ? "bg-primary/5 shadow-[inset_0_0_20px_rgba(var(--primary)/0.03)]"
          : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]",
      )}
    >
      {/* Background highlight for hover */}
      {isHovered && (
        <motion.div
          layoutId="hover-highlight"
          className="absolute inset-0 bg-primary/5 rounded-xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Status Dot with dynamic color */}
      <div
        className={cn(
          "w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]",
          option.dotClass,
        )}
        style={{
          boxShadow: isHovered ? `0 0 12px ${option.color}66` : undefined,
        }}
      />

      <div className="flex flex-col gap-0.5 pointer-events-none">
        <span
          className={cn(
            "text-sm font-semibold tracking-tight transition-colors",
            isSelected ? "text-primary" : "text-foreground/90",
          )}
        >
          {option.label}
        </span>
        <span className="text-[11px] text-muted-foreground/70 leading-normal">
          {option.desc}
        </span>
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto text-primary"
        >
          <div className="flex items-center justify-center bg-primary/10 rounded-full p-1">
            <Check className="w-3 h-3" strokeWidth={3} />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}

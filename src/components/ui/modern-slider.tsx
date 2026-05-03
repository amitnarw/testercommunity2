"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  unit?: string;
  accentColor?: string;
}

export function ModernSlider({
  value,
  onChange,
  min,
  max,
  label,
  unit = "",
  accentColor = "primary",
}: ModernSliderProps) {
  const progress = ((value - min) / (max - min)) * 100;
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = Math.round(min + percent * (max - min));
    onChange(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleDrag(e);
    const handleMouseMove = (e: MouseEvent) => handleDrag(e);
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDrag(e);
    const handleTouchMove = (e: TouchEvent) => handleDrag(e);
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground/80">{label}</label>
        <div className="flex items-baseline gap-1">
          <motion.span
            key={value}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "text-3xl font-bold",
              accentColor === "primary" ? "text-primary" : "text-green-500",
            )}
          >
            {value}
          </motion.span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="relative h-12 flex items-center cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Track background */}
        <div className="absolute left-0 right-0 h-2 rounded-full bg-secondary/50">
          {/* Markers */}
          <div className="absolute inset-0 flex justify-between px-1">
            {[...Array(max - min + 1)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 h-1 rounded-full transition-colors duration-200",
                  i <= value - min ? "bg-primary" : "bg-border",
                )}
              />
            ))}
          </div>
        </div>

        {/* Filled track */}
        <motion.div
          className="absolute h-2 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_hsl(var(--primary)/0.4)]"
          style={{ width: `${progress}%` }}
          layout
        />

        {/* Thumb */}
        <motion.div
          className="absolute w-6 h-6 rounded-full bg-background border-[3px] border-primary shadow-lg shadow-primary/30 cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${progress}% - 12px)` }}
          layout
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 1.05 }}
        >
          {/* Inner dot */}
          <div className="absolute inset-[3px] rounded-full bg-primary" />
        </motion.div>
      </div>

      {/* Scale markers */}
      {/* <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{min}</span>
        <span className="text-primary font-medium">{value}</span>
        <span>{max}</span>
      </div> */}
    </div>
  );
}

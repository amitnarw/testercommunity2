"use client";

import { cn } from "@/lib/utils";

export type StepIndicatorVariant = "primary" | "emerald";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  variant?: StepIndicatorVariant;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  variant = "primary",
  className,
}: StepIndicatorProps) {
  const activeColor = variant === "emerald"
    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
    : "bg-primary text-primary-foreground shadow-lg shadow-primary/30";
  const completedColor = variant === "emerald"
    ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30"
    : "bg-primary/20 text-primary border border-primary/30";
  const connectorActive = variant === "emerald"
    ? "bg-gradient-to-r from-emerald-500 to-emerald-500/30"
    : "bg-gradient-to-r from-primary to-primary/30";

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center">
        {steps.map((label, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          const isFuture = idx > currentStep;
          return (
            <div key={`${label}-${idx}`} className="flex items-center">
              <div
                className={cn(
                  "px-3 py-1.5 sm:px-5 sm:py-2 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors",
                  isActive && activeColor,
                  !isActive && isCompleted && completedColor,
                  !isActive && isFuture &&
                    "bg-secondary text-muted-foreground border border-border font-medium",
                )}
              >
                {label}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "w-6 sm:w-12 h-0.5 rounded-full",
                    idx < currentStep ? connectorActive : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

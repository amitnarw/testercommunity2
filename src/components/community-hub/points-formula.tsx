"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Coins, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";

const EARN_PER_TESTER = 80;
const EARN_PER_DAY = 10;
const COST_PER_TESTER = 80;
const COST_PER_DAY = 10;

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    const duration = 400;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span className={className}>{display.toLocaleString()}</span>;
}

interface ModernSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  unit?: string;
  accentColor?: string;
}

function ModernSlider({
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

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
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
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{min}</span>
        <span className="text-primary font-medium">{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function PointsFormula() {
  const [testers, setTesters] = useState(12);
  const [days, setDays] = useState(14);
  const [activeTab, setActiveTab] = useState<"earn" | "spend">("earn");

  const earnAmount = testers * EARN_PER_TESTER + days * EARN_PER_DAY;
  const costAmount = testers * COST_PER_TESTER + days * COST_PER_DAY;

  const currentAmount = activeTab === "earn" ? earnAmount : costAmount;

  return (
    <section data-loc="PointsFormula" className="py-16 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
      </div>
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.08] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Coins className="w-3.5 h-3.5" />
            <span>Points System</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight">
            The{" "}
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              Points Formula
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Simple, transparent, and always in your favor. Earn points by testing,
            spend them to get your app tested.
          </p>
        </motion.div>

        {/* Main Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative group">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

            {/* Card */}
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
              <div className="absolute inset-0 backdrop-blur-xl" />
              <div className="absolute inset-[1px] rounded-3xl border border-white/10 bg-transparent" />

              <div className="relative p-6 md:p-10">
                {/* Tab Switcher */}
                <div className="flex justify-center mb-8 md:mb-12">
                  <div className="inline-flex p-1 rounded-full bg-secondary/50 border border-border/50">
                    <button
                      onClick={() => setActiveTab("earn")}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                        activeTab === "earn"
                          ? "bg-background text-foreground shadow-lg shadow-black/10"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      Earn Points
                    </button>
                    <button
                      onClick={() => setActiveTab("spend")}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                        activeTab === "spend"
                          ? "bg-background text-foreground shadow-lg shadow-black/10"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <ArrowDownRight className="w-4 h-4 text-orange-500" />
                      Spend Points
                    </button>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                  {/* Left: Sliders */}
                  <div className="flex-1 space-y-8 md:space-y-10">
                    <ModernSlider
                      value={testers}
                      onChange={setTesters}
                      min={1}
                      max={20}
                      label="Number of Testers"
                      unit="testers"
                      accentColor="primary"
                    />

                    <ModernSlider
                      value={days}
                      onChange={setDays}
                      min={1}
                      max={20}
                      label="Testing Duration"
                      unit="days"
                      accentColor="green"
                    />
                  </div>

                  {/* Right: Result */}
                  <div className="lg:w-[280px]">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "rounded-2xl p-5 md:p-6 text-center",
                        activeTab === "earn"
                          ? "bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30"
                          : "bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30",
                      )}
                    >
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            activeTab === "earn" ? "bg-green-500/20" : "bg-orange-500/20",
                          )}
                        >
                          <Coins
                            className={cn(
                              "w-4 h-4",
                              activeTab === "earn" ? "text-green-500" : "text-orange-500",
                            )}
                          />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          {activeTab === "earn" ? "You'll Earn" : "You'll Need"}
                        </span>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${activeTab}-${currentAmount}`}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="mb-2"
                        >
                          <span
                            className={cn(
                              "text-5xl md:text-6xl font-bold tracking-tight",
                              activeTab === "earn" ? "text-green-500" : "text-orange-500",
                            )}
                          >
                            <AnimatedNumber value={currentAmount} />
                          </span>
                        </motion.div>
                      </AnimatePresence>

                      <span className="text-sm text-muted-foreground">points</span>

                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                          {activeTab === "earn" ? "Earned from:" : "Cost:"}
                        </p>
                        <p className="text-xs text-foreground/60 mt-1">
                          {testers}×{EARN_PER_TESTER} + {days}×{EARN_PER_DAY}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Quick presets */}
                <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-3">
                  {[
                    { label: "Google Play Req.", testers: 12, days: 14 },
                    { label: "Quick Test", testers: 5, days: 7 },
                    { label: "Extended", testers: 20, days: 20 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setTesters(preset.testers);
                        setDays(preset.days);
                      }}
                      className="px-4 py-2 rounded-full text-xs font-medium bg-secondary/50 border border-border/50 hover:bg-secondary hover:border-primary/30 transition-all duration-300 hover:text-primary"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto mt-8 md:mt-12"
        >
          <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-green-500/20">
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">How You Earn</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  +{EARN_PER_TESTER} points per tester that completes your test +{EARN_PER_DAY} bonus points per day of testing. Complete more days for bigger rewards!
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-orange-500/5 to-orange-500/10 border border-orange-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/20">
                <ArrowDownRight className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">How You Spend</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your app needs {COST_PER_TESTER} points per tester × number of days ({COST_PER_DAY}/day). Promo codes can reduce this cost significantly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  Users,
  Star,
  Zap,
  Shield,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import { ModernSlider } from "@/components/ui/modern-slider";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  getLevelFromCompleted,
  getAvailableSlots,
  MAX_HANDSHAKE_LEVEL,
} from "@/lib/handshake";

const levelNodes = Array.from({ length: MAX_HANDSHAKE_LEVEL }, (_, i) => ({
  level: i + 1,
  slots: getAvailableSlots(i + 1),
  testsNeeded: i * 2,
}));

export function PointsFormula() {
  const [completedCount, setCompletedCount] = useState(0);

  const currentLevel = getLevelFromCompleted(completedCount);
  const currentSlots = getAvailableSlots(currentLevel);
  const nextLevelThreshold = currentLevel * 2;
  const testsToNext = Math.max(0, nextLevelThreshold - completedCount);
  const prevThreshold = (currentLevel - 1) * 2;
  const progressToNext =
    currentLevel < MAX_HANDSHAKE_LEVEL
      ? Math.min(100, ((completedCount - prevThreshold) / 2) * 100)
      : 100;

  return (
    <section
      data-loc="PointsFormula"
      className="py-16 md:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[100px]" />
      </div>
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.08] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Interactive Level Calculator</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight">
            Calculate Your{" "}
            <span className="bg-gradient-to-br from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
              Testing Capacity
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Slide to see how many handshakes unlock more testers. Every 2
            completed handshakes = +1 level = +1 slot. Max 20 slots at Level 9.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-emerald-400/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
              <div className="absolute inset-0 backdrop-blur-xl" />
              <div className="absolute inset-[1px] rounded-3xl border border-white/10 bg-transparent" />

              <div className="relative p-6 md:p-10 space-y-8">
                <ModernSlider
                  id="handshake-calc"
                  value={completedCount}
                  onChange={setCompletedCount}
                  min={0}
                  max={40}
                  label="Completed Handshakes"
                  accentColor="emerald"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <ReadoutCard
                    label="Your Level"
                    value={`${currentLevel}`}
                    subtext={`of ${MAX_HANDSHAKE_LEVEL}`}
                  />
                  <ReadoutCard
                    label="Available Slots"
                    value={`${currentSlots}`}
                    subtext="tester slots per app"
                  />
                  <ReadoutCard
                    label="Cost"
                    value="Free"
                    subtext="barter-based, no subscription"
                  />
                  <ReadoutCard
                    label="Next Level In"
                    value={
                      currentLevel >= MAX_HANDSHAKE_LEVEL ? "Max" : `${testsToNext}`
                    }
                    subtext={
                      currentLevel >= MAX_HANDSHAKE_LEVEL
                        ? "level reached"
                        : "more handshakes"
                    }
                  />
                </div>

                {/* Level Scale Visualizer */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-foreground/80">
                      Level Ladder
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Current: Level {currentLevel} , {" "}
                      {currentLevel >= MAX_HANDSHAKE_LEVEL
                        ? "MAX reached!"
                        : `${currentSlots} slots`}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-secondary/50 rounded-full">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                        style={{
                          width: `${(currentLevel / MAX_HANDSHAKE_LEVEL) * 100}%`,
                        }}
                        layout
                      />
                    </div>
                    <div className="flex justify-between relative">
                      {levelNodes.map((node) => {
                        const isActive = node.level <= currentLevel;
                        const isCurrent = node.level === currentLevel;
                        return (
                          <div key={node.level} className="flex flex-col items-center">
                            <motion.div
                              className={cn(
                                "relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 z-10",
                                isActive
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                  : "bg-background border-border/50 text-muted-foreground",
                                isCurrent && "ring-4 ring-emerald-500/20 scale-110",
                              )}
                              animate={
                                isCurrent
                                  ? { scale: [1, 1.12, 1] }
                                  : {}
                              }
                              transition={{
                                repeat: isCurrent ? Infinity : 0,
                                duration: 2,
                              }}
                            >
                              {node.level}
                            </motion.div>
                            <span
                              className={cn(
                                "text-[10px] mt-1.5 font-medium",
                                isActive
                                  ? "text-emerald-600"
                                  : "text-muted-foreground/60",
                              )}
                            >
                              {node.slots}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value="how-levels-work"
                    className="border border-border/50 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="p-4 text-sm font-medium hover:bg-muted/30 transition-colors text-left gap-3">
                      How levels work
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
                      <p>
                        <strong>Level 1 (Start):</strong> 0 completed handshakes
                        → 12 tester slots.
                      </p>
                      <p>
                        <strong>Level up:</strong> Every 2 completed handshakes
                        raises your level by 1, unlocking 1 additional tester
                        slot.
                      </p>
                      <p>
                        <strong>Level 9 (Max):</strong> 16 completed handshakes
                        unlock the maximum of 20 slots ,  enough to meet Google
                        Play testing requirements with a buffer.
                      </p>
                      <p className="italic mt-2">
                        A handshake counts as &quot;completed&quot; only when both
                        sides finish the full 14-day testing cycle.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto mt-8 md:mt-12"
        >
          <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20">
                <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">How You Level Up</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Each time both you and your partner complete a 14-day handshake
                  test, it counts as 1 completed handshake. After 2 completed
                  handshakes, you gain 1 level and 1 extra slot.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20">
                <Star className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">Max Capacity</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  At Level 1, you can request up to 12 testers per app. At Level
                  9 (16 completed handshakes), you unlock the maximum of 20
                  testers ,  enough to meet Google Play requirements with a
                  buffer.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 border border-border/50">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-muted-foreground">
              Need guaranteed speed?{" "}
              <a
                href="/pricing"
                className="font-bold text-foreground hover:text-emerald-600 transition-colors underline underline-offset-2"
              >
                Pro Testing handles everything for you →
              </a>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <TrustBadge
              icon={<CheckCircle className="w-4 h-4" />}
              text="Free forever"
            />
            <TrustBadge
              icon={<CheckCircle className="w-4 h-4" />}
              text="No subscription"
            />
            <TrustBadge
              icon={<Shield className="w-4 h-4" />}
              text="Pure 1:1 barter"
            />
            <TrustBadge
              icon={<CheckCircle className="w-4 h-4" />}
              text="No points, pure barter"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ReadoutCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="p-4 md:p-5 rounded-xl border bg-emerald-500/5 border-emerald-500/20 text-center transition-all duration-300">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-2xl md:text-3xl font-bold tracking-tight text-emerald-600">
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{subtext}</div>
    </div>
  );
}

function TrustBadge({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
      {icon}
      <span>{text}</span>
    </div>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Play,
  UserPlus,
  Activity,
  Send,
} from "lucide-react";
import { DeviceMockup } from "./DeviceMockup";

const steps = [
  {
    step: 1,
    num: "01",
    icon: Play,
    title: "Set Up Closed Testing",
    desc: "Go to Google Play Console. Open Testing > Closed testing. Create a new track, upload your app, and fill in the store details.",
    details: [
      "Create a new closed testing track",
      "Upload your signed AAB file",
      "Fill in the store listing",
      "Set up testers via email or Google Groups",
    ],
  },
  {
    step: 2,
    num: "02",
    icon: UserPlus,
    title: "Get 12+ Testers",
    desc: "Add tester emails or use a Google Group. Generate the opt-in link and share it. Each tester needs to click this link to join.",
    details: [
      "Target 15-20 testers for safety",
      "Real phones only, no emulators",
      "Share the opt-in link securely",
      "Make sure everyone opts in",
    ],
  },
  {
    step: 3,
    num: "03",
    icon: Activity,
    title: "Keep Them Active for 14 Days",
    desc: "Check the Play Console every day. Push 2-3 small updates during the testing period. This shows Google you are actively improving the app.",
    details: [
      "Watch tester activity daily",
      "Push at least 2 updates",
      "Reply to tester feedback",
      "Never let the count drop below 12",
    ],
  },
  {
    step: 4,
    num: "04",
    icon: Send,
    title: "Apply for Production",
    desc: "After 14 days, fill out the Production Access form. Be specific about the feedback you got and what you changed. Submit and wait for Google to review.",
    details: [
      "List the feedback you received",
      "Explain what you improved",
      "Use real numbers where you can",
      "Submit and wait for approval",
    ],
  },
];

const gradients = [
  "from-blue-500 via-blue-400 to-sky-500",
  "from-violet-500 via-violet-400 to-fuchsia-500",
  "from-emerald-500 via-emerald-400 to-teal-500",
  "from-amber-500 via-amber-400 to-orange-500",
];

const glows = [
  "shadow-blue-500/35",
  "shadow-violet-500/35",
  "shadow-emerald-500/35",
  "shadow-amber-500/35",
];

const numberBadges = [
  "text-blue-500 bg-blue-500/10 ring-blue-500/20",
  "text-violet-500 bg-violet-500/10 ring-violet-500/20",
  "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20",
  "text-amber-500 bg-amber-500/10 ring-amber-500/20",
];

/* ── Animation Variants ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 280, damping: 18 } },
};

const staggerItem = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function isDesktopBreakpoint() {
  if (typeof window === "undefined") return true;
  return window.innerWidth >= 768;
}

/* ── Main Component ── */
export function GuideProcessSteps() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  // Separate ref arrays for desktop and mobile step containers
  const desktopStepRefs = useRef<(HTMLDivElement | null)[]>(new Array(steps.length).fill(null));
  const mobileStepRefs = useRef<(HTMLDivElement | null)[]>(new Array(steps.length).fill(null));
  const desktopLeftItems = useRef<(HTMLDivElement | null)[]>(new Array(steps.length).fill(null));
  const dotEl = useRef<HTMLDivElement>(null);
  const glowEl = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const rafId = useRef<number>(0);

  /* ── Scroll-based active step detection ── */
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const desktop = isDesktopBreakpoint();
      const refs = desktop ? desktopStepRefs.current : mobileStepRefs.current;

      let bestIndex = 0;
      let bestDist = Infinity;

      for (let i = 0; i < refs.length; i++) {
        const el = refs[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Skip display:none elements (zero dimensions)
        if (rect.width === 0 && rect.height === 0) continue;
        // Skip elements far off-screen
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;

        const center = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }

      setActiveStep(bestIndex);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId.current = requestAnimationFrame(update);
      }
    };

    const onResize = () => {
      // Re-evaluate on resize since breakpoint may have changed
      if (!ticking) {
        ticking = true;
        rafId.current = requestAnimationFrame(update);
      }
    };

    // Initial calculation
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  /* ── Desktop dot positioning ── */
  useEffect(() => {
    const item = desktopLeftItems.current[activeStep];
    if (!item || !dotEl.current || !glowEl.current) return;
    // Only run on desktop
    if (!isDesktopBreakpoint()) return;

    const parentRect = item.parentElement?.getBoundingClientRect();
    if (!parentRect) return;
    const itemRect = item.getBoundingClientRect();
    const centerY = itemRect.top + itemRect.height / 2 - parentRect.top;

    dotEl.current.style.transform = `translate(-50%, ${centerY - 8}px)`;
    glowEl.current.style.transform = `translate(-50%, ${centerY - 16}px)`;
  }, [activeStep]);

  return (
    <section id="how-to-meet">
      {/* ═════ HEADER ═════ */}
      <div ref={headerRef} className="container mx-auto px-4 md:px-6 pt-16 md:pt-24 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2"
        >
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Step by Step</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
        >
          How to Meet the
          <br className="hidden sm:block" />
          Requirement
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="text-muted-foreground max-w-xl text-sm md:text-base"
        >
          Follow these 4 steps. They work for any Android app.
        </motion.p>

      </div>

      {/* ═════ BODY ═════ */}
      <div className="mx-auto max-w-5xl px-4 md:px-6 pb-24 mt-6 md:mt-10">
        <div className="flex relative">

          {/* ═════ Desktop Left Column ═════ */}
          <div className="hidden md:block w-[36%] sticky top-24 self-start pt-8 pb-32">
            <div className="relative">
              {/* Vertical rail with dot */}
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent">
                <div
                  ref={dotEl}
                  className="absolute left-1/2 w-4 h-4 rounded-full bg-background border-[2.5px] border-primary shadow-lg shadow-primary/40 flex items-center justify-center transition-transform duration-500 ease-out"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <div
                  ref={glowEl}
                  className="absolute left-1/2 w-8 h-8 rounded-full bg-primary/15 blur-md -z-10 transition-transform duration-500 ease-out"
                />
              </div>

              {steps.map((s, i) => {
                const isActive = i === activeStep;
                return (
                  <div
                    key={i}
                    ref={(el) => { desktopLeftItems.current[i] = el; }}
                    className="py-8 pr-12 text-right transition-all duration-500"
                  >
                    <motion.span
                      className={`text-[11px] font-bold tracking-wider uppercase inline-block mb-1.5 px-2.5 py-0.5 rounded-full ring-1 transition-colors duration-500 ${
                        isActive ? numberBadges[i] : "text-muted-foreground/40 ring-transparent bg-transparent"
                      }`}
                      animate={{ scale: isActive ? 1.06 : 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      Step {s.num}
                    </motion.span>
                    <motion.h3
                      className={`text-base lg:text-lg mt-1 leading-snug transition-colors duration-500 ${
                        isActive ? "font-bold text-foreground" : "font-normal text-muted-foreground/50"
                      }`}
                      animate={{ x: isActive ? -4 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {s.title}
                    </motion.h3>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═════ Mobile Content ═════ */}
          <div className="flex md:hidden w-full">
            {/* Left rail — sticky so the number indicator stays in viewport */}
            <div className="sticky top-24 self-start w-10 shrink-0 flex flex-col items-center">
              {/* Vertical line behind everything */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-border/40" />

              {/* Past step checkmarks */}
              {steps.map((s, i) => {
                if (i >= activeStep) return null;
                return (
                  <div key={`past-${i}`} className="relative z-10 mb-3">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20, delay: i * 0.05 }}
                      className="w-5 h-5 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center justify-center"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </motion.div>
                    {/* Connector below checkmark */}
                    <div className="w-px h-3 bg-primary/30 mx-auto" />
                  </div>
                );
              })}

              {/* Active step number — the animated swapping indicator */}
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ y: 24, opacity: 0, scale: 0.85 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -24, opacity: 0, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradients[activeStep]} flex items-center justify-center text-white text-xs font-bold shadow-lg ${glows[activeStep]}`}
                  >
                    {steps[activeStep].num}
                  </motion.div>
                </AnimatePresence>
                {/* Glow ring behind the number */}
                <div className={`absolute inset-0 -m-1.5 rounded-full bg-gradient-to-br ${gradients[activeStep]} opacity-20 blur-md pointer-events-none`} />
              </div>

              {/* Future step circles */}
              {steps.map((s, i) => {
                if (i <= activeStep) return null;
                return (
                  <div key={`future-${i}`} className="relative z-10 mt-3">
                    <div className="w-px h-3 bg-border/40 mx-auto" />
                    <div className="w-4 h-4 rounded-full bg-muted border border-border mt-1.5" />
                  </div>
                );
              })}
            </div>

            {/* Right: scrollable cards */}
            <div className="flex-1 min-w-0 pl-3">
              <div className="flex flex-col gap-4">
                {steps.map((s, i) => {
                  const isActive = i === activeStep;
                  const Icon = s.icon;
                  return (
                    <div
                      key={i}
                      ref={(el) => { mobileStepRefs.current[i] = el; }}
                    >
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-40px" }}
                        variants={cardReveal}
                        className={`relative p-5 rounded-2xl border overflow-hidden transition-all duration-300 ${
                          isActive ? "bg-card border-border shadow-sm" : "bg-card/50 border-border/50"
                        }`}
                      >
                        <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${gradients[i]} opacity-[0.05] rounded-full blur-2xl pointer-events-none`} />

                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            <motion.div
                              variants={scaleIn}
                              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center shadow-md ${glows[i]} shrink-0`}
                            >
                              <Icon className="w-5 h-5 text-white" />
                            </motion.div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-base leading-snug">{s.title}</h3>
                            </div>
                          </div>

                          <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</motion.p>

                          <motion.ul variants={containerVariants} className="space-y-2">
                            {s.details.map((d, j) => (
                              <motion.li key={j} variants={staggerItem} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                </span>
                                <span>{d}</span>
                              </motion.li>
                            ))}
                          </motion.ul>

                          {i === 1 && (
                            <motion.div variants={fadeUp} className="mt-5">
                              <DeviceMockup />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═════ Desktop Right Column ═════ */}
          <div className="hidden md:block w-[64%] pl-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  ref={(el) => { desktopStepRefs.current[i] = el; }}
                  className="min-h-screen flex items-center py-10"
                >
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-100px" }}
                    variants={containerVariants}
                    className="max-w-lg"
                  >
                    <motion.div
                      variants={scaleIn}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center mb-6 shadow-xl ${glows[i]}`}
                    >
                      <Icon className="w-7 h-7 md:w-9 md:h-9 text-white drop-shadow-sm" />
                    </motion.div>

                    <motion.h3 variants={fadeUp} className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">{s.title}</motion.h3>

                    <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-5 max-w-md text-sm md:text-base">{s.desc}</motion.p>

                    <motion.ul variants={containerVariants} className="space-y-2.5 mb-6">
                      {s.details.map((d, j) => (
                        <motion.li key={j} variants={staggerItem} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-primary" />
                          </span>
                          <span>{d}</span>
                        </motion.li>
                      ))}
                    </motion.ul>

                    {i === 1 && (
                      <motion.div variants={fadeUp}>
                        <DeviceMockup />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
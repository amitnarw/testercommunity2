"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPublicStats } from "@/lib/apiCalls";
import { resolveIcon } from "@/lib/lucideIconCatalog";

const AnimatedCounter = ({
  to,
  suffix = "",
  prefix = "",
  displayValue,
}: {
  to?: number;
  suffix?: string;
  prefix?: string;
  displayValue?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const match = displayValue?.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseInt(match[1], 10) : (to ?? 0);
  const trailing = match ? match[2] : suffix;
  const isPlainText = displayValue !== undefined && !match;

  useEffect(() => {
    if (isInView) {
      let frame = 0;
      const totalFrames = 100;
      const from = 0;
      let rafId: number;

      const animate = () => {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        const current = Math.round(from + (target - from) * progress);
        setCount(current);

        if (frame < totalFrames) {
          rafId = requestAnimationFrame(animate);
        }
      };

      rafId = requestAnimationFrame(animate);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {isPlainText
        ? displayValue
        : `${count.toLocaleString()}${trailing}`}
    </span>
  );
};

interface StatCardProps extends HTMLMotionProps<"div"> {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const StatCard = ({
  icon,
  title,
  children,
  className,
  ...props
}: StatCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={cn(
        "rounded-2xl p-3 sm:p-4 shadow-lg relative overflow-hidden",
        "flex flex-col text-foreground bg-card",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 mb-2 z-10">
        {icon && (
          <div className="flex-shrink-0 absolute sm:static scale-[1.5] sm:scale-100 top-0 right-0 rotate-12 sm:rotate-0 opacity-10 sm:opacity-100 bg-inherit p-4 sm:p-0 rounded-full">
            {icon}
          </div>
        )}
        <h3 className="font-bold text-[10px] sm:text-sm leading-tight line-clamp-1">
          {title}
        </h3>
      </div>
      <div className="flex-grow flex flex-col justify-center z-10">
        {children}
      </div>
    </motion.div>
  );
};

 interface LandingStatCard {
   id: string;
   iconName: string;
   title: string;
   description: string;
   value: string;
   className?: string;
   descriptionClassName: string;
 }

  const LANDING_STAT_CARDS: LandingStatCard[] = [
   { id: "countriesSupported", iconName: "Globe", title: "Countries Supported", description: "Developers and testers worldwide.", value: "10+", className: "col-span-2 lg:col-span-2 bg-gradient-to-br from-primary to-primary/50 text-primary-foreground", descriptionClassName: "text-primary-foreground/80 mt-1 text-xs" },
   { id: "bugsFound", iconName: "Bug", title: "Bugs Squashed", description: "Critical & minor bugs found.", value: "554+", className: undefined, descriptionClassName: "text-muted-foreground mt-1 text-[10px]" },
   { id: "proAppsTested", iconName: "Rocket", title: "Pro Apps Tested", description: "Paid apps fully tested.", value: "4200+", className: "bg-gradient-to-br from-primary to-primary/50 text-primary-foreground", descriptionClassName: "text-primary-foreground/80 mt-1 text-[10px]" },
   { id: "platformUptime", iconName: "Shield", title: "Platform Uptime", description: "Reliable platform availability.", value: "99%", className: undefined, descriptionClassName: "text-muted-foreground mt-1 text-[10px]" },
   { id: "uniqueDevices", iconName: "Smartphone", title: "Unique Devices", description: "Diverse Android models.", value: "350+", className: undefined, descriptionClassName: "text-muted-foreground mt-1 text-[10px]" },
   { id: "fastTurnaround", iconName: "Clock", title: "Fast Turnaround", description: "Average testing turnaround time.", value: "48hr", className: "col-span-2 lg:col-span-2 bg-gradient-to-br from-primary to-primary/50 text-primary-foreground", descriptionClassName: "text-primary-foreground/80 mt-1 text-xs" },
 ];

export function GlobalImpactSection() {
  const sectionRef = useRef(null);
   const [stats, setStats] = useState<{
     countriesSupported?: number;
     bugsFound?: number;
     proAppsTested?: number;
     platformUptime?: number;
     uniqueDevices?: number;
     fastTurnaround?: number;
     landingHeading?: string;
     landingSubheading?: string;
     landingStatTitles?: Array<{ id: string; title: string }>;
     landingStatDescriptions?: Array<{ id: string; description: string }>;
      landingStatValues?: Array<{ id: string; value: string }>;
      landingStatIcons?: Array<{ id: string; icon: string }>;
   } | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    getPublicStats().then(setStats);
  }, []);

   const landingHeading =
     (stats?.landingHeading?.trim() || "") ||
     "The No.1 Google Play Testing Service";
   const landingSubheading =
     (stats?.landingSubheading?.trim() || "") ||
     "inTesters is the Most Trusted and Reliable Google Play Closed Testing Service, loved by more than 1000+ Developers across 180+ countries.";

    const resolvedCards = LANDING_STAT_CARDS.map((card) => {
      const t = stats?.landingStatTitles?.find((x) => x.id === card.id);
      const d = stats?.landingStatDescriptions?.find((x) => x.id === card.id);
      const v = stats?.landingStatValues?.find((x) => x.id === card.id);
      const ic = stats?.landingStatIcons?.find((x) => x.id === card.id);
      const value =
        typeof v?.value === "string" && v.value.trim() !== ""
          ? v.value
          : card.value;
      const title =
        typeof t?.title === "string" && t.title.trim() !== "" ? t.title : card.title;
      const description =
        typeof d?.description === "string" && d.description.trim() !== ""
          ? d.description
          : card.description;
      const iconName =
        typeof ic?.icon === "string" && ic.icon.trim() !== ""
          ? ic.icon
          : card.iconName;
      return { ...card, title, description, value, iconName };
    });

  return (
    <section
      data-loc="GlobalImpactSection"
      ref={sectionRef}
      className="py-12 md:py-32 bg-secondary/50 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-dot-pattern-dark opacity-30 z-0"></div>

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 md:w-[600px] md:h-[600px] w-[300px] h-[300px]"
        style={{ rotate }}
      >
        <Globe className="w-full h-full text-primary/10" strokeWidth={0.5} />
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center justify-center lg:w-[80%] lg:mx-auto">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mt-4">
              {landingHeading}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              {landingSubheading}
            </p>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full max-w-6xl">
          {resolvedCards.map((card) => {
            const Icon = resolveIcon(card.iconName);
            return (
              <StatCard
                key={card.id}
                title={card.title}
                icon={<Icon className="w-4 h-4" />}
                className={card.className}
              >
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <p className="text-2xl sm:text-3xl font-bold">
                    <AnimatedCounter displayValue={card.value} />
                  </p>
                  <p className={card.descriptionClassName}>
                    {card.description}
                  </p>
                </div>
              </StatCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

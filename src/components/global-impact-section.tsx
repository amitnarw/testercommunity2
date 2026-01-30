"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import {
  Globe,
  Users,
  Bug,
  Smartphone,
  TrendingUp,
  ShieldCheck,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AnimatedCounter = ({
  to,
  suffix = "",
  prefix = "",
}: {
  to: number;
  suffix?: string;
  prefix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      let frame = 0;
      const totalFrames = 100;
      const from = 0;
      let rafId: number;

      const animate = () => {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        const current = Math.round(from + (to - from) * progress);
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
  }, [isInView, to]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
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

export function GlobalImpactSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section
      data-loc="GlobalImpactSection"
      ref={sectionRef}
      className="py-20 md:py-32 bg-secondary/50 relative overflow-hidden"
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
            From Local{" "}
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              ₹699
            </span>{" "}
            to Global Ripples
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Our platform empowers developers and testers worldwide, creating a
            virtuous cycle of quality and innovation. Here's a look at our
            collective impact.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full max-w-6xl">
          <StatCard
            title="Thriving Community"
            icon={<Users className="w-4 h-4" />}
            className="col-span-2 lg:col-span-2 bg-gradient-to-br from-primary to-primary/50 text-primary-foreground"
          >
            <div className="relative z-10 h-full flex flex-col justify-center">
              <p className="text-2xl sm:text-3xl font-bold">
                <AnimatedCounter to={100} suffix="+" />
              </p>
              <p className="text-primary-foreground/80 mt-1 text-xs">
                Vetted testers across 12+ countries.
              </p>
            </div>
          </StatCard>
          <StatCard title="Bugs Squashed" icon={<Bug className="w-4 h-4" />}>
            <p className="text-2xl sm:text-3xl font-bold">
              <AnimatedCounter to={554} suffix="+" />
            </p>
            <p className="text-muted-foreground mt-1 text-[10px]">
              Critical & minor bugs found.
            </p>
          </StatCard>
          <StatCard
            title="Projects Accelerated"
            icon={<TrendingUp className="w-4 h-4" />}
            className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground"
          >
            <p className="text-2xl sm:text-3xl font-bold">
              <AnimatedCounter to={24} suffix="+" />
            </p>
            <p className="text-primary-foreground/80 mt-1 text-[10px]">
              Apps & features launched.
            </p>
          </StatCard>
          <StatCard
            title="Security First"
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            <p className="text-2xl sm:text-3xl font-bold">
              <AnimatedCounter to={19} suffix="+" />
            </p>
            <p className="text-muted-foreground mt-1 text-[10px]">
              Critical vulnerabilities found.
            </p>
          </StatCard>
          <StatCard
            title="Unique Devices"
            icon={<Smartphone className="w-4 h-4" />}
          >
            <p className="text-2xl sm:text-3xl font-bold">
              <AnimatedCounter to={350} suffix="+" />
            </p>
            <p className="text-muted-foreground mt-1 text-[10px]">
              Diverse Android models.
            </p>
          </StatCard>
          <StatCard
            title="Community Points"
            icon={<Coins className="w-4 h-4" />}
            className="col-span-2 lg:col-span-2 bg-gradient-to-br from-primary to-primary/50 text-primary-foreground"
          >
            <p className="text-2xl sm:text-3xl font-bold">
              <AnimatedCounter to={25000} suffix="+" />
            </p>
            <p className="text-primary-foreground/80 mt-1 text-xs">
              Points earned by community.
            </p>
          </StatCard>
        </div>
      </div>
    </section>
  );
}

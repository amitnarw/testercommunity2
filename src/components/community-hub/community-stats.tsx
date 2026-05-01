"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Globe, Coins, Users, Layout, CheckCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const AnimatedCounter = ({
  to,
  suffix = "",
  prefix = "",
  duration = 100,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      let frame = 0;
      const totalFrames = duration;
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
      return () => cancelAnimationFrame(rafId);
    }
  }, [isInView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  colSpan?: "single" | "double";
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  className,
  colSpan = "single",
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
        "rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden flex flex-col",
        "bg-card border border-border/50",
        colSpan === "double" ? "col-span-2 lg:col-span-2" : "",
        className,
      )}
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            {value}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
            {description}
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      <div className="absolute top-0 right-0 opacity-5 sm:opacity-10 rotate-12 translate-x-4 -translate-y-2">
        <div className="w-20 h-20">{icon}</div>
      </div>
    </motion.div>
  );
};

export function CommunityStats() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const stats = [
    {
      title: "Active Testers",
      value: <AnimatedCounter to={500} suffix="+" />,
      description: "Community testers worldwide",
      icon: <Users className="w-5 h-5" />,
      colSpan: "double" as const,
      className: "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground",
    },
    {
      title: "Points Earned",
      value: <AnimatedCounter to={45000} suffix="+" />,
      description: "Earned by the community",
      icon: <Coins className="w-5 h-5" />,
    },
    {
      title: "Apps Tested",
      value: <AnimatedCounter to={250} suffix="+" />,
      description: "Free apps submitted",
      icon: <Layout className="w-5 h-5" />,
    },
    {
      title: "Countries",
      value: <AnimatedCounter to={15} suffix="+" />,
      description: "Represented globally",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Average Rating",
      value: <AnimatedCounter to={47} suffix="/50" />,
      description: "Feedback quality score",
      icon: <CheckCircle className="w-5 h-5" />,
      colSpan: "double" as const,
      className: "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground",
    },
  ];

  return (
    <section
      data-loc="CommunityStats"
      ref={sectionRef}
      className="py-16 md:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.15] z-0" />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px]"
        style={{ rotate }}
      >
        <Globe className="w-full h-full text-primary/[0.08]" strokeWidth={0.5} />
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight font-heading">
            Community{" "}
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            A growing community of testers and developers creating a virtuous
            cycle of quality and innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(stat.colSpan === "double" ? "col-span-2" : "")}
            >
              <StatCard
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                className={stat.className}
                colSpan={stat.colSpan}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  Bug,
  Rocket,
  Layout,
  Smartphone,
  Coins,
} from "lucide-react";

const AnimatedCounter = ({
  to,
  suffix = "",
}: {
  to: number;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  return (
    <span ref={ref}>
      {isInView ? (
        <CountUp to={to} suffix={suffix} />
      ) : (
        "0"
      )}
    </span>
  );
};

const CountUp = ({ to, suffix }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref}>
      {isInView ? `${to.toLocaleString()}${suffix}` : "0"}
    </span>
  );
};

const statItems = [
  {
    title: "Vetted Testers",
    value: 100,
    suffix: "+",
    label: "Across 12+ countries",
    icon: <Users className="w-4 h-4" />,
    accent: "from-primary to-primary/50",
    span: "col-span-2",
    textColor: "text-primary-foreground",
    labelColor: "text-primary-foreground/80",
  },
  {
    title: "Bugs Found",
    value: 554,
    suffix: "+",
    label: "Critical & minor bugs",
    icon: <Bug className="w-4 h-4" />,
    accent: "border-l-primary",
    span: "",
    textColor: "text-foreground",
    labelColor: "text-muted-foreground",
  },
  {
    title: "Pro Apps Tested",
    value: 55,
    suffix: "+",
    label: "Paid apps fully tested",
    icon: <Rocket className="w-4 h-4" />,
    accent: "border-l-accent",
    span: "",
    textColor: "text-foreground",
    labelColor: "text-muted-foreground",
  },
  {
    title: "Community Apps",
    value: 106,
    suffix: "+",
    label: "Submitted by users",
    icon: <Layout className="w-4 h-4" />,
    accent: "border-l-primary",
    span: "",
    textColor: "text-foreground",
    labelColor: "text-muted-foreground",
  },
  {
    title: "Unique Devices",
    value: 350,
    suffix: "+",
    label: "Diverse Android models",
    icon: <Smartphone className="w-4 h-4" />,
    accent: "border-l-accent",
    span: "",
    textColor: "text-foreground",
    labelColor: "text-muted-foreground",
  },
  {
    title: "Community Points",
    value: 25000,
    suffix: "+",
    label: "Earned by the community",
    icon: <Coins className="w-4 h-4" />,
    accent: "from-primary to-primary/50",
    span: "col-span-2",
    textColor: "text-primary-foreground",
    labelColor: "text-primary-foreground/80",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Trusted by{" "}
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              real developers
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Here&apos;s what the inTesters community has achieved so far.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
          {statItems.map((stat, i) => (
            <StatCard
              key={stat.title}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              accent={stat.accent}
              span={stat.span}
              textColor={stat.textColor}
              labelColor={stat.labelColor}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  title,
  value,
  suffix,
  label,
  accent,
  span,
  textColor,
  labelColor,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  suffix: string;
  label: string;
  accent: string;
  span: string;
  textColor: string;
  labelColor: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const isPrimary = accent.startsWith("from-");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`rounded-2xl p-4 md:p-5 shadow-lg relative overflow-hidden flex flex-col ${span} ${
        isPrimary
          ? `bg-gradient-to-br ${accent} text-primary-foreground`
          : "bg-card text-foreground"
      }`}
    >
      {(accent.startsWith("border-l-") || accent.startsWith("border")) && (
        <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full ${accent} opacity-50`} />
      )}
      <div className="flex items-center gap-2 mb-3 z-10">
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
            isPrimary ? "bg-white/10" : "bg-primary/10"
          }`}
        >
          <div className={isPrimary ? "text-white" : "text-primary"}>
            {icon}
          </div>
        </div>
        <h3 className="font-bold text-xs leading-tight">{title}</h3>
      </div>
      <div className="flex-grow flex flex-col justify-center z-10">
        <p className={`text-2xl md:text-3xl font-bold ${textColor}`}>
          <AnimatedCounter to={value} suffix={suffix} />
        </p>
        <p className={`mt-0.5 text-xs ${labelColor}`}>{label}</p>
      </div>
    </motion.div>
  );
}

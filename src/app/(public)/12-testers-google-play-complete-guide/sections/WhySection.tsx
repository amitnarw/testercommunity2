"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const reasons = [
  {
    num: "01",
    title: "Stop Spam Apps",
    desc: "Before this rule, anyone could upload anything. Bots and fake accounts flooded the Play Store. Real testers make spam harder to pull off.",
    rotate: "-1deg",
    color: "text-blue-500",
    bg: "from-blue-500/15 to-blue-500/5",
    border: "border-blue-500/10",
  },
  {
    num: "02",
    title: "Test on Real Devices",
    desc: "Android runs on thousands of different phones. An app that works on one might crash on another. Real testers catch these problems early.",
    rotate: "0deg",
    color: "text-violet-500",
    bg: "from-violet-500/15 to-violet-500/5",
    border: "border-violet-500/10",
  },
  {
    num: "03",
    title: "Force Quality Checks",
    desc: "The 14-day rule makes sure developers actually care about quality. You have to gather feedback and fix things before you can ship.",
    rotate: "1deg",
    color: "text-emerald-500",
    bg: "from-emerald-500/15 to-emerald-500/5",
    border: "border-emerald-500/10",
  },
];

export function WhySection() {
  return (
    <section
      id="why-google-introduced"
      className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-4xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <span className="text-xs font-bold text-primary uppercase tracking-widest">
          Why It Exists
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
          Why Google Made This Rule
        </h2>
        <p className="text-muted-foreground mb-6">
          Google&apos;s goal is simple: stop bad apps from reaching the Play
          Store. Before this policy, anyone could upload with almost no
          checks. The result was a lot of low-quality and even harmful apps.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {reasons.map((reason, i) => (
          <motion.div
            key={reason.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className={`p-6 bg-card rounded-xl border ${reason.border} relative overflow-hidden group`}
            style={{ transform: reason.rotate }}
          >
            {/* Large background number */}
            <div
              className={`absolute -bottom-3 -right-3 text-7xl font-black ${reason.color} opacity-[0.06] select-none leading-none group-hover:opacity-[0.1] transition-opacity`}
            >
              {reason.num}
            </div>

            <div className="relative z-10">
              <h3 className="font-bold mb-2">{reason.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reason.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Keep section icon as subtle visual anchor */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex justify-center mt-10 text-muted-foreground/20"
      >
        <Shield className="w-8 h-8" />
      </motion.div>
    </section>
  );
}

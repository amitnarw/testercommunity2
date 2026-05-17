"use client";

import { motion } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import { Users, CalendarDays, Smartphone, Activity } from "lucide-react";

const requirements = [
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: "12+ Testers",
    desc: "You need at least 12 people to opt into your closed test. Aim for 15-20 so you do not lose the count if someone drops out.",
    gradient: "from-primary to-primary/60",
    shadow: "shadow-primary/25",
  },
  {
    icon: <CalendarDays className="w-6 h-6 text-white" />,
    title: "14 Days Straight",
    desc: "Your testers need to stay active for 14 days in a row. If you drop below 12 at any point, the clock resets.",
    gradient: "from-[hsl(var(--accent))] to-[hsl(var(--accent)/0.6)]",
    shadow: "shadow-accent/25",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-white" />,
    title: "Real Phones Only",
    desc: "Emulators do not count. Each tester needs a physical Android phone or tablet. No exceptions.",
    gradient: "from-emerald-500 to-emerald-500/60",
    shadow: "shadow-emerald-500/25",
  },
  {
    icon: <Activity className="w-6 h-6 text-white" />,
    title: "Active Use Required",
    desc: "Google checks engagement. Testers cannot just install and ignore. They need to open and use the app regularly.",
    gradient: "from-violet-500 to-violet-500/60",
    shadow: "shadow-violet-500/25",
  },
];

export function RequirementsSection() {
  return (
    <section
      id="what-is-it"
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
          The Basics
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
          What Google Actually Requires
        </h2>
        <p className="text-muted-foreground">
          In 2023, Google started requiring new personal developer accounts to
          run a closed test before they can publish. The rules were updated in
          late 2024. Here&apos;s what you need to know:
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-10">
        {requirements.map((req, i) => (
          <motion.div
            key={req.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <MagicCard
              gradientColor="hsl(var(--primary))"
              gradientOpacity={0.08}
              className="p-5 md:p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${req.gradient} flex items-center justify-center shadow-lg ${req.shadow}`}
                >
                  {req.icon}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold mb-1">{req.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {req.desc}
                  </p>
                </div>
              </div>
            </MagicCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 p-5 bg-primary/5 rounded-2xl border border-primary/10"
      >
        <p className="text-sm text-muted-foreground">
          <strong>Bottom line:</strong> Get 12 real people using your app on
          real phones for 14 days. Once that&apos;s done, Google unlocks the
          &ldquo;Apply for Production&rdquo; button in your Play Console.
        </p>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const mistakes = [
  {
    id: "01",
    title: "No updates during testing",
    desc: "Google wants to see you making changes. Upload on day 1, then push 2-3 small updates over the 14 days. It shows you are listening to feedback.",
  },
  {
    id: "02",
    title: "Inactive or fake testers",
    desc: "Google tracks how often testers open your app. If they install and never open it, they do not count. Emulators get flagged too. Use real people on real phones.",
  },
  {
    id: "03",
    title: "Vague questionnaire answers",
    desc: "After 14 days, Google asks what feedback you got and what you changed. Saying &ldquo;the app tested well&rdquo; will get you rejected. Be specific.",
  },
];

export function MistakesSection() {
  return (
    <section
      id="common-mistakes"
      className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-4xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-widest">
          <AlertTriangle className="w-3.5 h-3.5" />
          Don&apos;t Do This
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
          Common Mistakes That Delay Your Launch
        </h2>
        <p className="text-muted-foreground">
          These mistakes cause most failures. Avoid them and you&apos;ll save
          yourself a lot of time.
        </p>
      </motion.div>

      <div className="space-y-4 mt-10">
        {mistakes.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ x: 4 }}
            className="group relative p-5 md:p-6 bg-card rounded-2xl border border-amber-500/10 hover:border-amber-500/20 transition-colors overflow-hidden"
          >
            <div className="absolute -bottom-2 -right-2 text-6xl md:text-7xl font-bold text-amber-500/5 select-none leading-none">
              {m.id}
            </div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-lg group-hover:scale-110 transition-transform">
                {m.id}
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {m.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

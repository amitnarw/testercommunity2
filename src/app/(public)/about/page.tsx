"use client";

import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { MagicCard } from "@/components/ui/magic-card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Users, Rocket, Globe, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 relative w-full overflow-hidden flex flex-col items-center justify-center antialiased">
      <div className="absolute inset-0 z-0">
        <InteractiveGridPattern
          width={40}
          height={40}
          squares={[30, 30]}
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 opacity-50",
          )}
        />
      </div>

      <div className="container px-4 md:px-6 relative z-10 pt-20 pb-20">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6 font-sans">
              About Us
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
              We are{" "}
              <span className="text-primary font-semibold">
                GAMDIX PRIVATE LIMITED
              </span>
              , the driving force behind inTesters. Our mission is to bridge the
              gap between developers and flawless user experiences.
            </p>
          </motion.div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <MagicCard className="min-h-[300px] p-8 flex flex-col justify-center items-start gap-4 border-white/10 bg-neutral-900/50 backdrop-blur-sm">
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 mb-2">
                <Rocket className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              <p className="text-neutral-400 leading-relaxed">
                To empower developers worldwide by providing a robust,
                community-driven platform for comprehensive app testing,
                ensuring every release is bug-free and user-ready.
              </p>
            </MagicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <MagicCard className="min-h-[300px] p-8 flex flex-col justify-center items-start gap-4 border-white/10 bg-neutral-900/50 backdrop-blur-sm">
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-500 mb-2">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white">Our Vision</h2>
              <p className="text-neutral-400 leading-relaxed">
                To become the global standard for application quality assurance,
                fostering a collaborative ecosystem where testers and developers
                grow together.
              </p>
            </MagicCard>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
            Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Integrity",
                description:
                  "We believe in honest feedback and transparent processes.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Community",
                description:
                  "Our strength lies in our diverse network of testers.",
              },
              {
                icon: <Rocket className="w-6 h-6" />,
                title: "Innovation",
                description:
                  "Constantly evolving to meet modern development needs.",
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.4 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-white/5 bg-neutral-900/30 hover:bg-neutral-800/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center text-white mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-neutral-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Company Footer Info */}
        <div className="border-t border-white/10 pt-12 text-center">
          <p className="text-sm text-neutral-500 uppercase tracking-widest mb-2">
            Operated By
          </p>
          <h3 className="text-2xl font-bold text-white">
            GAMDIX PRIVATE LIMITED
          </h3>
        </div>
      </div>
    </div>
  );
}

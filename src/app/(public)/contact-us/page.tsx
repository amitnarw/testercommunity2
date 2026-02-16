"use client";

import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-background py-20 px-4">
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

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Have questions? We'd love to hear from you. Reach out to our team at
            GAMDIX PRIVATE LIMITED.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full p-8 md:p-10 flex flex-col gap-8 bg-card/50 backdrop-blur-xl border-primary/10 shadow-2xl">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-primary" />
                  Company Details
                </h2>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 transition-colors hover:bg-primary/10">
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
                      Registered Name
                    </p>
                    <p className="text-lg font-bold">GAMDIX PRIVATE LIMITED</p>
                  </div>

                  <div className="group flex gap-4 items-start p-4 rounded-xl bg-primary/5 border border-primary/10 transition-colors hover:bg-primary/10">
                    <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
                        Headquarters
                      </p>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        C/o Spring House Co-working Pvt Ltd,
                        <br />
                        B 1/639 A Janakpuri, Janakpuri B-1,
                        <br />
                        West Delhi, New Delhi, Delhi, India, 110058
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Email Us</span>
                  </div>
                  <a
                    href="mailto:contact@intesters.com"
                    className="text-lg md:text-xl font-bold text-primary hover:underline underline-offset-4 break-all"
                  >
                    contact@intesters.com
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Map/Visual Placeholder or Simple Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="h-full min-h-[400px] rounded-xl overflow-hidden relative border border-border shadow-2xl bg-neutral-900"
          >
            {/* Abstract Map visual representation */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,100,100,0.2)_0%,transparent_50%)]" />
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              ></div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Visit Our Office
              </h3>
              <p className="text-neutral-400 max-w-xs">
                Located in the heart of West Delhi, our doors are always open
                for a cup of coffee.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, CheckCircle } from "lucide-react";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-dot-pattern-dark opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 pt-12 lg:pt-20 max-w-5xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid md:grid-cols-5 gap-8 items-center"
        >
          {/* Left: Text content */}
          <div className="md:col-span-3">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Link
                  href="/"
                  className="hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <span>/</span>
                <span className="text-foreground">12 Testers Guide</span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-[1.1]"
            >
              Get
              <span className="text-primary italic ml-4">
                12 Testers.
              </span>
              <br />
              Publish Your App.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-lg"
            >
              Google Play now needs 12 testers for 14 days before you can
              publish. Here&apos;s exactly how to do it.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 mt-6 text-sm text-muted-foreground"
            >
              <span>Updated May 2026</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span>12 min read</span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/auth/register"
                className="group inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all gap-2 shadow-lg shadow-primary/20"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#what-is-it"
                className="inline-flex items-center px-6 py-3 bg-white/5 text-foreground rounded-full font-medium border border-white/10 hover:bg-white/10 transition-colors"
              >
                Keep Reading
              </Link>
            </motion.div>
          </div>

          {/* Right: Floating tilt card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 hidden md:block"
          >
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              whileHover={{ rotate: -1, y: -4 }}
              className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-background border border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-sm"
            >
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                Live
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    12 Testers Enrolled
                  </p>
                  <p className="text-xs text-muted-foreground">
                    in under 24 hours
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  "Submit your app",
                  "Get 12 real testers",
                  "Complete 14-day cycle",
                  "Publish to Google Play",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Table of Contents */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 md:mt-16 mb-8 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <h2 className="font-bold text-lg mb-4 text-foreground">
            On this page
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { href: "#what-is-it", label: "12-Tester Requirement" },
              { href: "#why-google-introduced", label: "Why Google Did This" },
              { href: "#how-to-meet", label: "Step by Step Guide" },
              { href: "#common-mistakes", label: "Don't Do This" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.nav>
      </div>
    </section>
  );
}

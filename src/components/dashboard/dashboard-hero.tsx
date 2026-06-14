"use client";

import { format } from "date-fns";
import { Activity, Bell, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { MiniSparkline } from "@/components/dashboard/mini-sparkline";

interface DashboardHeroProps {
  greeting: string;
  userName: string;
  totalActive: number;
  totalUnread: number;
}

export function DashboardHero({
  greeting,
  userName,
  totalActive,
  totalUnread,
}: DashboardHeroProps) {
  return (
    <section className="my-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-border/30 bg-gradient-to-br from-background via-card/50 to-background p-3 md:p-6 shadow-2xl shadow-black/10"
      >

        <div className="mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset] pb-2">
            Dashboard
          </h1>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {format(new Date(), "EEEE, MMMM d")}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mt-2">
              {greeting}, {userName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4 text-primary" />
                <span>
                  <strong className="text-foreground">{totalActive}</strong>{" "}
                  active app{totalActive !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bell className="w-4 h-4 text-primary" />
                <span>
                  <strong className="text-foreground">{totalUnread}</strong>{" "}
                  unread
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-72 lg:w-80 h-20 md:h-32 flex flex-col">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-2">
              7-day activity
            </p>
            <div
              className="flex-1 min-h-0 px-1 pb-1"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              }}
            >
              <MiniSparkline className="w-full h-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

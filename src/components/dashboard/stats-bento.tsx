"use client";

import { motion } from "framer-motion";
import { StatLabel } from "@/components/ui/stat-label";

export function StatsBento({ summary }: { summary: any }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="mb-8"
    >
      <div className="rounded-[2.5rem] flex flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Metrics</h2>
          <p className="text-xs text-muted-foreground mt-1">Platform metrics overview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Left: Packages & Points (Wide Slider Block) */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-card dark:via-card/50 dark:to-card rounded-[2rem] flex flex-col justify-between overflow-hidden h-full border border-slate-200/60 dark:border-border/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 relative">
              
              <div className="p-6 flex flex-col h-full relative z-20 pointer-events-none">
                <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-2 z-10">
                  <StatLabel>Wallet Balance</StatLabel>
                  <div className="flex items-center gap-2 bg-white dark:bg-background border border-slate-100 dark:border-border/50 px-3 py-1 rounded-full shadow-xs">
                    <div className="flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-foreground uppercase">Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-center z-10 mt-6 md:mt-0">
                  <div className="flex items-end justify-between w-full">
                    
                    <div className="flex flex-col">
                      <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-foreground tracking-tight">
                        <span>{summary.packagesBalance}</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-400 dark:text-muted-foreground mt-1">Packages</span>
                    </div>
                    
                    <div className="flex-1 mx-4 sm:mx-8 mb-4 flex flex-col items-center">
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-muted rounded-full relative overflow-visible">
                        <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-slate-300 dark:from-muted-foreground to-primary rounded-full" style={{ width: '100%', opacity: 0.3 }}></div>
                        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-background border-2 border-slate-300 dark:border-muted-foreground rounded-full shadow-xs" style={{ left: '0%' }}></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-background border-2 border-primary rounded-full shadow-xs" style={{ right: '0%' }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-foreground tracking-tight">
                        <span>{summary.pointsBalance}</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-400 dark:text-muted-foreground mt-1 text-right">Points</span>
                    </div>
                    
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Middle: Active Apps (Small) */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-card dark:via-card/50 dark:to-card rounded-[2rem] flex flex-col justify-between overflow-hidden h-full border border-slate-200/60 dark:border-border/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300 relative group">
              
              <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 transform rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              </div>
              
              <div className="p-6 flex flex-col h-full justify-between z-10 relative">
                <div className="flex items-center justify-between">
                  <StatLabel>Active Tests</StatLabel>
                  <div className="bg-slate-100 dark:bg-muted p-1.5 rounded-lg text-slate-400 dark:text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                </div>
                
                <div className="pb-0 pt-8 flex items-end justify-between">
                  <div>
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-foreground tracking-tight">
                      <span>{summary.totalActive}</span>
                    </span>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-500/20">
                    {summary.proActiveCount} Pro
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: In Review (Small) */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-card dark:via-card/50 dark:to-card rounded-[2rem] flex flex-col justify-between overflow-hidden h-full border border-slate-200/60 dark:border-border/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300 relative group">
              
              <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 transform rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                  <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"></path>
                </svg>
              </div>
              
              <div className="p-6 flex flex-col h-full justify-between z-10 relative">
                <div className="flex items-center justify-between">
                  <StatLabel>In Review</StatLabel>
                  <div className="bg-slate-100 dark:bg-muted p-1.5 rounded-lg text-slate-400 dark:text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                </div>
                
                <div className="pb-0 pt-8 flex items-end justify-between">
                  <div>
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-foreground tracking-tight">
                      <span>{summary.totalInReview}</span>
                    </span>
                  </div>
                  <div className="bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-amber-500/20">
                    Pending
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}

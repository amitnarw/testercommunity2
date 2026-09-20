"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Crown,
  FileText,
  Handshake as HandshakeIcon,
  LineChart,
  Rocket,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { TransitionLink } from "@/components/transition-link";
import { ROUTES } from "@/lib/routes";
import { Skeleton } from "@/components/ui/skeleton";
import type { HubSubmittedAppResponse } from "@/lib/types";

const pills = [
  { icon: Briefcase, title: "15-20 Professional Testers" },
  { icon: CalendarDays, title: "15-20 Days Testing Period" },
  { icon: UserCheck, title: "Dedicated Testing Manager for Your App" },
  { icon: LineChart, title: "Live Dashboard to Track Progress" },
  {
    icon: BadgeCheck,
    title: "Real Human Testers Certified by Google Play Academy",
  },
  { icon: FileText, title: "Google Play Production Access Answers Provided" },
  { icon: ShieldCheck, title: "Guaranteed Production Approval" },
  { icon: CheckCircle2, title: "End-to-End Managed Testing" },
];

const handshakeFeatures: Array<{ lead: string; rest: string; bold: boolean }> =
  [
    { lead: "Test with real users", rest: "(manual handshake)", bold: false },
    { lead: "16-day testing period", rest: "", bold: false },
    { lead: "Daily screenshot proof", rest: "(mandatory)", bold: false },
    { lead: "Trusted community & admin review", rest: "", bold: false },
    { lead: "Basic XP & 15-level progression", rest: "", bold: false },
  ];

const proFeatures: Array<{ lead: string; rest: string; bold: boolean }> = [
  { lead: "15\u201320 vetted testers", rest: "per application", bold: true },
  { lead: "15\u201320 day", rest: "managed testing cycle", bold: true },
  { lead: "Detailed bug reports", rest: "& feedback", bold: true },
  { lead: "Device + Android version coverage", rest: "", bold: false },
  {
    lead: "Google Play policy compliance verification",
    rest: "",
    bold: false,
  },
  {
    lead: "Google Play Production Questionnaire",
    rest: "assistance",
    bold: false,
  },
  { lead: "Dedicated testing manager", rest: "for every app", bold: true },
];

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function DiaryTestingSection({
  proApps,
  proLoading,
  proCount,
  freeApps,
  freeLoading,
  freeCount,
}: {
  proApps: HubSubmittedAppResponse[] | undefined;
  proLoading: boolean;
  proCount: number;
  freeApps: HubSubmittedAppResponse[] | undefined;
  freeLoading: boolean;
  freeCount: number;
}) {
  return (
    <section className="mb-20">
      <div className="relative rounded-[2.5rem] flex flex-col md:flex-row gap-4 items-stretch justify-center overflow-visible">
        {/* Left Card: Handshake Testing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex-1 relative"
        >
          <div className="relative h-full rounded-[32px] p-5 md:p-6 flex flex-col overflow-hidden bg-gradient-to-br from-emerald-500/15 via-emerald-500/[0.06] to-card shadow-xl shadow-emerald-500/10">
            {/* Decorative glow orbs */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-28 -left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              {freeLoading ? (
                <LoadingCards />
              ) : freeApps && freeApps.length > 0 ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-[1.1] tracking-tight mb-6">
                    <span className="text-foreground">Handshake </span>
                    <span className="text-emerald-500">Testing</span>
                  </h2>
                  <div className="space-y-3">
                    {freeApps.slice(0, 3).map((app, i) => (
                      <HandshakeActiveCard key={app.id} app={app} index={i} />
                    ))}
                  </div>
                </>
              ) : (
                <HandshakeEmptyCard />
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Card: Pro Testing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
          className="flex-1 relative"
        >
          <div className="relative h-full rounded-[32px] p-5 md:p-6 flex flex-col overflow-hidden bg-gradient-to-br from-primary/15 via-primary/[0.06] to-card shadow-xl shadow-primary/10">
            {/* Decorative glow orbs + crown watermark + dot texture */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-28 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />
            <Crown className="absolute -bottom-8 -right-6 w-48 h-48 text-primary/[0.05] rotate-12 pointer-events-none" />
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.12] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              {proLoading ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-[1.1] tracking-tight mb-6">
                    <span className="text-foreground">Pro </span>
                    <span className="text-primary">Testing</span>
                  </h2>
                  <LoadingCards />
                </>
              ) : proApps && proApps.length > 0 ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-[1.1] tracking-tight mb-6">
                    <span className="text-foreground">Pro </span>
                    <span className="text-primary">Testing</span>
                  </h2>
                  <div className="space-y-3">
                    {proApps.slice(0, 3).map((app, i) => (
                      <HandshakeActiveCard key={app.id} app={app} index={i} />
                    ))}
                  </div>
                </>
              ) : (
                <ProEmptyCard />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="mt-8"
      >
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
          Pro Testing Features
        </h2>

        <div
          className="relative w-full overflow-hidden rounded-2xl py-1.5
          [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]
          [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
        >
          <div className="group flex gap-2 [--gap:0.5rem]">
            {Array(2)
              .fill(0)
              .map((_, repeatIdx) => (
                <div
                  key={repeatIdx}
                  className="flex shrink-0 gap-2 [--gap:0.5rem] [--duration:40s] animate-marquee group-hover:[animation-play-state:paused]"
                >
                  {pills.map((pill) => (
                    <div
                      key={pill.title}
                      className="flex flex-row items-center gap-2 shrink-0 rounded-full pl-2 pr-3.5 py-1.5 bg-card dark:bg-white/[0.03] border border-border/60 dark:border-white/10 shadow-[0_2px_10px_rgb(0,0,0,0.05)]"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                        <pill.icon className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <span className="text-xs font-medium text-foreground whitespace-nowrap">
                        {pill.title}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function HandshakeActiveCard({
  app,
  index: _index,
}: {
  app: HubSubmittedAppResponse;
  index: number;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
      <div className="text-sm font-bold truncate">{app.androidApp.appName}</div>
      <div className="text-xs text-muted-foreground mt-1 truncate">
        {app.androidApp.appLogoUrl ? "Active test" : "Active handshake test"}
      </div>
    </div>
  );
}

function CheckItem({
  lead,
  rest,
  color,
  bold,
}: {
  lead: string;
  rest: string;
  color: "emerald" | "primary";
  bold: boolean;
}) {
  const tile =
    color === "emerald"
      ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-500/40"
      : "bg-gradient-to-br from-primary to-primary/70 shadow-sm shadow-primary/40";

  return (
    <motion.div variants={rowVariants} className="flex items-start gap-2.5">
      <div
        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5 ${tile}`}
      >
        <svg
          viewBox="0 0 12 12"
          className="w-2.5 h-2.5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 6.5l2.5 2.5 4.5-5" />
        </svg>
      </div>
      <span className="text-sm text-foreground/90 leading-snug">
        <span className={`${bold ? "font-bold" : ""} text-foreground`}>
          {lead}
        </span>
        {rest ? <span> {rest}</span> : null}
      </span>
    </motion.div>
  );
}

function HandshakeEmptyCard() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shrink-0">
            <HandshakeIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="flex flex-row gap-1 text-2xl md:text-[28px] font-extrabold leading-[1.0] tracking-tight">
            <span className="block text-foreground">Handshake</span>
            <span className="block text-emerald-500">Testing</span>
          </h2>
        </div>
        <span className="shrink-0 inline-flex items-center px-6 py-2 rounded-full bg-emerald-500 text-white text-sm font-bold uppercase tracking-widest">
          Free
        </span>
      </div>

      {/* Tagline + paragraph */}
      <div className="text-[15px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
        Free. Simple. Reliable.
      </div>
      <p className="text-sm text-foreground/70 leading-relaxed mb-4">
        Test apps with the community, build trust and grow together. No cost, no
        hassle.
      </p>

      {/* Features */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="space-y-2.5 mb-5"
      >
        {handshakeFeatures.map((f) => (
          <CheckItem
            key={f.lead}
            lead={f.lead}
            rest={f.rest}
            color="emerald"
            bold={f.bold}
          />
        ))}
      </motion.div>

      {/* Info strip with glowing gradient edge */}
      <div className="mb-4 flex items-center gap-2.5 rounded-[calc(1rem-1px)] bg-card/80 dark:bg-card/60 backdrop-blur px-3.5 py-2.5">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
          <Users className="w-4 h-4 text-white" />
        </div>
        <span className="text-[13px] text-foreground/80 leading-snug">
          Great for getting started and building your testing network.
        </span>
      </div>

      {/* CTA */}
      <TransitionLink
        href={ROUTES.AUTHENTICATED.HANDSHAKE_TESTING}
        className="group mt-auto w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 font-bold text-sm hover:shadow-emerald-500/60 hover:-translate-y-0.5 transition-all duration-300"
      >
        Try Handshake Testing
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </TransitionLink>
    </>
  );
}

function ProEmptyCard() {
  return (
    <>
      {/* Header with floating MOST POPULAR chip */}
      <div className="relative flex items-start gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <h2 className="flex flex-row gap-1 text-2xl md:text-[28px] font-extrabold leading-[1.0] tracking-tight">
            <span className="block text-foreground">Pro</span>
            <span className="block text-primary">Testing</span>
          </h2>
        </div>
        <span className="absolute -top-4 -right-2 rotate-2 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase tracking-widest">
          <Star className="w-3 h-3 fill-current" />
          Most Popular
        </span>
      </div>

      {/* Tagline + paragraph */}
      <div className="text-[15px] font-bold text-primary mb-1">
        More Testers. Better Feedback. Faster Results.
      </div>
      <p className="text-sm text-foreground/70 leading-relaxed mb-4">
        Get professional, managed testing with vetted testers, detailed reports
        and full support. The smarter way to launch on Google Play.
      </p>

      {/* Features */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="space-y-2.5 mb-5"
      >
        {proFeatures.map((f) => (
          <CheckItem
            key={f.lead}
            lead={f.lead}
            rest={f.rest}
            color="primary"
            bold={f.bold}
          />
        ))}
      </motion.div>

      {/* Info strip with glowing gradient edge */}
      <div className="mb-4 flex items-center gap-2.5 rounded-[calc(1rem-1px)] bg-card/80 dark:bg-card/60 backdrop-blur px-3.5 py-2.5">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
          <Rocket className="w-4 h-4 text-white" />
        </div>
        <span className="text-[13px] text-foreground/80 leading-snug">
          Higher success rate. Less risk. Get your app to production, faster.
        </span>
      </div>

      {/* CTA */}
      <TransitionLink
        href={ROUTES.AUTHENTICATED.BILLING}
        className="group mt-auto w-full flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-2.5 font-bold text-sm hover:shadow-primary/60 hover:-translate-y-0.5 transition-all duration-300"
      >
        Choose Pro Testing
        <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
      </TransitionLink>
    </>
  );
}

function LoadingCards() {
  return (
    <div className="space-y-2 w-full">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 rounded-2xl bg-muted w-full" />
      ))}
    </div>
  );
}

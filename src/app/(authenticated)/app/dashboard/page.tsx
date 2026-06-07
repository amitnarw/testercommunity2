"use client";

import { Suspense } from "react";
import {
  Zap,
  Users2,
  Package,
  Coins,
  Clock,
  FileEdit,
  Bell,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Activity,
  AlertCircle,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutoTransitionLink } from "@/components/auto-transition-link";
import { Skeleton } from "@/components/ui/skeleton";
import { MagicCard } from "@/components/ui/magic-card";
import { AmbientGlowOrb } from "@/components/dashboard/ambient-glow-orb";
import { MiniSparkline } from "@/components/dashboard/mini-sparkline";
import { PremiumAppCard } from "@/components/dashboard/premium-app-card";
import { NotificationRow } from "@/components/dashboard/notification-row";
import { ActivityRow } from "@/components/dashboard/activity-row";
import { EmptyFeed } from "@/components/dashboard/empty-feed";
import { ROUTES } from "@/lib/routes";
import type { UserTransaction } from "@/lib/apiCalls";
import { useHubData, useHubApps, useHubAppsCount } from "@/hooks/useHub";
import { useDashboardApps, useDashboardAppsCount } from "@/hooks/useDashboard";
import { useGetUserWallet, useGetUserTransactions, useGetUserNotifications, useDashboardData } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";
import { TransitionLink } from "@/components/transition-link";
import { authClient } from "@/lib/auth-client";

function DashboardContent() {
  const { data: session } = authClient.useSession();
  const sessionData = session as any;
  const userName = sessionData?.user?.name?.split(" ")[0] || "Developer";

  const { data: hubData } = useHubData();
  const { data: hubAppsCount } = useHubAppsCount();
  const { data: hubActiveApps, isLoading: hubActiveLoading } = useHubApps({ type: "IN_TESTING" });
  const { data: dashData } = useDashboardData();
  const { data: dashAppsCount } = useDashboardAppsCount();
  const { data: dashActiveApps, isLoading: dashActiveLoading } = useDashboardApps({ type: "IN_TESTING,AVAILABLE" });
  const { data: wallet } = useGetUserWallet();
  const { data: notificationsData } = useGetUserNotifications();
  const { data: transactionsData } = useGetUserTransactions({ limit: 5 });

  const freeInReview = hubAppsCount?.IN_REVIEW || 0;
  const freeDrafts = hubAppsCount?.DRAFT || 0;
  const freeRejected = hubAppsCount?.REJECTED || 0;
  const proInReview = dashAppsCount?.IN_REVIEW || 0;
  const proDrafts = dashAppsCount?.DRAFT || 0;
  const proRejected = dashAppsCount?.REJECTED || 0;

  const totalInReview = freeInReview + proInReview;
  const totalDrafts = freeDrafts + proDrafts;
  const totalRejected = freeRejected + proRejected;

  const packagesBalance = dashData?.wallet ?? wallet?.totalPackages ?? 0;
  const pointsBalance = hubData?.wallet ?? wallet?.totalPoints ?? 0;

  const notifications = notificationsData?.notifications?.slice(0, 3) || [];
  const totalUnread = notificationsData?.totalNotifications || 0;
  const recentTransactions = transactionsData?.transactions?.slice(0, 5) || [];

  const groupByDate = (txs: UserTransaction[]) => {
    const groups: { label: string; items: UserTransaction[] }[] = [];
    let currentLabel = "";
    let currentItems: UserTransaction[] = [];
    for (const tx of txs) {
      const date = new Date(tx.date);
      const label = isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMMM d");
      if (label !== currentLabel) {
        if (currentItems.length > 0) groups.push({ label: currentLabel, items: currentItems });
        currentLabel = label;
        currentItems = [tx];
      } else {
        currentItems.push(tx);
      }
    }
    if (currentItems.length > 0) groups.push({ label: currentLabel, items: currentItems });
    return groups;
  };

  const groupedTransactions = groupByDate(recentTransactions);

  const proActiveCount = dashActiveApps?.length || 0;
  const freeActiveCount = hubActiveApps?.length || 0;
  const totalActive = proActiveCount + freeActiveCount;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const actionItems: { label: string; description: string; href: string; severity: "high" | "medium" | "low" }[] = [];

  if (totalRejected > 0) {
    actionItems.push({
      label: `${totalRejected} app${totalRejected > 1 ? "s" : ""} rejected`,
      description: "Review rejection reasons and resubmit.",
      href: ROUTES.AUTHENTICATED.FREE_TESTING,
      severity: "medium",
    });
  }

  if (proInReview > 0 && packagesBalance <= 0) {
    actionItems.push({
      label: "No packages available",
      description: `${proInReview} pro app${proInReview > 1 ? "s" : ""} in review — purchase packages to proceed when approved.`,
      href: ROUTES.AUTHENTICATED.BILLING,
      severity: "high",
    });
  }

  const allActiveApps = [
    ...(dashActiveApps || []).map(a => ({ ...a, appType: "PAID" as const })),
    ...(hubActiveApps || []).map(a => ({ ...a, appType: "FREE" as const })),
  ];

  const nearExpiryApps = allActiveApps.filter(a => {
    const remaining = (a.totalDay || 14) - (a.currentDay || 0);
    return remaining <= 3 && remaining > 0;
  });

  nearExpiryApps.forEach(a => {
    const remaining = (a.totalDay || 14) - (a.currentDay || 0);
    actionItems.push({
      label: `"${a.androidApp?.appName || "Untitled"}" expires in ${remaining} day${remaining !== 1 ? "s" : ""}`,
      description: `${a.currentTester || 0}/${a.totalTester || 12} testers`,
      href: a.appType === "PAID" ? ROUTES.AUTHENTICATED.PRO_TESTING : ROUTES.AUTHENTICATED.FREE_TESTING,
      severity: remaining <= 1 ? "high" : "medium",
    });
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* ===== 1. HERO WELCOME ===== */}
        <section className="my-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-border/30 bg-gradient-to-br from-background via-card/50 to-background p-3 md:p-6 shadow-2xl shadow-black/10"
          >
            {/* Ambient background glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
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
                      <strong className="text-foreground">{totalActive}</strong> active app{totalActive !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Bell className="w-4 h-4 text-primary" />
                    <span>
                      <strong className="text-foreground">{totalUnread}</strong> unread
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkline card */}
              <div className="shrink-0 w-full md:w-48 h-20 bg-card/50 rounded-2xl border border-border/40 p-1 flex flex-col justify-between">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider p-2">
                  7-day activity
                </p>
                <div className="h-10 -mx-1 -mb-1">
                  <MiniSparkline className="w-full h-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== 2. QUICK ACTIONS ===== */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="mb-8 flex flex-wrap gap-3"
        >
          <QuickActionPill
            href="/app/pro-testing/add-app"
            icon={Zap}
            label="Submit Pro App"
            gradient="from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 hover:to-amber-600/10 border-amber-500/20 hover:border-amber-500/30"
            iconColor="text-amber-500"
          />
          <QuickActionPill
            href="/app/free-testing/submit"
            icon={Users2}
            label="Submit Free App"
            gradient="from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 border-blue-500/20 hover:border-blue-500/30"
            iconColor="text-blue-500"
          />
          <QuickActionPill
            href={ROUTES.AUTHENTICATED.BILLING}
            icon={Package}
            label="Buy Packages"
            gradient="from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/20 hover:to-emerald-600/10 border-emerald-500/20 hover:border-emerald-500/30"
            iconColor="text-emerald-500"
          />
        </motion.section>

        {/* ===== 3. ACTION REQUIRED ===== */}
        {actionItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="mb-8"
          >
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Action Required
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
              {actionItems.map((item, i) => (
                <AutoTransitionLink
                  key={i}
                  href={item.href}
                  className={cn(
                    "shrink-0 w-72 relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:shadow-lg group",
                    item.severity === "high"
                      ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10"
                      : "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10",
                  )}
                >
                  {/* Glow orb */}
                  <AmbientGlowOrb
                    color={item.severity === "high" ? "bg-red-500/10" : "bg-amber-500/10"}
                    className="absolute -top-6 -right-6 w-20 h-20"
                  />
                  <div className="relative z-10 flex items-start gap-3">
                    <div className={cn(
                      "rounded-full p-2 shrink-0",
                      item.severity === "high" ? "bg-red-500/15" : "bg-amber-500/15",
                    )}>
                      <AlertCircle className={cn(
                        "w-4 h-4",
                        item.severity === "high" ? "text-red-500" : "text-amber-500",
                      )} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </AutoTransitionLink>
              ))}
            </div>
          </motion.section>
        )}

        {/* ===== 4+5. PRO + FREE TESTING — UNIFIED ===== */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="rounded-2xl border border-border/30 bg-card/50 overflow-hidden shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: Pro Testing */}
              <div className="p-5">
                <SectionHeader
                  icon={Zap}
                  label="Pro Testing"
                  iconColor="text-amber-500"
                  href={ROUTES.AUTHENTICATED.PRO_TESTING}
                  count={proActiveCount}
                />
                {dashActiveLoading ? (
                  <div className="grid gap-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
                  </div>
                ) : dashActiveApps && dashActiveApps.length > 0 ? (
                  <div className="grid gap-3">
                    {dashActiveApps.slice(0, 3).map((app, i) => (
                      <PremiumAppCard key={app.id} app={app} type="PAID" index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptySection
                    icon={Zap}
                    label="No active pro testing projects."
                    buttonLabel="Submit Your First Pro App"
                    buttonHref="/app/pro-testing/add-app"
                  />
                )}
              </div>

              {/* Right: Free Testing */}
              <div className="p-5">
                <SectionHeader
                  icon={Users2}
                  label="Free Testing"
                  iconColor="text-blue-500"
                  href={ROUTES.AUTHENTICATED.FREE_TESTING}
                  count={freeActiveCount}
                />
                {hubActiveLoading ? (
                  <div className="grid gap-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
                  </div>
                ) : hubActiveApps && hubActiveApps.length > 0 ? (
                  <div className="grid gap-3">
                    {hubActiveApps.slice(0, 3).map((app, i) => (
                      <PremiumAppCard key={app.id} app={app} type="FREE" index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptySection
                    icon={Users2}
                    label="No active free testing projects."
                    buttonLabel="Submit Your First Free App"
                    buttonHref="/app/free-testing/submit"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== 6. STATS BENTO ===== */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="mb-8"
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Packages - featured */}
            <StatsCardFeatured
              icon={Package}
              label="Packages"
              value={packagesBalance}
              href={ROUTES.AUTHENTICATED.BILLING}
            >
              <div className="h-12 -mx-2 -mb-2 mt-1">
                <MiniSparkline className="w-full h-full" />
              </div>
            </StatsCardFeatured>

            {/* Points */}
            <StatsCard
              icon={Coins}
              label="Points"
              value={pointsBalance}
              href={ROUTES.AUTHENTICATED.WALLET}
            />

            {/* In Review */}
            <StatsCard
              icon={Clock}
              label="In Review"
              value={totalInReview}
              href={totalInReview > 0 ? ROUTES.AUTHENTICATED.FREE_TESTING : "#"}
            />

            {/* Drafts */}
            <StatsCard
              icon={FileEdit}
              label="Drafts"
              value={totalDrafts}
              href={totalDrafts > 0 ? ROUTES.AUTHENTICATED.FREE_TESTING : "#"}
            />
          </div>
        </motion.section>

        {/* ===== 7. NOTIFICATIONS + ACTIVITY — SIDE BY SIDE ===== */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Notifications card */}
            <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  {totalUnread > 0 && (
                    <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded-full leading-none">
                      {totalUnread}
                    </span>
                  )}
                </div>
                <AutoTransitionLink
                  href={ROUTES.AUTHENTICATED.NOTIFICATIONS}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </AutoTransitionLink>
              </div>
              <div className="space-y-0.5">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <NotificationRow key={n.id} notification={n} />
                  ))
                ) : (
                  <EmptyFeed
                    icon={Bell}
                    title="No notifications yet"
                    description="Start by submitting an app for testing."
                  />
                )}
              </div>
            </div>

            {/* Activity card */}
            <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Recent Activity</h3>
                </div>
                <AutoTransitionLink
                  href={ROUTES.AUTHENTICATED.WALLET}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </AutoTransitionLink>
              </div>
              <div className="space-y-2">
                {groupedTransactions.length > 0 ? (
                  groupedTransactions.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2.5">
                        {group.label}
                      </p>
                      {group.items.map((t) => (
                        <ActivityRow key={t.id} transaction={t} />
                      ))}
                    </div>
                  ))
                ) : (
                  <EmptyFeed
                    icon={Activity}
                    title="No wallet activity yet"
                    description="Buy a package or submit an app to get started."
                    className="py-6"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */

function SectionHeader({
  icon: Icon,
  label,
  iconColor,
  href,
  count,
}: {
  icon: typeof Zap;
  label: string;
  iconColor: string;
  href: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Icon className={cn("w-3.5 h-3.5", iconColor)} />
        {label}
        {count > 0 && (
          <span className="text-xs font-normal text-muted-foreground/60">({count})</span>
        )}
      </h2>
      <AutoTransitionLink
        href={href}
        className="text-xs text-primary hover:underline flex items-center gap-1"
      >
        View All <ChevronRight className="w-3 h-3" />
      </AutoTransitionLink>
    </div>
  );
}

function EmptySection({
  icon: Icon,
  label,
  buttonLabel,
  buttonHref,
}: {
  icon: typeof Zap;
  label: string;
  buttonLabel: string;
  buttonHref: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-muted-foreground/30 bg-card/30 p-8 text-center">
      <Icon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
      <p className="text-sm text-muted-foreground mb-3">{label}</p>
      <Button asChild size="sm" className="rounded-xl">
        <TransitionLink href={buttonHref}>
          <Plus className="w-4 h-4 mr-1.5" />
          {buttonLabel}
        </TransitionLink>
      </Button>
    </div>
  );
}

function QuickActionPill({
  href,
  icon: Icon,
  label,
  gradient,
  iconColor,
}: {
  href: string;
  icon: typeof Zap;
  label: string;
  gradient: string;
  iconColor: string;
}) {
  return (
    <TransitionLink
      href={href}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group",
        gradient,
      )}
    >
      <Icon className={cn("w-4 h-4 transition-transform duration-300 group-hover:scale-110", iconColor)} />
      <span className="text-sm font-medium">{label}</span>
    </TransitionLink>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  href: string;
}) {
  const content = (
    <MagicCard
      className="!rounded-2xl border-border/40 bg-card/60 h-full"
      gradientColor="#6366f1"
      gradientOpacity={0.08}
    >
      <div className="p-4 relative overflow-hidden">
        <AmbientGlowOrb
          color="bg-primary/5"
          className="absolute -top-8 -right-8 w-20 h-20"
        />
        <div className="relative z-10">
          <div className="rounded-xl bg-primary/10 p-2.5 w-fit mb-3">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tabular-nums mt-0.5">{value}</p>
        </div>
      </div>
    </MagicCard>
  );

  if (href && href !== "#") {
    return <AutoTransitionLink href={href} className="block">{content}</AutoTransitionLink>;
  }
  return content;
}

function StatsCardFeatured({
  icon: Icon,
  label,
  value,
  href,
  children,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  href: string;
  children?: React.ReactNode;
}) {
  const content = (
    <MagicCard
      className="!rounded-2xl border-border/40 bg-card/60 h-full"
      gradientColor="#f59e0b"
      gradientOpacity={0.1}
    >
      <div className="p-4 relative overflow-hidden flex flex-col h-full">
        <AmbientGlowOrb
          color="bg-amber-500/5"
          className="absolute -top-8 -right-8 w-24 h-24"
        />
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="rounded-xl bg-amber-500/10 p-2.5 w-fit mb-3">
            <Icon className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tabular-nums mt-0.5">{value}</p>
          {children}
        </div>
      </div>
    </MagicCard>
  );

  if (href && href !== "#") {
    return <AutoTransitionLink href={href} className="block h-full">{content}</AutoTransitionLink>;
  }
  return content;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

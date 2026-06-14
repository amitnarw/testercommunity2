"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActionRequiredSection } from "@/components/dashboard/action-required-section";
import { DiaryTestingSection } from "@/components/dashboard/diary-testing-section";
import { StatsBento } from "@/components/dashboard/stats-bento";
import { NotificationsCard } from "@/components/dashboard/notifications-card";
import { ActivityCard } from "@/components/dashboard/activity-card";

function DashboardContent() {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name?.split(" ")[0] || "Developer";
  const summary = useDashboardSummary();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        

        <DashboardHero
          greeting={summary.greeting}
          userName={userName}
          totalActive={summary.totalActive}
          totalUnread={summary.totalUnread}
        />

        <QuickActions />

        <ActionRequiredSection actionItems={summary.actionItems} />

        <DiaryTestingSection
          proApps={summary.dashActiveApps}
          proLoading={summary.dashActiveLoading}
          proCount={summary.proActiveCount}
          freeApps={summary.hubActiveApps}
          freeLoading={summary.hubActiveLoading}
          freeCount={summary.freeActiveCount}
        />

        <StatsBento summary={summary} />

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <NotificationsCard
              notifications={summary.notifications}
              totalUnread={summary.totalUnread}
            />
            <ActivityCard groupedTransactions={summary.groupedTransactions} />
          </div>
        </motion.section>
      </div>
    </div>
  );
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

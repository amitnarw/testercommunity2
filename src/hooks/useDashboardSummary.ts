"use client";

import { useMemo } from "react";
import { isToday, isYesterday, format } from "date-fns";
import { useHubData, useHubApps, useHubAppsCount } from "@/hooks/useHub";
import { useDashboardApps, useDashboardAppsCount } from "@/hooks/useDashboard";
import { useGetUserWallet, useGetUserTransactions, useGetUserNotifications, useDashboardData } from "@/hooks/useUser";
import { ROUTES } from "@/lib/routes";
import type { UserTransaction } from "@/lib/apiCalls";

function groupByDate(txs: UserTransaction[]) {
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
}

export function useDashboardSummary() {
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

  const proActiveCount = dashActiveApps?.length || 0;
  const freeActiveCount = hubActiveApps?.length || 0;
  const totalActive = proActiveCount + freeActiveCount;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  }, []);

  const allActiveApps = useMemo(() => [
    ...(dashActiveApps || []).map(a => ({ ...a, appType: "PAID" as const })),
    ...(hubActiveApps || []).map(a => ({ ...a, appType: "FREE" as const })),
  ], [dashActiveApps, hubActiveApps]);

  const actionItems = useMemo(() => {
    const items: { label: string; description: string; href: string; severity: "high" | "medium" | "low" }[] = [];

    if (totalRejected > 0) {
      items.push({
        label: `${totalRejected} app${totalRejected > 1 ? "s" : ""} rejected`,
        description: "Review rejection reasons and resubmit.",
        href: ROUTES.AUTHENTICATED.FREE_TESTING,
        severity: "medium",
      });
    }

    if (proInReview > 0 && packagesBalance <= 0) {
      items.push({
        label: "No packages available",
        description: `${proInReview} pro app${proInReview > 1 ? "s" : ""} in review, purchase packages to proceed when approved.`,
        href: ROUTES.AUTHENTICATED.BILLING,
        severity: "high",
      });
    }

    for (const a of allActiveApps) {
      const remaining = (a.totalDay || 14) - (a.currentDay || 0);
      if (remaining <= 3 && remaining > 0) {
        items.push({
          label: `"${a.androidApp?.appName || "Untitled"}" expires in ${remaining} day${remaining !== 1 ? "s" : ""}`,
          description: `${a.currentTester || 0}/${a.totalTester || 12} testers`,
          href: a.appType === "PAID" ? ROUTES.AUTHENTICATED.PRO_TESTING : ROUTES.AUTHENTICATED.FREE_TESTING,
          severity: remaining <= 1 ? "high" : "medium",
        });
      }
    }

    return items;
  }, [totalRejected, proInReview, packagesBalance, allActiveApps]);

  const groupedTransactions = useMemo(() => {
    const txs = transactionsData?.transactions?.slice(0, 5) || [];
    return groupByDate(txs);
  }, [transactionsData]);

  return {
    dashActiveApps,
    dashActiveLoading,
    hubActiveApps,
    hubActiveLoading,
    proActiveCount,
    freeActiveCount,
    totalActive,
    totalInReview,
    totalDrafts,
    totalRejected,
    packagesBalance,
    pointsBalance,
    notifications,
    totalUnread,
    groupedTransactions,
    actionItems,
    greeting,
  };
}

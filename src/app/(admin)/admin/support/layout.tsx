"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/lib/routes";
import { Skeleton } from "@/components/ui/skeleton";

const SUPPORT_TABS = [
  { value: "stats", label: "Support Stats", route: ROUTES.ADMIN.SUPPORT },
  { value: "tickets", label: "Tickets", route: "/admin/support/tickets" },
  { value: "live-chat", label: "Live Chat", route: "/admin/support/live-chat" },
];

const StatsContent = lazy(() => import("./page"));
const TicketsContent = lazy(() => import("./tickets/page"));
const LiveChatContent = lazy(() => import("./live-chat/page"));

function getTabFromPathname(pathname: string): string {
  if (pathname === "/admin/support/tickets") return "tickets";
  if (pathname === "/admin/support/live-chat") return "live-chat";
  return "stats";
}

function TabSkeleton() {
  return (
    <div className="px-4 sm:px-6 py-6 w-full space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

function LiveChatSkeleton() {
  return (
    <div className="flex-1 w-full px-4 sm:px-6 py-6 max-w-full overflow-x-hidden">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="flex gap-1 mb-4 p-1 bg-muted/50 rounded-xl lg:hidden">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </div>
      <div className="grid gap-6 grid-cols-1 h-[calc(100vh-340px)] min-h-[400px] lg:grid-cols-4 lg:h-[calc(100vh-280px)] lg:min-h-[500px]">
        <Skeleton className="h-full w-full rounded-xl lg:col-span-1" />
        <Skeleton className="h-full w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-full w-full rounded-xl lg:col-span-1" />
      </div>
    </div>
  );
}

export default function SupportLayout() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(() => getTabFromPathname(pathname));

  useEffect(() => {
    setActiveTab(getTabFromPathname(pathname));
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const tab = SUPPORT_TABS.find((t) => t.value === value);
    if (tab) {
      window.history.replaceState(null, "", tab.route);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-4 sm:px-6 pt-6 pb-2">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            {SUPPORT_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div style={{ display: activeTab === "stats" ? "contents" : "none" }}>
        <Suspense fallback={<TabSkeleton />}>
          <StatsContent />
        </Suspense>
      </div>
      <div style={{ display: activeTab === "tickets" ? "contents" : "none" }}>
        <Suspense fallback={<TabSkeleton />}>
          <TicketsContent />
        </Suspense>
      </div>
      <div style={{ display: activeTab === "live-chat" ? "contents" : "none" }}>
        <Suspense fallback={<LiveChatSkeleton />}>
          <LiveChatContent />
        </Suspense>
      </div>
    </div>
  );
}

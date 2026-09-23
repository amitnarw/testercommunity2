"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Activity, Handshake, LayoutPanelLeft } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CustomTabsList } from "@/components/custom-tabs-list";
import {
  useHubAppsCount,
  useHubData,
  useHubStats,
  useHubApps,
} from "@/hooks/useHub";
import { ROUTES } from "@/lib/routes";
import { useIncomingHandshakeRequests, useOutgoingHandshakeRequests } from "@/hooks/useHandshakeRequests";
import { DiscoverSection } from "@/components/handshake/discover-section";
import { MyAppsSection } from "@/components/handshake/my-apps-section";
import { ActivitySection } from "@/components/handshake/activity-section";
import { useMyLevel } from "@/hooks/useLevel";
import { StickyPageTitle } from "@/components/sticky-page-title";

const BentoCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-card rounded-2xl p-4 flex flex-col justify-between ${className}`}
  >
    {children}
  </div>
);

// Hub tabs: my-apps (my submissions) | discover (tester, default) | activity (requests + testing + history).
// Legacy ?tab= values from the old 4-tab layout are mapped forward.
const LEGACY_TAB_MAP: Record<string, string> = {
  available: "discover",
  submissions: "my-apps",
  requests: "my-apps",
  running: "activity",
};
const resolveTab = (raw: string | null) => {
  if (!raw) return "discover";
  return LEGACY_TAB_MAP[raw] ?? raw;
};

function CommunityDashboardContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Hub tabs: my-apps (my submissions) | discover (tester, default) | activity.
  // Legacy ?tab= values from the old 4-tab layout are mapped forward.
  const [selectedTab, setSelectedTab] = useState(() =>
    resolveTab(searchParams.get("tab")),
  );

  useEffect(() => {
    setSelectedTab(resolveTab(searchParams.get("tab")));
  }, [searchParams]);

  const updateUrl = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.delete("subtab");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleMainTabChange = (val: string) => {
    setSelectedTab(val);
    updateUrl(val);
  };

  const { data: hubDataCount } = useHubAppsCount();

  // Cheap PENDING-only incoming count for the Requests bento tile.
  const { data: pendingIncoming } = useIncomingHandshakeRequests({
    status: "PENDING",
    limit: 1,
  });
  const pendingCount = pendingIncoming?.pagination?.total ?? 0;

  // Running count = Active (in_testing) + Approved (accepted)
  const runningCount =
    (hubDataCount?.["IN_TESTING"] || 0) + (hubDataCount?.["ACCEPTED"] || 0);

  const tabs = [
    {
      label: "My Apps",
      value: "my-apps",
      icon: LayoutPanelLeft,
      description: "Your submissions & their status",
    },
    {
      label: "Discover",
      value: "discover",
      icon: Activity,
      description: "Browse developers & send handshakes",
    },
    {
      label: "Activity",
      value: "activity",
      icon: Activity,
      description: "Requests, active tests & history",
    },
  ];

  const { data: hubData } = useHubData();
  const { data: handshakeStats } = useHubStats();
  const { data: myLevel } = useMyLevel();

  const appsSubmitted = hubData?.appsSubmitted || 0;
  const testersEngaged = hubData?.testersEngaged || 0;
  const testsCompleted = hubData?.testsCompleted || 0;

  // S5a-2: real discovery data — other users' AVAILABLE handshake apps
  const { data: availableApps, isPending: availableIsPending } = useHubApps({
    type: selectedTab === "discover" ? "AVAILABLE" : "",
  });

  const isActivity = selectedTab === "activity";
  // Activity → Testing now: apps owned by others where this user has an ACTIVE relation
  const { data: inTestingApps, isPending: inTestingPending } = useHubApps({
    type: isActivity ? "IN_TESTING" : "",
  });
  const { data: approvedApps, isPending: approvedPending } = useHubApps({
    type: isActivity ? "APPROVED" : "",
  });
  const runningApps = [...(approvedApps ?? []), ...(inTestingApps ?? [])];
  // Activity → History: apps where the user completed testing
  const { data: completedApps, isPending: completedPending } = useHubApps({
    type: isActivity ? "COMPLETED" : "",
  });
  // Activity → Received / Sent requests
  const { data: incoming, isLoading: incomingLoading } =
    useIncomingHandshakeRequests(
      isActivity ? { status: "PENDING", limit: 20 } : undefined,
    );
  const { data: outgoing, isLoading: outgoingLoading } =
    useOutgoingHandshakeRequests(isActivity ? { limit: 20 } : undefined);

  return (
    <div data-loc="CommunityDashboardPage" className="min-h-screen mb-8">
      <div className="container mx-auto px-4 md:px-6">
        <StickyPageTitle
          title="Handshake Testing"
          titleClassName="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-emerald-600 to-emerald-700 bg-clip-text text-transparent py-0 sm:py-1.5"
        >
          <div className="mb-12">
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mb-6">
              Offer your app, test a peer&apos;s app, and level up. Free for
              everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <BentoCard className="col-span-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Activity className="w-4 h-4" /> Performance
              </CardTitle>
              <div className="grid grid-cols-3 gap-2 w-full mt-2">
                <div className="text-center bg-secondary p-2 rounded-lg">
                  <p className="text-2xl font-bold">{appsSubmitted}</p>
                  <p className="text-xs text-muted-foreground">
                    Apps Submitted
                  </p>
                </div>
                <div className="text-center bg-secondary p-2 rounded-lg">
                  <p className="text-2xl font-bold">{testersEngaged}</p>
                  <p className="text-xs text-muted-foreground">
                    Testers Engaged
                  </p>
                </div>
                <div className="text-center bg-secondary p-2 rounded-lg">
                  <p className="text-2xl font-bold">{testsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Tests Done</p>
                </div>
              </div>
            </BentoCard>

            <div className="flex flex-row gap-2 col-span-2">
              <BentoCard className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white relative overflow-hidden w-5/12 sm:w-1/2 !p-2 sm:!p-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2 relative z-10">
                  <Handshake className="absolute top-5 right-5 scale-[6] text-white/10 rotate-45 w-4 h-4" />
                  <span className="hidden sm:block">Handshake Level</span>
                  <span className="block sm:hidden">Handshake lvl</span>
                </CardTitle>
                <p className="text-3xl sm:text-5xl font-bold my-auto relative z-10">
                  {handshakeStats?.handshakeLevel ?? 0}
                </p>
                <p className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-xs text-white/80 relative z-10">
                  <span className="bg-card/20 rounded-xl py-0.5 px-2">
                    {myLevel?.completedCount ?? 0} completed
                  </span>
                  <span className="bg-card/20 rounded-xl py-0.5 px-2">
                    {myLevel?.slots ?? 12} slots
                  </span>
                </p>
              </BentoCard>

              <BentoCard className="w-7/12 sm:w-1/2 !p-2.5 sm:!p-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  My Testing
                </CardTitle>
                <div className="grid grid-rows-2 grid-cols-1 sm:grid-cols-2 sm:grid-rows-1 gap-2 w-full mt-2 h-full">
                  <div className="text-center bg-secondary px-4 rounded-lg flex flex-row sm:flex-col items-center justify-between sm:justify-center">
                    <p className="text-xs text-muted-foreground">Running</p>
                    <p className="text-2xl font-bold">{runningCount}</p>
                  </div>
                  <div className="text-center bg-secondary px-4 rounded-lg flex flex-row sm:flex-col items-center justify-between sm:justify-center">
                    <p className="text-xs text-muted-foreground">Requests</p>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                  </div>
                </div>
              </BentoCard>
            </div>

            <BentoCard className="flex !flex-row sm:!flex-col gap-2 col-span-2 lg:col-span-1 !p-2.5 sm:!p-4">
              <Button
                className="w-full justify-center h-full bg-gradient-to-b from-emerald-600 to-emerald-700 text-white p-2 sm:p-auto"
                onClick={() =>
                  router.push(ROUTES.AUTHENTICATED.HANDSHAKE_SUBMIT)
                }
              >
                <PlusCircle className="absolute sm:static left-0 top-0 scale-[2] text-white/20 sm:left-auto sm:top-auto sm:scale-[1] sm:text-white mr-2 h-4 w-4" />
                <p>Submit New App</p>
              </Button>
            </BentoCard>
          </div>
          </div>
        </StickyPageTitle>

        <main>
          <Tabs
            value={selectedTab}
            onValueChange={handleMainTabChange}
            className="w-full"
          >
            <CustomTabsList
              tabs={tabs}
              activeTab={selectedTab}
              className="sticky top-0 z-30 backdrop-blur-xl py-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6"
            />

            <TabsContent value="my-apps">
              <MyAppsSection />
            </TabsContent>

            <TabsContent value="discover">
              <DiscoverSection
                apps={availableApps ?? []}
                isLoading={availableIsPending}
              />
            </TabsContent>

            <TabsContent value="activity">
              <ActivitySection
                incoming={incoming?.items ?? []}
                incomingLoading={incomingLoading}
                outgoing={outgoing?.items ?? []}
                outgoingLoading={outgoingLoading}
                testing={runningApps}
                testingLoading={inTestingPending || approvedPending}
                history={completedApps ?? []}
                historyLoading={completedPending}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default function CommunityDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CommunityDashboardContent />
    </Suspense>
  );
}

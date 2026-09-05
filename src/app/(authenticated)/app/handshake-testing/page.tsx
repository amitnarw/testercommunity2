"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, LayoutPanelLeft, Activity, Handshake } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CustomTabsList } from "@/components/custom-tabs-list";
import { Badge } from "@/components/ui/badge";
import {
  useHubAppsCount,
  useHubData,
  useHubStats,
  useHubApps,
} from "@/hooks/useHub";
import { ROUTES } from "@/lib/routes";
import {
  useIncomingHandshakeRequests,
  useOutgoingHandshakeRequests,
} from "@/hooks/useHandshakeRequests";
import { AvailableDevelopersSection } from "@/components/handshake/available-developers-section";
import { IncomingRequestsSection } from "@/components/handshake/incoming-requests-section";
import { OutgoingRequestsSection } from "@/components/handshake/outgoing-requests-section";
import { ExistingHandshakesSection } from "@/components/handshake/existing-handshakes-section";
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

function CommunityDashboardContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(
    searchParams.get("tab") || "available",
  );
  const [requestsSubTab, setRequestsSubTab] = useState<"incoming" | "outgoing">(
    (searchParams.get("subtab") === "outgoing" ? "outgoing" : "incoming") as
      | "incoming"
      | "outgoing",
  );
  const [showOutgoingHistory, setShowOutgoingHistory] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setSelectedTab(tab);
  }, [searchParams]);

  const updateUrl = (newTab: string, newSubTab?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    if (newSubTab) {
      params.set("subtab", newSubTab);
    } else {
      params.delete("subtab");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleMainTabChange = (val: string) => {
    setSelectedTab(val);
    updateUrl(val);
  };

  const handleRequestsSubTabChange = (val: string) => {
    setRequestsSubTab(val === "outgoing" ? "outgoing" : "incoming");
    updateUrl("requests", val);
  };

  const { data: hubDataCount } = useHubAppsCount();

  // v2 handshake request lists. S6-10: incoming is PENDING-only so the list,
  // badge count, and action buttons all agree; outgoing keeps full history
  // with per-status badges.
  const { data: incoming, isLoading: incomingLoading } =
    useIncomingHandshakeRequests({ status: "PENDING", limit: 20 });
  const { data: outgoing, isLoading: outgoingLoading } =
    useOutgoingHandshakeRequests({ limit: 20 });

  // S7-9: cheap PENDING-only outgoing count so the Requests badge reflects
  // actionable items symmetrically with Incoming (the full-history list
  // above still shows every status).
  const { data: pendingOutgoing } = useOutgoingHandshakeRequests({
    status: "PENDING",
    limit: 1,
  });

  // S6-10/S7-9: derive the Requests tab / bento count from the v2 request
  // tables (legacy relation-based counts never see HandshakeRequest rows).
  const requestsCount =
    (incoming?.pagination?.total ?? 0) +
    (pendingOutgoing?.pagination?.total ?? 0);

  // Running count = Active (in_testing) + Approved (accepted)
  const runningCount =
    (hubDataCount?.["IN_TESTING"] || 0) + (hubDataCount?.["ACCEPTED"] || 0);

  const tabs = [
    {
      label: "Available",
      value: "available",
      count: hubDataCount?.["AVAILABLE"] || 0,
      icon: Activity,
      description: "Browse developers & send handshakes",
    },
    {
      label: "Requests",
      value: "requests",
      count: requestsCount,
      icon: Activity,
      description: "Incoming & outgoing handshake requests",
    },
    {
      label: "Running",
      value: "running",
      count: runningCount,
      icon: Activity,
      description: "Active tests & approved apps",
    },
  ];

  const { data: hubData } = useHubData();
  const { data: handshakeStats } = useHubStats();
  const { data: myLevel } = useMyLevel();

  const appsSubmitted = hubData?.appsSubmitted || 0;
  const testersEngaged = hubData?.testersEngaged || 0;
  const testsCompleted = hubData?.testsCompleted || 0;

  // S5a-2: real discovery data ,  other users' AVAILABLE handshake apps
  const { data: availableApps, isPending: availableIsPending } = useHubApps({
    type: selectedTab === "available" ? "AVAILABLE" : "",
  });

  // Running: apps owned by others where this user has an ACTIVE relation
  const { data: inTestingApps, isPending: inTestingPending } = useHubApps({
    type: "IN_TESTING",
  });
  const { data: approvedApps, isPending: approvedPending } = useHubApps({
    type: "APPROVED",
  });
  const runningApps = [...(approvedApps ?? []), ...(inTestingApps ?? [])];

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
              <BentoCard className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white relative overflow-hidden w-5/12 sm:w-1/2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 relative z-10">
                  <Handshake className="absolute top-5 right-5 scale-[6] text-white/10 rotate-45 w-4 h-4" />
                  Handshake Level
                </CardTitle>
                <p className="text-3xl sm:text-5xl font-bold my-auto relative z-10">
                  {handshakeStats?.handshakeLevel ?? 1}
                </p>
                <p className="flex flex-row gap-2 text-xs text-white/80 relative z-10">
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
                    <p className="text-2xl font-bold">{requestsCount}</p>
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
              <Button
                variant="outline"
                className="w-full justify-center h-full p-2 sm:p-auto"
                onClick={() =>
                  router.push(ROUTES.AUTHENTICATED.HANDSHAKE_MY_SUBMISSIONS)
                }
              >
                <LayoutPanelLeft className="absolute sm:static left-0 top-0 scale-[2] text-black/10 dark:text-white/15 sm:left-auto sm:top-auto sm:scale-[1] sm:text-black dark:sm:text-white mr-2 h-4 w-4" />
                <p>My Submissions</p>
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

            <TabsContent value="available">
              <AvailableDevelopersSection
                apps={availableApps ?? []}
                isLoading={availableIsPending}
              />
            </TabsContent>

            <TabsContent value="requests">
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleRequestsSubTabChange("incoming")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    requestsSubTab === "incoming"
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                  }`}
                >
                  Incoming
                  {(incoming?.pagination?.total ?? 0) > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-4 px-1 text-[10px]"
                    >
                      {incoming!.pagination.total}
                    </Badge>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleRequestsSubTabChange("outgoing")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    requestsSubTab === "outgoing"
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                  }`}
                >
                  Outgoing
                  {/* S7-9: PENDING-only badge, symmetric with Incoming */}
                  {(pendingOutgoing?.pagination?.total ?? 0) > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-4 px-1 text-[10px]"
                    >
                      {pendingOutgoing!.pagination.total}
                    </Badge>
                  )}
                </button>
              </div>

              {requestsSubTab === "incoming" ? (
                <IncomingRequestsSection
                  items={incoming?.items ?? []}
                  isLoading={incomingLoading}
                />
              ) : (
                <OutgoingRequestsSection
                  items={outgoing?.items ?? []}
                  isLoading={outgoingLoading}
                  showHistory={showOutgoingHistory}
                  onToggleHistory={() => setShowOutgoingHistory((v) => !v)}
                />
              )}
            </TabsContent>

            <TabsContent value="running">
              <ExistingHandshakesSection
                apps={runningApps}
                isLoading={inTestingPending || approvedPending}
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

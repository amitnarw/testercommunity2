"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  LayoutPanelLeft,
  Activity,
  Handshake,
} from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CustomTabsList } from "@/components/custom-tabs-list";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useHubAppsCount, useHubData, useHubStats } from "@/hooks/useHub";
import { useUserProfileData } from "@/hooks/useUser";
import { DiscoverySourceModal } from "@/components/discovery-source-modal";
import { AppCardSkeleton } from "@/components/app-card-skeleton";
import { ROUTES } from "@/lib/routes";
import { getMyHandshakeSubscription } from "@/lib/apiCalls";
import { useQuery } from "@tanstack/react-query";


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

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Most Recent");
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);

  const { data: userProfileData, refetch: refetchProfile } = useUserProfileData();

  const { data: handshakeSub } = useQuery({
    queryKey: ["myHandshakeSubscription"],
    queryFn: () => getMyHandshakeSubscription(),
    retry: false,
  });
  const hasActiveSubscription =
    !!handshakeSub &&
    (handshakeSub.status === "ACTIVE" || handshakeSub.status === "AUTHENTICATED");

  useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);

  useEffect(() => {
    if (userProfileData && !userProfileData.discovery_source_answered) {
      setShowDiscoveryModal(true);
    }
  }, [userProfileData]);

  const [selectedTab, setSelectedTab] = useState(
    searchParams.get("tab") || "available",
  );
  const [requestsSubTab, setRequestsSubTab] = useState(
    (searchParams.get("tab") === "requests"
      ? searchParams.get("subtab")
      : "pending") || "pending",
  );
  const [runningSubTab, setRunningSubTab] = useState(
    (searchParams.get("tab") === "running"
      ? searchParams.get("subtab")
      : "in-progress") || "in-progress",
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    const subtab = searchParams.get("subtab");
    if (tab) setSelectedTab(tab);
    if (subtab) {
      if (tab === "requests") setRequestsSubTab(subtab);
      if (tab === "running") setRunningSubTab(subtab);
    }
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
    let nextSubTab = undefined;
    if (val === "requests") nextSubTab = requestsSubTab;
    else if (val === "running") nextSubTab = runningSubTab;
    updateUrl(val, nextSubTab);
  };

  const handleRequestsSubTabChange = (val: string) => {
    setRequestsSubTab(val);
    updateUrl("requests", val);
  };

  const handleRunningSubTabChange = (val: string) => {
    setRunningSubTab(val);
    updateUrl("running", val);
  };

  const getBackendType = () => {
    if (selectedTab === "available") return "AVAILABLE";
    if (selectedTab === "running") {
      switch (runningSubTab) {
        case "in-progress":
          return "IN_TESTING";
        case "waiting-to-start":
          return "APPROVED";
        default:
          return "APPROVED";
      }
    }
    if (selectedTab === "requests") {
      switch (requestsSubTab) {
        case "pending":
          return "REQUESTED";
        case "rejected":
          return "REJECTED";
        default:
          return "REQUESTED";
      }
    }
    return "AVAILABLE";
  };
  const backendType = getBackendType();

  const { data: hubDataCount, isPending: hubDataCountIsPending } =
    useHubAppsCount();

  // Requests count = Pending (requested) + Rejected
  const requestsCount =
    (hubDataCount?.["REQUESTED"] || 0) + (hubDataCount?.["REJECTED"] || 0);

  // Running count = Active (in_testing) + Approved (accepted)
  const runningCount =
    (hubDataCount?.["IN_TESTING"] || 0) + (hubDataCount?.["ACCEPTED"] || 0);

  const completedCount = hubDataCount?.["COMPLETED"] || 0;

  const tabs = [
    {
      label: "Available",
      value: "available",
      count: hubDataCount?.["AVAILABLE"] || 0,
      icon: Activity,
      description: "Browse & apply for testing",
    },
    {
      label: "Requests",
      value: "requests",
      count: requestsCount,
      icon: Activity,
      description: "App approvals & rejections",
    },
    {
      label: "Running",
      value: "running",
      count: runningCount,
      icon: Activity,
      description: "Active tests & approved apps",
    },
  ];

  const requestTabs = [
    {
      label: "Awaiting Approval",
      value: "pending",
      count: hubDataCount?.["REQUESTED"] || 0,
    },
    {
      label: "Rejected",
      value: "rejected",
      count: hubDataCount?.["REJECTED"] || 0,
    },
  ];

  const runningSubTabs = [
    {
      label: "In Progress",
      value: "in-progress",
      count: hubDataCount?.["IN_TESTING"] || 0,
    },
    {
      label: "Waiting to Start",
      value: "waiting-to-start",
      count: hubDataCount?.["ACCEPTED"] || 0,
    },
  ];

  const { data: hubData, isPending: hubIsPending } = useHubData();
  const { data: handshakeStats } = useHubStats();

  const appsSubmitted = hubData?.appsSubmitted || 0;
  const testersEngaged = hubData?.testersEngaged || 0;
  const testsCompleted = hubData?.testsCompleted || 0;

  const openPage = (page: string) => {
    router.push(page);
  };

  return (
    <div data-loc="CommunityDashboardPage" className="min-h-screen mb-8">
      {/* Blurred background content */}
      <div className="blur-sm pointer-events-none select-none">
        <DiscoverySourceModal
          open={showDiscoveryModal}
          onComplete={() => setShowDiscoveryModal(false)}
        />
        <div className="container mx-auto px-4 md:px-6">
          <header className="mb-12">
            <div className="mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-emerald-600 to-emerald-700 bg-clip-text text-transparent leading-[unset] pb-2">
                  Handshake Testing
                </h1>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  Beta
                </Badge>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
                Offer your app, test a peer&apos;s app, and level up. A monthly
                subscription unlocks publishing and joining handshake tests.
              </p>
              {hasActiveSubscription && (
                <Link
                  href={ROUTES.AUTHENTICATED.SUBSCRIPTION_MANAGE}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors mt-2"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  Manage Subscription
                </Link>
              )}
            </div>
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
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Handshake className="absolute top-5 left-5 scale-[6] text-white/20 rotate-45 w-4 h-4" />{" "}
                    Handshake Level
                  </CardTitle>
                  <p className="text-3xl sm:text-5xl font-bold text-center my-auto">
                    {handshakeStats?.handshakeLevel}
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
                  className="w-full justify-start h-full bg-gradient-to-b from-emerald-600 to-emerald-700 text-white p-2 sm:p-auto"
                >
                  <PlusCircle className="absolute sm:static left-0 top-0 scale-[2] text-white/20 sm:left-auto sm:top-auto sm:scale-[1] sm:text-white mr-2 h-4 w-4" />
                  <p className="text-center sm:text-start w-full">
                    Submit New App
                  </p>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-full p-2 sm:p-auto"
                >
                  <LayoutPanelLeft className="absolute sm:static left-0 top-0 scale-[2] text-black/10 dark:text-white/15 sm:left-auto sm:top-auto sm:scale-[1] sm:text-black dark:sm:text-white mr-2 h-4 w-4" />
                  <p className="text-center sm:text-start w-full">
                    My Submissions
                  </p>
                </Button>
              </BentoCard>
            </div>
          </header>

          <main>
            <Tabs value={selectedTab} className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Available Apps</h2>
                  <p className="text-muted-foreground">
                    Browse apps that need testing from the community.
                  </p>
                </div>
              </div>
              <CustomTabsList
                tabs={tabs}
                activeTab={selectedTab}
                className="sticky top-0 z-30 backdrop-blur-xl py-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6"
              />
              <TabsContent value="available">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <AppCardSkeleton key={i} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
          <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 mb-6">
            {"COMING SOON".split("").map((char, i) => (
              <motion.span
                key={i}
                className={`inline-block text-3xl sm:text-5xl md:text-7xl font-black text-primary ${char === " " ? "w-2 sm:w-4 md:w-6" : ""}`}
                animate={{
                  y: [0, i % 2 === 0 ? -12 : 10, 0],
                }}
                transition={{
                  duration: 3 + (i % 3) * 0.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.1,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="text-sm sm:text-base text-muted-foreground max-w-md mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Handshake Testing is currently under development. We&apos;re working hard
            to bring you the best peer-to-peer testing experience. Stay tuned!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button
              asChild
              className="rounded-full px-6 py-5 text-base bg-gradient-to-br from-primary to-primary/20"
            >
              <Link href="/">Go Home</Link>
            </Button>
          </motion.div>
        </div>
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

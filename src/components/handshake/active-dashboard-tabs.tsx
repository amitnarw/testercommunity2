"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MyTaskRow } from "./my-task-row";
import { TestersTab } from "./testers-tab";
import { AddonsSection } from "./addons-section";
import { useMyPenalties } from "@/hooks/usePenalty";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { TesterStatus } from "@/lib/types";

interface ActiveDashboardTabsProps {
  campaignId: number;
  status: string;
  currentDay: number;
  totalDays: number;
  testingEndDate?: string;
  currentTester: number;
  totalTester: number;
  testers: Array<{
    id: number;
    status: TesterStatus;
    tester: { id: string; name: string; image: string | null; handshakeLevel?: number; eliteBadge?: boolean };
    daysCompleted?: number;
    totalDays?: number;
  }>;
  myTasks?: Array<{
    appId: number;
    appName: string;
    appLogoUrl: string;
    packageName?: string;
    status: string;
    currentDay: number;
    totalDays: number;
    deadline?: string;
    proofRequired: boolean;
  }>;
  /** S8-G6: initial tab (used by the penalty-mode Add-ons-only view). */
  defaultTab?: string;
  /** S8-G6: tabs the user may not open (rendered disabled). */
  disabledTabs?: string[];
}

export function ActiveDashboardTabs({
  campaignId,
  status,
  currentDay,
  totalDays,
  testingEndDate,
  currentTester,
  totalTester,
  testers,
  myTasks,
  defaultTab = "overview",
  disabledTabs = [],
}: ActiveDashboardTabsProps) {
  const [tab, setTab] = useState(defaultTab);
  const { data: penaltyData } = useMyPenalties();
  const activePenalties = penaltyData?.active?.length ?? 0;

  const isTabDisabled = (value: string) => disabledTabs.includes(value);

  return (
    <Tabs
      value={isTabDisabled(tab) ? "addons" : tab}
      onValueChange={(v) => {
        if (!isTabDisabled(v)) setTab(v);
      }}
      className="space-y-4"
    >
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="overview" disabled={isTabDisabled("overview")}>Overview</TabsTrigger>
        <TabsTrigger value="my-task" disabled={isTabDisabled("my-task")}>My Task</TabsTrigger>
        <TabsTrigger value="testers" disabled={isTabDisabled("testers")}>Testers</TabsTrigger>
        <TabsTrigger value="penalty" className="relative" disabled={isTabDisabled("penalty")}>
          Penalty
          {activePenalties > 0 && (
            <Badge variant="destructive" className="ml-1 h-4 px-1 text-[10px]">
              {activePenalties}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="addons" disabled={isTabDisabled("addons")}>Add-ons</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Stat label="Status" value={status.replace(/_/g, " ")} highlight />
              <Stat label="Day" value={`${currentDay} / ${totalDays}`} />
              <Stat label="Testers" value={`${currentTester} / ${totalTester}`} />
              <Stat
                label="Deadline"
                value={testingEndDate ? new Date(testingEndDate).toLocaleDateString() : ", "}
              />
            </div>
            {activePenalties > 0 && (
              <Link
                href={ROUTES.AUTHENTICATED.HANDSHAKE_PENALTY}
                className="flex items-start gap-2 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 hover:bg-red-500/15 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold">
                    You have {activePenalties} active penalty {activePenalties === 1 ? "task" : "tasks"}
                  </p>
                  <p>Click here to resolve them.</p>
                </div>
              </Link>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="my-task">
        <div className="space-y-3">
          {myTasks && myTasks.length > 0 ? (
            myTasks.map((task) => (
              <MyTaskRow key={task.appId} {...task} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No active testing tasks assigned.
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="testers">
        <TestersTab
          testers={testers.map((t) => ({
            ...t,
            tester: {
              ...t.tester,
              handshakeLevel: t.tester.handshakeLevel,
              eliteBadge: t.tester.eliteBadge,
            },
          }))}
          isLoading={false}
        />
      </TabsContent>

      <TabsContent value="penalty">
        <Card>
          <CardContent className="p-6 text-center">
            {activePenalties > 0 ? (
              <>
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <p className="text-lg font-semibold text-red-600">
                  {activePenalties} active penalty {activePenalties === 1 ? "task" : "tasks"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Resolve them to restore normal access.
                </p>
                <Link
                  href={ROUTES.AUTHENTICATED.HANDSHAKE_PENALTY}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline font-semibold"
                >
                  Open Penalty page →
                </Link>
              </>
            ) : (
              <>
                <p className="text-3xl">🎉</p>
                <p className="text-lg font-semibold mt-2">No active penalties</p>
                <p className="text-sm text-muted-foreground">
                  Keep up the great work!
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="addons">
        <AddonsSection campaignId={campaignId} />
      </TabsContent>
    </Tabs>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-3 rounded-xl border ${highlight ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/60 bg-secondary/30"}`}>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
        {label}
      </p>
      <p className={`text-lg font-bold mt-1 capitalize ${highlight ? "text-emerald-600" : ""}`}>
        {value}
      </p>
    </div>
  );
}

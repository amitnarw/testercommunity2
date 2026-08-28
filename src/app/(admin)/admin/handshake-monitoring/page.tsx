"use client";

import { useState } from "react";
import { AlertCircle, Clock, Users, ShieldAlert, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMonitoringOverview,
  useWaitingCampaigns,
  usePenalizedUsers,
  useRecentMissedDays,
  useAdminReplaceTester,
  useAdminForceHandshake,
} from "@/hooks/useHandshakeMonitoring";
import { useSubmittedApps } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  HubSubmittedAppResponse,
  WaitingCampaign,
} from "@/lib/types";

export default function AdminHandshakeMonitoringPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Handshake Monitoring</h1>
        <p className="text-sm text-muted-foreground">
          Real-time overview of campaigns, testers, penalties, and missed days.
        </p>
      </header>

      <OverviewCards />

      <Tabs defaultValue="waiting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waiting">Waiting</TabsTrigger>
          <TabsTrigger value="penalized">Penalized</TabsTrigger>
          <TabsTrigger value="missed-days">Missed days</TabsTrigger>
        </TabsList>

        <TabsContent value="waiting">
          <WaitingTab />
        </TabsContent>
        <TabsContent value="penalized">
          <PenalizedTab />
        </TabsContent>
        <TabsContent value="missed-days">
          <MissedDaysTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewCards() {
  const { data, isLoading } = useMonitoringOverview();
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }
  if (!data) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <p className="text-xs">Active handshakes</p>
          </div>
          <p className="text-2xl font-bold mt-2">{data.activeHandshakes}</p>
        </CardContent>
      </Card>
      <Card className={data.waitingOver24h > 0 ? "border-red-500/30" : ""}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <p className="text-xs">Waiting &gt; 24h</p>
          </div>
          <p className={`text-2xl font-bold mt-2 ${data.waitingOver24h > 0 ? "text-red-500" : ""}`}>
            {data.waitingOver24h}
          </p>
        </CardContent>
      </Card>
      <Card className={data.activePenalties > 0 ? "border-orange-500/30" : ""}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldAlert className="w-4 h-4" />
            <p className="text-xs">Active penalties</p>
          </div>
          <p className={`text-2xl font-bold mt-2 ${data.activePenalties > 0 ? "text-orange-500" : ""}`}>
            {data.activePenalties}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <p className="text-xs">Pending requests</p>
          </div>
          <p className="text-2xl font-bold mt-2">{data.pendingRequests}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function WaitingTab() {
  const { data, isLoading } = useWaitingCampaigns();
  if (isLoading) {
    return [1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />);
  }
  const items = data?.items ?? [];
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          No campaigns waiting &gt; 24h.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-2">
      {items.map((c) => (
        <WaitingCampaignRow key={c.id} campaign={c} />
      ))}
    </div>
  );
}

/**
 * P4/M8: force-handshake was backend-complete but had NO UI. This row lets
 * the admin pair a stuck waiting campaign with any other AVAILABLE handshake
 * campaign (its owner becomes the partner), bypassing the 24h wait.
 */
function WaitingCampaignRow({ campaign }: { campaign: WaitingCampaign }) {
  const { toast } = useToast();
  const [partnerAppId, setPartnerAppId] = useState<string>("");
  const forceMutation = useAdminForceHandshake({
    onSuccess: () => {
      toast({
        title: "Handshake forced",
        description: "Both campaigns are now TESTING_ACTIVE.",
      });
      setPartnerAppId("");
    },
    onError: (err) => {
      toast({
        title: "Force failed",
        description: err?.message || "Unknown error",
        variant: "destructive",
      });
    },
  });

  const { data: availableData, isLoading: loadingAvailable } =
    useSubmittedApps("AVAILABLE");
  const candidates: HubSubmittedAppResponse[] = (availableData || []).filter(
    (a: HubSubmittedAppResponse) =>
      a.appType === "HANDSHAKE" &&
      a.id !== campaign.id &&
      (a.currentTester || 0) < (a.totalTester || 0),
  );

  const handleForce = () => {
    const partner = candidates.find(
      (c) => c.id.toString() === partnerAppId,
    );
    if (!partner) return;
    forceMutation.mutate({
      userAId: campaign.appOwnerId,
      userBId: partner.appOwnerId,
      appAId: campaign.id,
      appBId: partner.id,
    });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">
              {campaign.androidApp?.appName || `Campaign #${campaign.id}`}
            </p>
            <p className="text-xs text-muted-foreground">
              Owner: {campaign.appOwner?.name || campaign.appOwnerId}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Waiting since{" "}
              {campaign.waitingPeriodStartedAt
                ? new Date(campaign.waitingPeriodStartedAt).toLocaleString()
                : "?"}
            </p>
          </div>
          {campaign.escalatedToAdminAt && (
            <Badge variant="outline" className="bg-red-500/15 text-red-600 border-red-500/30">
              Escalated
            </Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-t border-border/50 pt-3">
          <Select value={partnerAppId} onValueChange={setPartnerAppId}>
            <SelectTrigger className="sm:w-[320px]">
              <SelectValue
                placeholder={
                  loadingAvailable
                    ? "Loading partner campaigns..."
                    : candidates.length === 0
                      ? "No available partner campaigns"
                      : "Pick a partner campaign"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {candidates.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  #{c.id} {c.androidApp?.appName || "Untitled"} ,{" "}
                  {c.appOwner?.name || c.appOwnerId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            disabled={!partnerAppId || forceMutation.isPending}
            onClick={handleForce}
          >
            Force handshake
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PenalizedTab() {
  const { data, isLoading } = usePenalizedUsers();
  if (isLoading) {
    return [1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />);
  }
  const items = data?.items ?? [];
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          No users with active penalties.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-2">
      {items.map((u) => (
        <Card key={u.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{u.name}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                <p className="text-xs mt-1">
                  {u.penaltyTasks.length} active penalty {u.penaltyTasks.length === 1 ? "task" : "tasks"}
                </p>
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                L{u.handshakeLevel}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MissedDaysTab() {
  const { data, isLoading } = useRecentMissedDays(50);
  const replaceMutation = useAdminReplaceTester();
  const { toast } = useToast();
  // H-F4 (S4e-8): track ALL in-flight replace operations so rapid clicks on
  // different rows cannot fire duplicate mutations.
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const handleReplace = (relationId: number) => {
    if (pendingIds.has(relationId)) return;
    setPendingIds((prev) => new Set(prev).add(relationId));
    replaceMutation.mutate(
      { testerRelationId: relationId },
      {
        onSuccess: (resp) => {
          const nextStep =
            (resp as { nextStep?: string } | undefined)?.nextStep ||
            "Slot is now open. Assign a replacement manually.";
          toast({
            title: "Tester replaced",
            description: nextStep,
          });
          setPendingIds((prev) => {
            const next = new Set(prev);
            next.delete(relationId);
            return next;
          });
        },
        onError: (err) => {
          toast({
            title: "Failed",
            description: err?.message || "Unknown error",
            variant: "destructive",
          });
          setPendingIds((prev) => {
            const next = new Set(prev);
            next.delete(relationId);
            return next;
          });
        },
      },
    );
  };

  if (isLoading) {
    return [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />);
  }
  const items = data?.items ?? [];
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          No recent missed days.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-2">
      {items.map((d) => (
        <Card key={d.id}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {d.testerRelation?.dashboardAndHub?.androidApp?.appName || "App"}
              </p>
              <p className="text-xs text-muted-foreground">
                {d.testerRelation?.tester?.name} · Day {d.dayNumber} ·{" "}
                {new Date(d.recordedAt).toLocaleString()}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={
                !d.testerRelationId || pendingIds.has(d.testerRelationId)
              }
              onClick={() => d.testerRelationId && handleReplace(d.testerRelationId)}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Replace
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

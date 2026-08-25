"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Clock, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SafeImage } from "@/components/safe-image";
import { EliteBadge } from "./elite-badge";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { HubSubmittedAppResponse } from "@/lib/types";

interface ExistingHandshakesSectionProps {
  apps: HubSubmittedAppResponse[];
  isLoading: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Shared ticking clock so every card's countdown/day stays fresh. */
function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function computeCurrentDay(
  testingStartDate: string | null | undefined,
  fallback: number,
  totalDay: number,
  now: number,
) {
  if (!testingStartDate) return Math.min(Math.max(fallback || 1, 1), totalDay);
  const day =
    Math.floor((now - new Date(testingStartDate).getTime()) / DAY_MS) + 1;
  return Math.min(Math.max(day, 1), totalDay);
}

function formatStartCountdown(ms: number): string {
  if (ms <= 0) return "Starting soon";
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
  return `Starts in ${minutes}m`;
}

function LevelChip({
  level,
  elite,
}: {
  level?: number;
  elite?: boolean;
}) {
  if (!level && !elite) return null;
  return (
    <span className="inline-flex items-center gap-1 flex-shrink-0">
      {level ? (
        <span className="inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-500/20 px-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
          L{level}
        </span>
      ) : null}
      {elite ? <EliteBadge size="xs" /> : null}
    </span>
  );
}

function AppLogo({ src, alt }: { src?: string | null; alt: string }) {
  return (
    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/40">
      {src ? (
        <SafeImage src={src} alt={alt} fill className="object-cover" />
      ) : null}
    </div>
  );
}

function RunningHandshakeCard({
  app,
  now,
}: {
  app: HubSubmittedAppResponse;
  now: number;
}) {
  const router = useRouter();
  const relation = app.testerRelations?.[0];
  const pair = relation?.handshakePair ?? null;
  const partner = pair?.partnerRelation ?? null;
  const totalDay = app.totalDay || 16;

  const isWaitingPeriod = app.status === "WAITING_FOR_PARTNERS";
  const isPendingStart = app.status === "ACCEPTED";
  const isActive = app.status === "IN_TESTING" || app.status === "TESTING_ACTIVE";

  const currentDay = computeCurrentDay(
    app.testingStartDate,
    app.currentDay,
    totalDay,
    now,
  );
  const todayProof = relation?.dailyVerifications?.find(
    (v) => v.dayNumber === currentDay && v.status !== "REJECTED",
  );

  const statusChip = isWaitingPeriod ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex-shrink-0">
      <Clock className="w-3 h-3" />
      {formatStartCountdown(
        app.testingStartEligibleAt
          ? new Date(app.testingStartEligibleAt).getTime() - now
          : 0,
      )}
    </span>
  ) : isPendingStart ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-600 dark:text-sky-400 flex-shrink-0">
      <Clock className="w-3 h-3" />
      Waiting to start
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
      Day {currentDay}/{totalDay}
    </span>
  );

  return (
    <Card
      className="cursor-pointer hover:border-emerald-500/40 transition-colors"
      onClick={() =>
        router.push(ROUTES.AUTHENTICATED.HANDSHAKE_TESTING + `/${app.id}`)
      }
    >
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Partner's app I'm testing + live status */}
        <div className="flex items-start gap-3">
          <AppLogo
            src={app.androidApp?.appLogoUrl}
            alt={app.androidApp?.appName || "App"}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold truncate">
                {app.androidApp?.appName || "Untitled"}
              </p>
              {statusChip}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Handshake className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              <p className="text-xs text-muted-foreground truncate">
                {app.appOwner?.name}
              </p>
              <LevelChip
                level={app.appOwner?.handshakeLevel}
                elite={app.appOwner?.eliteBadge}
              />
            </div>
          </div>
        </div>

        {/* My testing progress */}
        {relation && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Your progress</span>
              <span className="font-medium">
                {relation.daysCompleted}/{totalDay} days
              </span>
            </div>
            <Progress
              value={totalDay > 0 ? (relation.daysCompleted / totalDay) * 100 : 0}
              className="h-1.5"
            />
            {isActive && (
              <p
                className={cn(
                  "flex items-center gap-1 text-[11px]",
                  todayProof
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400",
                )}
              >
                {todayProof ? (
                  <>
                    <Check className="w-3 h-3" />
                    Today&apos;s proof submitted
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    Today&apos;s proof pending
                  </>
                )}
              </p>
            )}
            {relation.hadMissSinceStart && (
              <p className="flex items-center gap-1 text-[11px] text-red-500">
                <AlertTriangle className="w-3 h-3" />
                Missed a day , level credit at risk
              </p>
            )}
          </div>
        )}

        {/* Partner's side: their progress on my app */}
        {partner && (
          <div className="border-t border-border/40 pt-2.5 space-y-2">
            {partner.campaign?.androidApp && (
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                  {partner.campaign.androidApp.appLogoUrl ? (
                    <SafeImage
                      src={partner.campaign.androidApp.appLogoUrl}
                      alt={partner.campaign.androidApp.appName}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Testing your app
                  </p>
                  <p className="text-xs font-medium truncate">
                    {partner.campaign.androidApp.appName}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                <Handshake className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="truncate">{partner.tester.name}</span>
                <LevelChip
                  level={partner.tester.handshakeLevel}
                  elite={partner.tester.eliteBadge}
                />
              </span>
              <span className="text-muted-foreground flex-shrink-0">
                {partner.daysCompleted}/{partner.campaign?.totalDay || totalDay}{" "}
                days
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ExistingHandshakesSection({
  apps,
  isLoading,
}: ExistingHandshakesSectionProps) {
  const now = useNow();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!apps || apps.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        No active handshakes yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {apps.map((app, i) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <RunningHandshakeCard app={app} now={now} />
        </motion.div>
      ))}
    </div>
  );
}

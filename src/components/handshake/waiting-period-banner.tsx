"use client";

import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface WaitingPeriodBannerProps {
  waitingPeriodStartedAt: string | null;
  testingStartEligibleAt: string | null;
  escalatedToAdminAt: string | null;
}

function formatCountdown(targetIso: string | null): {
  hours: number;
  minutes: number;
  label: string;
} {
  if (!targetIso) return { hours: 0, minutes: 0, label: ", " };
  const ms = new Date(targetIso).getTime() - Date.now();
  if (ms <= 0) return { hours: 0, minutes: 0, label: "Ready to start" };
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  const label = hours >= 24 ? `${Math.floor(hours / 24)}d ${hours % 24}h` : `${hours}h ${minutes}m`;
  return { hours, minutes, label };
}

export function WaitingPeriodBanner({
  waitingPeriodStartedAt,
  testingStartEligibleAt,
  escalatedToAdminAt,
}: WaitingPeriodBannerProps) {
  const countdown = formatCountdown(testingStartEligibleAt);

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-amber-500/15 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold">Waiting for partners</p>
              {escalatedToAdminAt && (
                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                  Escalated to admin
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              All your testers have joined. Per spec, we&apos;re giving everyone a 24-hour
              window to complete their required actions. Testing will start
              automatically after that.
            </p>

            <div className="mt-3 p-3 rounded-lg bg-background/50 border border-border/40">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Time until testing starts</span>
                <span className="font-mono font-semibold text-foreground">
                  {countdown.label}
                </span>
              </div>
              <Progress
                value={
                  testingStartEligibleAt && waitingPeriodStartedAt
                    ? Math.min(
                        100,
                        Math.max(
                          0,
                          ((Date.now() - new Date(waitingPeriodStartedAt).getTime()) /
                            (new Date(testingStartEligibleAt).getTime() -
                              new Date(waitingPeriodStartedAt).getTime())) *
                            100,
                        ),
                      )
                    : 0
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

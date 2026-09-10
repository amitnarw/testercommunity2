"use client";

import { DeveloperCard } from "./developer-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { HubSubmittedAppResponse } from "@/lib/types";

interface AvailableDevelopersSectionProps {
  apps: HubSubmittedAppResponse[];
  isLoading: boolean;
}

export function AvailableDevelopersSection({ apps, isLoading }: AvailableDevelopersSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className="rounded-2xl overflow-hidden border-border/60"
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!apps || apps.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        No available developers right now. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {apps.map((app) => {
        const owner = app.appOwner as unknown as {
          name?: string;
          image?: string | null;
          handshakeLevel?: number;
          handshakeCompletedCount?: number;
          eliteBadge?: boolean;
        } | null;
        return (
          <DeveloperCard
            key={app.id}
            data={{
              id: app.id,
              appName: app.androidApp?.appName || "Untitled",
              appLogoUrl: app.androidApp?.appLogoUrl || "",
              packageName: app.androidApp?.packageName,
              appOwnerId: app.appOwnerId,
              appOwnerName: owner?.name || "Unknown",
              appOwnerImage: owner?.image || null,
              appOwnerLevel: owner?.handshakeLevel ?? 1,
              eliteBadge: !!owner?.eliteBadge,
              totalTester: app.totalTester,
              currentTester: app.currentTester,
              totalDay: app.totalDay ?? 16,
              averageRating: app.averageRating ?? 0,
              status: app.status,
            }}
          />
        );
      })}
    </div>
  );
}

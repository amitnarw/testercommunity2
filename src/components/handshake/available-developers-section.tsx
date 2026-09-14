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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-0 overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2 mt-1">
                  <Skeleton className="h-5 w-20 rounded-full ml-auto" />
                  <Skeleton className="h-3 w-24 ml-auto" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="pt-2 space-y-3">
                <Skeleton className="h-px w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-9 w-full rounded-lg" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              description: app.androidApp?.description || "",
              category: app.androidApp?.appCategory?.name || "",
              minimumAndroidVersion: app.minimumAndroidVersion ?? 0,
              totalDay: app.totalDay ?? 16,
              averageRating: app.averageRating ?? 0,
              appOwnerId: app.appOwnerId,
              appOwnerName: owner?.name || "Unknown",
              appOwnerImage: owner?.image || null,
              appOwnerLevel: owner?.handshakeLevel ?? 0,
              eliteBadge: !!owner?.eliteBadge,
              totalTester: app.totalTester,
              currentTester: app.currentTester,
              status: app.status,
            }}
          />
        );
      })}
    </div>
  );
}

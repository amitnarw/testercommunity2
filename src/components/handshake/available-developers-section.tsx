"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DeveloperCard } from "./developer-card";
import { useUserProfileData } from "@/hooks/useUser";
import { useHubSubmittedApp } from "@/hooks/useHub";
import { ROUTES } from "@/lib/routes";
import type { HubSubmittedAppResponse } from "@/lib/types";

interface AvailableDevelopersSectionProps {
  apps: HubSubmittedAppResponse[];
  isLoading: boolean;
}

export function AvailableDevelopersSection({ apps, isLoading }: AvailableDevelopersSectionProps) {
  const router = useRouter();
  // useUserProfileData is registered with enabled:false ,  trigger the fetch
  // on mount so currentUserId is populated for the isOwn check.
  // S6-10: `isFetching` is true while that manual refetch is in flight, so we
  // can render a skeleton instead of flashing "Sign in" at logged-in users.
  const {
    data: profileData,
    refetch: refetchProfile,
    isFetching: profileFetching,
    isError: profileError,
  } = useUserProfileData();
  const { data: myAvailableApps } = useHubSubmittedApp({ type: "AVAILABLE" });
  // P3.5: a developer whose only campaign is WAITING_FOR_PARTNERS or
  // TESTING_ACTIVE still owns a published handshake app ,  without querying
  // the testing bucket they got a false "Publish an app first" dead-end.
  const { data: myTestingApps } = useHubSubmittedApp({
    type: "IN_TESTING",
    options: { enabled: true },
  });

  useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);

  // UserProfileDataAttributes.userId (string) is the User.id that matches
  // appOwnerId. The numeric `id` field is a userDetail row id and never
  // matches (prior audit item H8).
  const currentUserId = profileData?.userId ?? undefined;
  const hasOwnPublishedApp =
    [...(myAvailableApps || []), ...(myTestingApps || [])].some(
      (a) => a.appType === "HANDSHAKE",
    );

  if (profileFetching && !currentUserId) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  // S7-9: distinguish "profile fetch failed" from "signed out". The hook is
  // retry:false + enabled:false, so without this branch a single transient
  // error would permanently show the wrong CTA to logged-in users.
  if (!currentUserId && profileError) {
    return (
      <div className="rounded-xl border border-dashed border-destructive/40 p-8 text-center text-sm text-muted-foreground">
        <p>Couldn&apos;t load your profile.</p>
        <button
          type="button"
          onClick={() => refetchProfile()}
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 h-9 text-sm font-semibold text-white hover:bg-emerald-500/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        <p>Sign in to see developers you can handshake with.</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.AUTH.LOGIN)}
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 h-9 text-sm font-semibold text-white hover:bg-emerald-500/90"
        >
          Sign in
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4">
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
            currentUserId={currentUserId}
            hasOwnPublishedApp={hasOwnPublishedApp}
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
              status: app.status,
            }}
          />
        );
      })}
    </div>
  );
}
